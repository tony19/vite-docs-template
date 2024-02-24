# API Runtime Vite

:::warning API Tingkat Rendah
API ini diperkenalkan dalam Vite 5.1 sebagai fitur eksperimental. Ini ditambahkan untuk [mengumpulkan umpan balik](https://github.com/vitejs/vite/discussions/15774). Kemungkinan akan ada perubahan yang memecahkan dalam Vite 5.2, jadi pastikan untuk mengunci versi Vite ke `~5.1.0` saat menggunakannya. Ini adalah API tingkat rendah yang ditujukan untuk penulis pustaka dan kerangka kerja. Jika tujuan Anda adalah membuat aplikasi, pastikan untuk memeriksa plugin dan alat SSR tingkat lebih tinggi di [Bagian SSR Awesome Vite](https://github.com/vitejs/awesome-vite#ssr) terlebih dahulu.
:::

"Vite Runtime" adalah alat yang memungkinkan menjalankan kode apa pun dengan memprosesnya terlebih dahulu dengan plugin Vite. Ini berbeda dari `server.ssrLoadModule` karena implementasi runtime terpisah dari server. Hal ini memungkinkan penulis pustaka dan kerangka kerja untuk mengimplementasikan lapisan komunikasi mereka sendiri antara server dan runtime.

Salah satu tujuan fitur ini adalah menyediakan API yang dapat disesuaikan untuk memproses dan menjalankan kode. Vite menyediakan cukup banyak alat untuk menggunakan Vite Runtime langsung, tetapi pengguna dapat membangunnya jika kebutuhan mereka tidak sejalan dengan implementasi bawaan Vite.

Semua API dapat diimpor dari `vite/runtime` kecuali dinyatakan lain.

## `ViteRuntime`

**Tanda Tangan Tipe:**

```ts
export class ViteRuntime {
  constructor(
    public options: ViteRuntimeOptions,
    public runner: ViteModuleRunner,
    private debug?: ViteRuntimeDebugger,
  ) {}
  /**
   * URL untuk dieksekusi. Menerima jalur file, jalur server, atau id relatif terhadap root.
   */
  public async executeUrl<T = any>(url: string): Promise<T>
  /**
   * Titik masuk URL untuk dieksekusi. Menerima jalur file, jalur server, atau id relatif terhadap root.
   * Dalam kasus muat ulang penuh yang dipicu oleh HMR, ini adalah modul yang akan dimuat ulang.
   * Jika metode ini dipanggil beberapa kali, semua titik masuk akan dimuat ulang satu per satu.
   */
  public async executeEntrypoint<T = any>(url: string): Promise<T>
  /**
   * Bersihkan semua cache termasuk pendengar HMR.
   */
  public clearCache(): void
  /**
   * Membersihkan semua cache, menghapus semua pendengar HMR, dan mengatur ulang dukungan peta sumber.
   * Metode ini tidak menghentikan koneksi HMR.
   */
  public async destroy(): Promise<void>
  /**
   * Mengembalikan `true` jika runtime telah dihancurkan dengan memanggil metode `destroy()`.
   */
  public isDestroyed(): boolean
}
```

::: tip Penggunaan Lanjutan
Jika Anda baru saja bermigrasi dari `server.ssrLoadModule` dan ingin mendukung HMR, pertimbangkan untuk menggunakan [`createViteRuntime`](#createviteruntime) sebagai gantinya.
:::

Kelas `ViteRuntime` memerlukan opsi `root` dan `fetchModule` saat diinisialisasi. Vite mengekspos `ssrFetchModule` pada instance [`server`](/guide/api-javascript) untuk integrasi yang lebih mudah dengan Vite SSR. Vite juga mengekspor `fetchModule` dari titik masuk utamanya - tidak membuat asumsi tentang bagaimana kode berjalan seperti `ssrFetchModule` yang mengharapkan kode berjalan menggunakan `new Function`. Hal ini dapat dilihat dalam peta sumber yang dikembalikan oleh fungsi-fungsi ini.

Runner dalam `ViteRuntime` bertanggung jawab untuk mengeksekusi kode. Vite mengekspor `ESModulesRunner` secara langsung, menggunakan `new AsyncFunction` untuk menjalankan kode. Anda dapat menyediakan implementasi Anda sendiri jika runtime JavaScript Anda tidak mendukung evaluasi yang tidak aman.

Dua metode utama yang diungkapkan runtime adalah `executeUrl` dan `executeEntrypoint`. Satu-satunya perbedaan antara keduanya adalah bahwa semua modul yang dieksekusi oleh `executeEntrypoint` akan dieksekusi ulang jika HMR memicu acara `full-reload`. Perhatikan bahwa Vite Runtime tidak memperbarui objek `exports` ketika ini terjadi (ini menimpanya), Anda perlu menjalankan `executeUrl` atau mendapatkan modul dari `moduleCache` lagi jika Anda mengandalkan memiliki objek `exports` terbaru.

**Contoh Penggunaan:**

```js
import { ViteRuntime, ESModulesRunner } from 'vite/runtime'
import { root, fetchModule } from './rpc-implementation.js'

const runtime = new ViteRuntime(
  {
    root,
    fetchModule,
    // Anda juga dapat menyediakan hmr.connection untuk mendukung HMR
  },
  new ESModulesRunner(),
)

await runtime.executeEntrypoint('/src/entry-point.js')
```

## `ViteRuntimeOptions`

```ts
export interface ViteRuntimeOptions {
  /**
   * Akar proyek
   */
  root: string
  /**
   * Sebuah metode untuk mendapatkan informasi tentang modul.
   * Untuk SSR, Vite mengekspos fungsi `server.ssrFetchModule` yang dapat Anda gunakan di sini.
   * Untuk kasus penggunaan runtime lainnya, Vite juga mengekspos `fetchModule` dari titik masuk utamanya.
   */
  fetchModule: FetchFunction
  /**
   * Konfigurasikan cara peta sumber dipecahkan. Lebih suka `node` jika `process.setSourceMapsEnabled` tersedia.
   * Jika tidak, akan menggunakan `prepareStackTrace` secara default yang menimpa metode `Error.prepareStackTrace`.
   * Anda dapat menyediakan objek untuk mengkonfigurasi bagaimana isi file dan peta sumber dipecahkan untuk file yang tidak diproses oleh Vite.
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions
  /**
   * Nonaktifkan HMR atau konfigurasikan opsi HMR.
   */
  hmr?:
    | false
    | {
        /**
         * Konfigurasikan bagaimana HMR berkomunikasi antara klien dan server.
         */
        connection: HMRRuntimeConnection
        /**
         * Konfigurasi logger HMR.
         */
        logger?: false | HMRLogger
      }
  /**
   * Cache modul kustom. Jika tidak disediakan, akan membuat cache modul terpisah untuk setiap instance ViteRuntime.
   */
  moduleCache?: ModuleCacheMap
}
```

## `ViteModuleRunner`

**Tanda Tangan Tipe:**

```ts
export interface ViteModuleRunner {
  /**
   * Menjalankan kode yang telah diubah oleh Vite.
   * @param context Konteks fungsi
   * @param code Kode yang telah diubah
   * @param id ID yang digunakan untuk mengambil modul
   */
  runViteModule(
    context: ViteRuntimeModuleContext,
    code: string,
    id: string,
  ): Promise<any>
  /**
   * Menjalankan modul eksternal.
   * @param file URL File ke modul eksternal
   */
  runExternalModule(file: string): Promise<any>
}
```

Vite mengekspor `ESModulesRunner` yang mengimplementasikan antarmuka ini secara default. Ini menggunakan `new AsyncFunction` untuk menjalankan kode, jadi jika kode memiliki peta sumber yang dimasukkan, harus berisi [offset dari 2 baris](https://tc39.es/ecma262/#sec-createdynamicfunction) untuk menampung baris baru yang ditambahkan. Ini dilakukan secara otomatis oleh `server.ssrFetchModule`. Jika implementasi runner Anda tidak memiliki kendala ini, Anda harus menggunakan `fetchModule` (diekspor dari `vite`) langsung.

## HMRRuntimeConnection

**Tanda Tangan Tipe:**

```ts
export interface HMRRuntimeConnection {
  /**
   * Diperiksa sebelum mengirim pesan ke klien.
   */
  isReady(): boolean
  /**
   * Mengirim pesan ke klien.
   */
  send(message: string): void
  /**
   * Konfigurasikan bagaimana HMR ditangani ketika koneksi ini memicu pembaruan.
   * Metode ini mengharapkan bahwa koneksi akan mulai mendengarkan pembaruan HMR dan memanggil panggilan balik ini ketika diterima.
   */
  onUpdate(callback: (payload: HMRPayload) => void): void
}
```

Antarmuka ini mendefinisikan bagaimana komunikasi HMR didirikan. Vite mengekspor `ServerHMRConnector` dari titik masuk utama untuk mendukung HMR selama Vite SSR. Metode `isReady` dan `send` biasanya dipanggil ketika peristiwa khusus dipicu (seperti, `import.meta.hot.send("my-event")`).

`onUpdate` hanya dipanggil sekali saat runtime baru diinisialisasi. Ini meneruskan metode yang harus dipanggil ketika koneksi memicu peristiwa HMR. Implementasinya bergantung pada jenis koneksi (sebagai contoh, bisa berupa `WebSocket`/`EventEmitter`/`MessageChannel`), tetapi biasanya terlihat seperti ini:

```js
function onUpdate(callback) {
  this.connection.on('hmr', (event) => callback(event.data))
}
```

Callback ini dijadwalkan dan akan menunggu pembaruan saat ini diselesaikan sebelum memproses pembaruan berikutnya. Berbeda dengan implementasi browser, pembaruan HMR di Vite Runtime menunggu sampai semua pendengar (seperti, `vite:beforeUpdate`/`vite:beforeFullReload`) selesai sebelum memperbarui modul.

## `createViteRuntime`

**Tanda Tangan Tipe:**

```ts
async function createViteRuntime(
  server: ViteDevServer,
  options?: MainThreadRuntimeOptions,
): Promise<ViteRuntime>
```

**Contoh Penggunaan:**

```js
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  const server = await createServer({
    root: __dirname,
  })
  await server.listen()

  const runtime = await createViteRuntime(server)
  await runtime.executeEntrypoint('/src/entry-point.js')
})()
```

Metode ini berfungsi sebagai pengganti yang mudah untuk `server.ssrLoadModule`. Berbeda dengan `ssrLoadModule`, `createViteRuntime` menyediakan dukungan HMR secara langsung. Anda dapat meneruskan [`options`](#mainthreadruntimeoptions) untuk menyesuaikan perilaku runtime SSR agar sesuai dengan kebutuhan Anda.

## `MainThreadRuntimeOptions`

```ts
export interface MainThreadRuntimeOptions
  extends Omit<ViteRuntimeOptions, 'root' | 'fetchModule' | 'hmr'> {
  /**
   * Menonaktifkan HMR atau mengonfigurasi logger HMR.
   */
  hmr?:
    | false
    | {
        logger?: false | HMRLogger
      }
  /**
   * Memberikan runner modul kustom. Ini mengontrol bagaimana kode dieksekusi.
   */
  runner?: ViteModuleRunner
}
```
