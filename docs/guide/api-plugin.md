# API Plugin

Plugin Vite memperluas antarmuka plugin Rollup yang dirancang dengan baik dengan beberapa opsi khusus Vite tambahan. Sebagai hasilnya, Anda dapat menulis plugin Vite sekali dan membuatnya berfungsi untuk pengembangan dan pembangunan.

**Disarankan untuk membaca terlebih dahulu [dokumentasi plugin Rollup](https://rollupjs.org/plugin-development/) sebelum membaca bagian di bawah ini.**

## Menulis Sebuah Plugin

Vite berusaha untuk menawarkan pola yang sudah mapan secara otomatis, jadi sebelum membuat plugin baru pastikan Anda memeriksa [panduan Fitur](https://vitejs.dev/guide/features) untuk melihat apakah kebutuhan Anda sudah tercakup. Juga tinjau plugin komunitas yang tersedia, baik dalam bentuk [plugin Rollup yang kompatibel](https://github.com/rollup/awesome) maupun [Plugin Khusus Vite](https://github.com/vitejs/awesome-vite#plugins).

Ketika membuat sebuah plugin, Anda dapat menempatkannya secara langsung di dalam `vite.config.js`. Tidak perlu membuat paket baru untuk itu. Setelah Anda melihat bahwa sebuah plugin berguna dalam proyek Anda, pertimbangkan untuk membagikannya untuk membantu orang lain [di ekosistem](https://chat.vitejs.dev).

::: tip
Ketika belajar, debugging, atau menulis plugin, disarankan untuk menyertakan [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) dalam proyek Anda. Ini memungkinkan Anda untuk memeriksa status perantara plugin Vite. Setelah menginstal, Anda dapat mengunjungi `localhost:5173/__inspect/` untuk memeriksa modul dan tumpukan transformasi proyek Anda. Periksa instruksi instalasi di [dokumentasi vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect).
![vite-plugin-inspect](/images/vite-plugin-inspect.png)
:::

## Konvensi

Jika plugin tidak menggunakan kait khusus Vite dan dapat diimplementasikan sebagai [Plugin Rollup Kompatibel](#rollup-plugin-compatibility), maka disarankan untuk menggunakan [Konvensi Penamaan Plugin Rollup](https://rollupjs.org/plugin-development/#conventions).

- Plugin Rollup harus memiliki nama yang jelas dengan awalan `rollup-plugin-`.
- Sertakan kata kunci `rollup-plugin` dan `vite-plugin` di dalam package.json.

Ini mengekspos plugin agar juga dapat digunakan dalam proyek Rollup murni atau berbasis WMR.

Untuk plugin hanya untuk Vite

- Plugin Vite harus memiliki nama yang jelas dengan awalan `vite-plugin-`.
- Sertakan kata kunci `vite-plugin` di dalam package.json.
- Sertakan bagian dalam dokumen plugin yang menjelaskan mengapa itu adalah plugin khusus Vite (misalnya, menggunakan kait plugin khusus Vite).

Jika plugin Anda hanya akan berfungsi untuk kerangka kerja tertentu, namanya harus disertakan sebagai bagian dari awalan

- Awalan `vite-plugin-vue-` untuk Plugin Vue
- Awalan `vite-plugin-react-` untuk Plugin React
- Awalan `vite-plugin-svelte-` untuk Plugin Svelte

Lihat juga [Konvensi Modul Virtual](#virtual-modules-convention).

## Konfigurasi Plugin

Pengguna akan menambahkan plugin ke `devDependencies` proyek dan mengonfigurasikannya menggunakan opsi array `plugins`.

```js
// vite.config.js
import vitePlugin from 'vite-plugin-feature'
import rollupPlugin from 'rollup-plugin-feature'

export default defineConfig({
  plugins: [vitePlugin(), rollupPlugin()],
})
```

Plugin yang bernilai falsy akan diabaikan, yang dapat digunakan untuk dengan mudah mengaktifkan atau menonaktifkan plugin.

`plugins` juga menerima preset termasuk beberapa plugin sebagai elemen tunggal. Ini berguna untuk fitur yang kompleks (seperti integrasi kerangka kerja) yang diimplementasikan menggunakan beberapa plugin. Array akan diratakan secara internal.

```js
// framework-plugin
import frameworkRefresh from 'vite-plugin-framework-refresh'
import frameworkDevtools from 'vite-plugin-framework-devtools'

export default function framework(config) {
  return [frameworkRefresh(config), frameworkDevTools(config)]
}
```

```js
// vite.config.js
import { defineConfig } from 'vite'
import framework from 'vite-plugin-framework'

export default defineConfig({
  plugins: [framework()],
})
```

## Contoh Sederhana

:::tip
Sudah menjadi konvensi umum untuk menulis plugin Vite/Rollup sebagai fungsi pabrik yang mengembalikan objek plugin aktual. Fungsi tersebut dapat menerima opsi yang memungkinkan pengguna menyesuaikan perilaku plugin.
:::

### Mengubah Jenis File Kustom

```js
const fileRegex = /\.(my-file-ext)$/

export default function myPlugin() {
  return {
    name: 'transform-file',

    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compileFileToJS(src),
          map: null, // berikan peta sumber jika tersedia
        }
      }
    },
  }
}
```

### Mengimpor Modul Virtual

Lihat contoh di [bagian selanjutnya](#virtual-modules-convention).

## Konvensi Modul Virtual

Modul virtual adalah skema yang berguna yang memungkinkan Anda untuk meneruskan informasi waktu pembangunan ke file sumber menggunakan sintaks impor ESM normal.

```js
export default function myPlugin() {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'my-plugin', // diperlukan, akan muncul dalam peringatan dan kesalahan
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const msg = "from virtual module"`
      }
    },
  }
}
```

Yang memungkinkan mengimpor modul dalam JavaScript:

```js
import { msg } from 'virtual:my-module'

console.log(msg)
```

Modul virtual dalam Vite (dan Rollup) diawali dengan `virtual:` untuk jalur yang terlihat oleh pengguna menurut konvensi. Jika memungkinkan, nama plugin harus digunakan sebagai namespace untuk menghindari tabrakan dengan plugin lain dalam ekosistem. Sebagai contoh, sebuah `vite-plugin-posts` bisa meminta pengguna untuk mengimpor modul virtual `virtual:posts` atau `virtual:posts/helpers` untuk mendapatkan informasi waktu pembangunan. Secara internal, plugin yang menggunakan modul virtual harus menambahkan awalan `\0` pada ID modul, sebuah konvensi dari ekosistem rollup. Hal ini mencegah plugin lain mencoba memproses ID (seperti resolusi node), dan fitur inti seperti sourcemaps dapat menggunakan informasi ini untuk membedakan antara modul virtual dan file reguler. `\0` bukan karakter yang diperbolehkan dalam URL impor sehingga kita harus menggantinya selama analisis impor. Sebuah id virtual `\0{id}` akan dienkripsi sebagai `/@id/__x00__{id}` selama pengembangan di browser. Id akan didekode kembali sebelum memasuki pipeline plugin, sehingga ini tidak terlihat oleh kode hook plugin.

Perlu diingat bahwa modul yang langsung berasal dari file nyata, seperti dalam kasus modul skrip dalam Komponen File Tunggal (seperti .vue atau .svelte SFC) tidak perlu mengikuti konvensi ini. SFC pada umumnya menghasilkan serangkaian submodul saat diproses tetapi kode di dalamnya dapat dipetakan kembali ke sistem file. Menggunakan `\0` untuk submodul ini akan mencegah sourcemaps berfungsi dengan benar.

## Hook Universal

Selama pengembangan, server pengembangan Vite membuat kontainer plugin yang memanggil [Rollup Build Hooks](https://rollupjs.org/plugin-development/#build-hooks) dengan cara yang sama seperti yang dilakukan oleh Rollup.

Hook-hook berikut dipanggil sekali saat server dimulai:

- [`options`](https://rollupjs.org/plugin-development/#options)
- [`buildStart`](https://rollupjs.org/plugin-development/#buildstart)

Hook-hook berikut dipanggil pada setiap permintaan modul yang masuk:

- [`resolveId`](https://rollupjs.org/plugin-development/#resolveid)
- [`load`](https://rollupjs.org/plugin-development/#load)
- [`transform`](https://rollupjs.org/plugin-development/#transform)

Hook-hook ini juga memiliki parameter `options` yang diperpanjang dengan properti khusus Vite tambahan. Anda dapat membaca lebih lanjut di [dokumentasi SSR](/guide/ssr#ssr-specific-plugin-logic).

Beberapa panggilan `resolveId` mungkin memiliki nilai `importer` berupa path absolut untuk `index.html` generik di root karena tidak selalu memungkinkan untuk mendapatkan `importer` aktual karena pola server pengembangan yang tidak terikat Vite. Untuk impor yang ditangani dalam pipeline resolusi Vite, `importer` dapat dilacak selama fase analisis impor, memberikan nilai `importer` yang benar.

Hook-hook berikut dipanggil saat server ditutup:

- [`buildEnd`](https://rollupjs.org/plugin-development/#buildend)
- [`closeBundle`](https://rollupjs.org/plugin-development/#closebundle)

Perlu dicatat bahwa hook [`moduleParsed`](https://rollupjs.org/plugin-development/#moduleparsed) **tidak** dipanggil selama pengembangan, karena Vite menghindari penguraian AST penuh untuk kinerja yang lebih baik.

[Hook-hook Generasi Output](https://rollupjs.org/plugin-development/#output-generation-hooks) (kecuali `closeBundle`) **tidak** dipanggil selama pengembangan. Anda dapat menganggap server pengembangan Vite hanya memanggil `rollup.rollup()` tanpa memanggil `bundle.generate()`.

## Hook Khusus Vite

Plugin Vite juga dapat menyediakan hook yang melayani tujuan khusus Vite. Hook-hook ini diabaikan oleh Rollup.

### `config`

- **Tipe:** `(config: UserConfig, env: { mode: string, command: string }) => UserConfig | null | void`
- **Jenis:** `async`, `sequential`

  Modifikasi konfigurasi Vite sebelum diresolusi. Hook ini menerima konfigurasi pengguna mentah (opsi CLI digabungkan dengan file konfigurasi) dan lingkungan konfigurasi saat ini yang mengekspos `mode` dan `command` yang digunakan. Ini dapat mengembalikan objek konfigurasi parsial yang akan digabungkan secara mendalam ke dalam konfigurasi yang ada, atau langsung memutasi konfigurasi (jika penggabungan default tidak dapat mencapai hasil yang diinginkan).

  **Contoh:**

  ```js
  // kembalikan konfigurasi parsial (direkomendasikan)
  const partialConfigPlugin = () => ({
    name: 'return-partial',
    config: () => ({
      resolve: {
        alias: {
          foo: 'bar',
        },
      },
    }),
  })

  // ubah konfigurasi langsung (gunakan hanya jika penggabungan tidak berhasil)
  const mutateConfigPlugin = () => ({
    name: 'mutate-config',
    config(config, { command }) {
      if (command === 'build') {
        config.root = 'foo'
      }
    },
  })
  ```

  ::: warning Catatan
  Plugin pengguna diresolusi sebelum menjalankan hook ini sehingga menyuntikkan plugin lain di dalam hook `config` tidak akan memiliki efek apa pun.
  :::

### `configResolved`

- **Tipe:** `(config: ResolvedConfig) => void | Promise<void>`
- **Jenis:** `async`, `parallel`

  Dipanggil setelah konfigurasi Vite diresolusi. Gunakan hook ini untuk membaca dan menyimpan konfigurasi akhir yang sudah diresolusi. Ini juga berguna ketika plugin perlu melakukan sesuatu yang berbeda berdasarkan perintah yang dijalankan.

  **Contoh:**

  ```js
  const examplePlugin = () => {
    let config

    return {
      name: 'read-config',

      configResolved(resolvedConfig) {
        // menyimpan konfigurasi yang sudah diresolusi
        config = resolvedConfig
      },

      // menggunakan konfigurasi yang disimpan di hook lainnya
      transform(code, id) {
        if (config.command === 'serve') {
          // dev: plugin dipanggil oleh server dev
        } else {
          // build: plugin dipanggil oleh Rollup
        }
      },
    }
  }
  ```

  Perhatikan bahwa nilai `command` adalah `serve` dalam mode pengembangan (di CLI, `vite`, `vite dev`, dan `vite serve` adalah alias).

### `configureServer`

- **Tipe:** `(server: ViteDevServer) => (() => void) | void | Promise<(() => void) | void>`
- **Jenis:** `async`, `sequential`
- **Lihat juga:** [ViteDevServer](./api-javascript#vitedevserver)

  Hook untuk mengkonfigurasi server pengembangan. Kasus penggunaan paling umum adalah menambahkan middleware kustom ke aplikasi internal [connect](https://github.com/senchalabs/connect):

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // penanganan permintaan kustom...
      })
    },
  })
  ```

  **Menyisipkan Middleware Post**

  Hook `configureServer` dipanggil sebelum middleware internal diinstal, sehingga middleware kustom akan berjalan sebelum middleware internal secara default. Jika Anda ingin menyisipkan middleware **setelah** middleware internal, Anda dapat mengembalikan sebuah fungsi dari `configureServer`, yang akan dipanggil setelah middleware internal diinstal:

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      // kembalikan hook pasca yang dipanggil setelah middleware internal diinstal
      return () => {
        server.middlewares.use((req, res, next) => {
          // penanganan permintaan kustom...
        })
      }
    },
  })
  ```

  **Menyimpan Akses Server**

  Dalam beberapa kasus, hook plugin lain mungkin memerlukan akses ke instance server pengembangan (misalnya, mengakses server web socket, penjaga sistem file, atau grafik modul). Hook ini juga dapat digunakan untuk menyimpan instance server untuk diakses di hook lain:

  ```js
  const myPlugin = () => {
    let server
    return {
      name: 'configure-server',
      configureServer(_server) {
        server = _server
      },
      transform(code, id) {
        if (server) {
          // menggunakan server...
        }
      },
    }
  }
  ```

  Perhatikan bahwa `configureServer` tidak dipanggil saat menjalankan pembangunan produksi sehingga hook lain Anda perlu mengantisipasi ketidakhadirannya.

### `configurePreviewServer`

- **Type:** `(server: PreviewServer) => (() => void) | void | Promise<(() => void) | void>`
- **Kind:** `async`, `sequential`
- **See also:** [PreviewServer](./api-javascript#previewserver)

  Sama seperti [`configureServer`](/guide/api-plugin.html#configureserver) namun untuk server pratinjau. Serupa dengan `configureServer`, hook `configurePreviewServer` dipanggil sebelum middlewares lain diinstal. Jika Anda ingin menyisipkan sebuah middleware **setelah** middlewares lain, Anda dapat mengembalikan sebuah fungsi dari `configurePreviewServer`, yang akan dipanggil setelah middlewares internal diinstal:

  ```js
  const myPlugin = () => ({
    name: 'configure-preview-server',
    configurePreviewServer(server) {
      // kembalikan hook pasca yang dipanggil setelah middlewares lain diinstal
      return () => {
        server.middlewares.use((req, res, next) => {
          // penanganan permintaan kustom...
        })
      }
    },
  })
  ```

### `transformIndexHtml`

- **Tipe:** `IndexHtmlTransformHook | { order?: 'pre' | 'post', handler: IndexHtmlTransformHook }`
- **Jenis:** `async`, `sequential`

  Hook khusus untuk mengubah berkas titik masuk HTML seperti `index.html`. Hook ini menerima string HTML saat ini dan konteks transformasi. Konteks ini mengekspos instance [`ViteDevServer`](./api-javascript#vitedevserver) selama pengembangan, dan mengekspos bundel keluaran Rollup selama pembangunan.

  Hook dapat bersifat async dan dapat mengembalikan salah satu dari berikut ini:

  - String HTML yang telah diubah
  - Sebuah array objek deskriptor tag (`{ tag, attrs, children }`) untuk disisipkan ke HTML yang ada. Setiap tag juga dapat menentukan di mana harus disisipkan (defaultnya adalah di awal `<head>`)
  - Sebuah objek yang berisi keduanya sebagai `{ html, tags }`

  Secara default `order` adalah `undefined`, dengan hook ini diterapkan setelah HTML telah diubah. Untuk menyisipkan sebuah skrip yang harus melewati pipeline plugin Vite, `order: 'pre'` akan menerapkan hook sebelum memproses HTML. `order: 'post'` menerapkan hook setelah semua hook dengan `order` yang tidak ditentukan diterapkan.

  **Contoh Dasar:**

  ```js
  const htmlPlugin = () => {
    return {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          /<title>(.*?)<\/title>/,
          `<title>Title replaced!</title>`,
        )
      },
    }
  }
  ```

  **Tanda Tangan Hook Lengkap:**

  ```ts
  type IndexHtmlTransformHook = (
    html: string,
    ctx: {
      path: string
      filename: string
      server?: ViteDevServer
      bundle?: import('rollup').OutputBundle
      chunk?: import('rollup').OutputChunk
    },
  ) =>
    | IndexHtmlTransformResult
    | void
    | Promise<IndexHtmlTransformResult | void>

  type IndexHtmlTransformResult =
    | string
    | HtmlTagDescriptor[]
    | {
        html: string
        tags: HtmlTagDescriptor[]
      }

  interface HtmlTagDescriptor {
    tag: string
    attrs?: Record<string, string | boolean>
    children?: string | HtmlTagDescriptor[]
    /**
     * default: 'head-prepend'
     */
    injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'
  }
  ```

### `handleHotUpdate`

- **Type:** `(ctx: HmrContext) => Array<ModuleNode> | void | Promise<Array<ModuleNode> | void>`

  Melakukan penanganan pembaruan HMR kustom. Hook menerima objek konteks dengan tanda tangan berikut:

  ```ts
  interface HmrContext {
    file: string
    timestamp: number
    modules: Array<ModuleNode>
    read: () => string | Promise<string>
    server: ViteDevServer
  }
  ```

  - `modules` adalah array modul yang terpengaruh oleh perubahan berkas. Ini adalah array karena satu berkas dapat dipetakan ke beberapa modul yang disajikan (misalnya SFC Vue).

  - `read` adalah fungsi baca async yang mengembalikan konten berkas. Ini disediakan karena pada beberapa sistem, pemanggilan kembali perubahan berkas mungkin terlalu cepat sebelum editor selesai memperbarui berkas dan `fs.readFile` langsung akan mengembalikan konten kosong. Fungsi baca yang dilewatkan dalam normalisasi perilaku ini.

  Hook dapat memilih untuk:

  - Memfilter dan mempersempit daftar modul yang terpengaruh sehingga HMR lebih akurat.

  - Mengembalikan array kosong dan melakukan penanganan HMR kustom lengkap dengan mengirimkan acara kustom ke klien (contoh menggunakan `server.hot` yang diperkenalkan di Vite 5.1, disarankan juga menggunakan `server.ws` jika Anda mendukung versi yang lebih rendah):

    ```js
    handleHotUpdate({ server }) {
      server.hot.send({
        type: 'custom',
        event: 'special-update',
        data: {}
      })
      return []
    }
    ```

    Kode klien harus mendaftarkan penangan yang sesuai menggunakan [API HMR](./api-hmr) (ini bisa disisipkan oleh hook `transform` plugin yang sama):

    ```js
    if (import.meta.hot) {
      import.meta.hot.on('special-update', (data) => {
        // melakukan pembaruan kustom
      })
    }
    ```

## Urutan Plugin

Sebuah plugin Vite dapat secara tambahan menentukan properti `enforce` (serupa dengan loader webpack) untuk menyesuaikan urutan aplikasinya. Nilai dari `enforce` bisa berupa `"pre"` atau `"post"`. Plugin yang diselesaikan akan berada dalam urutan berikut:

- Alias
- Plugin pengguna dengan `enforce: 'pre'`
- Plugin inti Vite
- Plugin pengguna tanpa nilai enforce
- Plugin pembangunan Vite
- Plugin pengguna dengan `enforce: 'post'`
- Plugin pembangunan Vite setelah build (minify, manifest, pelaporan)

## Aplikasi Bersyarat

Secara default, plugin dipanggil baik untuk serve maupun build. Dalam kasus di mana sebuah plugin perlu diterapkan secara bersyarat hanya selama serve atau build, gunakan properti `apply` untuk hanya memanggilnya selama `'build'` atau `'serve'`:

```js
function myPlugin() {
  return {
    name: 'build-only',
    apply: 'build', // atau 'serve'
  }
}
```

Sebuah fungsi juga dapat digunakan untuk kontrol yang lebih tepat:

```js
apply(config, { command }) {
  // diterapkan hanya pada build tetapi tidak untuk SSR
  return command === 'build' && !config.build.ssr
}
```

## Kompatibilitas Plugin Rollup

Sejumlah besar plugin Rollup akan berfungsi langsung sebagai plugin Vite (misalnya `@rollup/plugin-alias` atau `@rollup/plugin-json`), tetapi tidak semuanya, karena beberapa hook plugin tidak masuk akal dalam konteks server pengembangan yang tidak dibundel.

Secara umum, selama sebuah plugin Rollup memenuhi kriteria berikut maka seharusnya akan berfungsi sebagai plugin Vite:

- Tidak menggunakan hook [`moduleParsed`](https://rollupjs.org/plugin-development/#moduleparsed).
- Tidak memiliki keterikatan yang kuat antara hook fase bundel dan hook fase output.

Jika sebuah plugin Rollup hanya masuk akal untuk fase build, maka dapat diatur di bawah `build.rollupOptions.plugins` sebagai gantinya. Ini akan berfungsi sama dengan plugin Vite dengan `enforce: 'post'` dan `apply: 'build'`.

Anda juga dapat menambahkan properti khusus Vite pada plugin Rollup yang ada:

```js
// vite.config.js
import example from 'rollup-plugin-example'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...example(),
      enforce: 'post',
      apply: 'build',
    },
  ],
})
```

Periksa [Vite Rollup Plugins](https://vite-rollup-plugins.patak.dev) untuk daftar plugin Rollup resmi yang kompatibel dengan instruksi penggunaan.

## Normalisasi Path

Vite melakukan normalisasi path saat menyelesaikan id untuk menggunakan separator POSIX ( / ) sambil tetap mempertahankan volume di Windows. Di sisi lain, Rollup menjaga path yang diselesaikan tidak tersentuh secara default, sehingga id yang diselesaikan memiliki separator win32 ( \\ ) di Windows. Namun, plugin Rollup menggunakan fungsi utilitas [`normalizePath`](https://github.com/rollup/plugins/tree/master/packages/pluginutils#normalizepath) dari `@rollup/pluginutils` secara internal, yang mengonversi separator menjadi POSIX sebelum melakukan perbandingan. Ini berarti bahwa ketika plugin ini digunakan dalam Vite, pola konfigurasi `include` dan `exclude` dan perbandingan path lainnya terhadap id yang diselesaikan berfungsi dengan benar.

Jadi, untuk plugin Vite, saat membandingkan path terhadap id yang diselesaikan penting untuk pertama-tama melakukan normalisasi path untuk menggunakan separator POSIX. Fungsi utilitas `normalizePath` yang setara diekspor dari modul `vite`.

```js
import { normalizePath } from 'vite'

normalizePath('foo\\bar') // 'foo/bar'
normalizePath('foo/bar') // 'foo/bar'
```

## Penyaringan, pola include/exclude

Vite mengekspos fungsi [`createFilter` dari `@rollup/pluginutils`](https://github.com/rollup/plugins/tree/master/packages/pluginutils#createfilter) untuk mendorong plugin dan integrasi Vite spesifik untuk menggunakan pola penyaringan include/exclude standar, yang juga digunakan di dalam inti Vite sendiri.

## Komunikasi Client-Server

Sejak Vite 2.9, kami menyediakan beberapa utilitas untuk plugin untuk membantu menangani komunikasi dengan klien.

### Server ke Client

Di sisi plugin, kita bisa menggunakan `server.hot.send` (sejak Vite 5.1) atau `server.ws.send` untuk menyebarkan acara ke semua klien:

```js
// vite.config.js
export default defineConfig({
  plugins: [
    {
      // ...
      configureServer(server) {
        // Contoh: tunggu klien terhubung sebelum mengirim pesan
        server.hot.on('connection', () => {
          server.hot.send('my:greetings', { msg: 'hello' })
        })
      },
    },
  ],
})
```

::: tip CATATAN
Kami sarankan **selalu memberi awalan** nama acara Anda untuk menghindari tabrakan dengan plugin lain.
:::

Di sisi klien, gunakan [`hot.on`](/guide/api-hmr.html#hot-on-event-cb) untuk mendengarkan acara:

```ts
// sisi klien
if (import.meta.hot) {
  import.meta.hot.on('my:greetings', (data) => {
    console.log(data.msg) // hello
  })
}
```

### Client ke Server

Untuk mengirim acara dari klien ke server, kita bisa menggunakan [`hot.send`](/guide/api-hmr.html#hot-send-event-payload):

```ts
// sisi klien
if (import.meta.hot) {
  import.meta.hot.send('my:from-client', { msg: 'Hey!' })
}
```

Kemudian gunakan `server.hot.on` (sejak Vite 5.1) atau `server.ws.on` dan dengarkan acara di sisi server:

```js
// vite.config.js
export default defineConfig({
  plugins: [
    {
      // ...
      configureServer(server) {
        server.hot.on('my:from-client', (data, client) => {
          console.log('Message from client:', data.msg) // Hey!
          // balas hanya ke klien (jika diperlukan)
          client.send('my:ack', { msg: 'Hi! I got your message!' })
        })
      },
    },
  ],
})
```

### TypeScript untuk Acara Kustom

Anda dapat mengetikkan acara kustom dengan memperluas antarmuka `CustomEventMap`:

```ts
// events.d.ts
import 'vite/types/customEvent'

declare module 'vite/types/customEvent' {
  interface CustomEventMap {
    'custom:foo': { msg: string }
    // 'kunci-acara': payload
  }
}
```
