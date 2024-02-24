## server.host

- **Tipe:** `string | boolean`
- **Default:** `'localhost'`

Tentukan alamat IP mana yang harus didengarkan oleh server.
Atur ini ke `0.0.0.0` atau `true` untuk mendengarkan semua alamat, termasuk alamat LAN dan publik.

Ini dapat diatur melalui CLI menggunakan `--host 0.0.0.0` atau `--host`.

::: tip CATATAN

Ada kasus di mana server lain mungkin merespons bukan Vite.

Kasus pertama adalah ketika `localhost` digunakan. Node.js di bawah v17 menyusun kembali hasil dari alamat yang dipecahkan DNS secara default. Ketika mengakses `localhost`, browser menggunakan DNS untuk memecahkan alamat dan alamat itu mungkin berbeda dari alamat yang didengarkan oleh Vite. Vite mencetak alamat yang dipecahkan saat berbeda.

Anda dapat mengatur [`dns.setDefaultResultOrder('verbatim')`](https://nodejs.org/api/dns.html#dns_dns_setdefaultresultorder_order) untuk menonaktifkan perilaku pengurutan ulang. Vite kemudian akan mencetak alamat sebagai `localhost`.

```js
// vite.config.js
import { defineConfig } from 'vite'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  // menghilangkan
})
```

Kasus kedua adalah ketika host wildcard (mis. `0.0.0.0`) digunakan. Ini karena server yang mendengarkan di host non-wildcard memiliki prioritas atas yang mendengarkan di host wildcard.

:::

::: tip Mengakses server pada WSL2 dari LAN Anda

Ketika menjalankan Vite di WSL2, tidak cukup dengan mengatur `host: true` untuk mengakses server dari LAN Anda.
Lihat [dokumen WSL](https://learn.microsoft.com/en-us/windows/wsl/networking#accessing-a-wsl-2-distribution-from-your-local-area-network-lan) untuk detail lebih lanjut.

:::

## server.port

- **Tipe:** `number`
- **Default:** `5173`

Tentukan port server. Perhatikan jika port sudah digunakan, Vite akan secara otomatis mencoba port tersedia berikutnya sehingga ini mungkin bukan port yang sebenarnya didengarkan oleh server.

## server.strictPort

- **Tipe:** `boolean`

Atur ke `true` untuk keluar jika port sudah digunakan, daripada secara otomatis mencoba port tersedia berikutnya.

## server.https

- **Tipe:** `https.ServerOptions`

Aktifkan TLS + HTTP/2. Perhatikan bahwa ini menurunkan ke TLS saja ketika opsi [`server.proxy`](#server-proxy) juga digunakan.

Nilainya juga bisa berupa [objek opsi](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) yang dilewatkan ke `https.createServer()`.

Diperlukan sertifikat yang valid. Untuk pengaturan dasar, Anda dapat menambahkan [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) ke plugin proyek, yang akan secara otomatis membuat dan menyimpan sertifikat yang ditandatangani sendiri. Tetapi kami menyarankan untuk membuat sertifikat Anda sendiri.

## server.open

- **Tipe:** `boolean | string`

Secara otomatis membuka aplikasi di browser saat server mulai. Ketika nilainya adalah sebuah string, itu akan digunakan sebagai pathname URL. Jika Anda ingin membuka server di browser tertentu yang Anda sukai, Anda dapat mengatur env `process.env.BROWSER` (misalnya `firefox`). Anda juga dapat mengatur `process.env.BROWSER_ARGS` untuk meneruskan argumen tambahan (misalnya `--incognito`).

`BROWSER` dan `BROWSER_ARGS` juga merupakan variabel lingkungan khusus yang dapat Anda atur di file `.env` untuk mengkonfigurasinya. Lihat [pakaiannya `open`](https://github.com/sindresorhus/open#app) untuk detail lebih lanjut.

**Contoh:**

```js
export default defineConfig({
  server: {
    open: '/docs/index.html',
  },
})
```

## server.proxy

- **Tipe:** `Record<string, string | ProxyOptions>`

Konfigurasikan aturan proxy kustom untuk server pengembangan. Mengharapkan objek pasangan `{ key: options }`. Setiap permintaan yang dimulai dengan path itu akan diproksi ke target yang ditentukan. Jika kunci dimulai dengan `^`, itu akan diinterpretasikan sebagai `RegExp`. Opsi `configure` dapat digunakan untuk mengakses instance proxy.

Perhatikan bahwa jika Anda menggunakan [`base`](/config/shared-options.md#base) yang tidak bersifat relatif, Anda harus menambahkan awalan setiap kunci dengan `base` tersebut.

Perluasan [`http-proxy`](https://github.com/http-party/node-http-proxy#options). Opsi tambahan ada [di sini](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/proxy.ts#L13).

Dalam beberapa kasus, Anda mungkin juga ingin mengkonfigurasi server pengembangan yang mendasarinya (misalnya untuk menambahkan middlewares kustom ke aplikasi internal [connect](https://github.com/senchalabs/connect)). Untuk melakukannya, Anda perlu menulis [plugin](/guide/using-plugins.html) sendiri dan menggunakan fungsi [configureServer](/guide/api-plugin.html#configureserver).

**Contoh:**

```js
export default defineConfig({
  server: {
    proxy: {
      // singkatan string: http://localhost:5173/foo -> http://localhost:4567/foo
      '/foo': 'http://localhost:4567',
      // dengan opsi: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // dengan RegEx: http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, ''),
      },
      // Menggunakan instance proxy
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy akan menjadi instance dari 'http-proxy'
        },
      },
      // Proksi websockets atau socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      '/socket.io': {
        target: 'ws://localhost:5174',
        ws: true,
      },
    },
  },
})
```

## server.cors

- **Tipe:** `boolean | CorsOptions`

Konfigurasikan CORS untuk server pengembangan. Ini diaktifkan secara default dan mengizinkan origin apa pun. Berikan sebuah [objek opsi](https://github.com/expressjs/cors#configuration-options) untuk menyesuaikan perilaku atau `false` untuk menonaktifkan.

## server.headers

- **Tipe:** `OutgoingHttpHeaders`

Tentukan header respons server.

## server.hmr

- **Tipe:** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

Nonaktifkan atau konfigurasikan koneksi HMR (dalam kasus di mana websocket HMR harus menggunakan alamat yang berbeda dari server http).

Atur `server.hmr.overlay` menjadi `false` untuk menonaktifkan overlay error server.

`clientPort` adalah opsi lanjutan yang mengganti port hanya pada sisi klien, memungkinkan Anda untuk melayani websocket pada port yang berbeda dari yang dicari kode klien.

Ketika `server.hmr.server` didefinisikan, Vite akan memproses permintaan koneksi HMR melalui server yang disediakan. Jika tidak dalam mode middleware, Vite akan mencoba memproses permintaan koneksi HMR melalui server yang ada. Ini dapat membantu ketika menggunakan sertifikat self-signed atau ketika Anda ingin mengekspos Vite melalui jaringan pada satu port.

Lihatlah [`vite-setup-catalogue`](https://github.com/sapphi-red/vite-setup-catalogue) untuk beberapa contoh.

## server.warmup

- **Tipe:** `{ clientFiles?: string[], ssrFiles?: string[] }`
- **Terkait:** [Pemanasan Berkas yang Sering Digunakan](/guide/performance.html#warm-up-frequently-used-files)

Pemanasan (warm up) berkas untuk mentransformasi dan menyimpan hasilnya sebelumnya. Ini meningkatkan waktu muat halaman awal selama awal dimulainya server dan mencegah terjadinya transformasi bertingkat.

`clientFiles` adalah berkas yang hanya digunakan di sisi klien, sedangkan `ssrFiles` adalah berkas yang hanya digunakan dalam SSR. Mereka menerima larik jalur berkas atau pola [`fast-glob`](https://github.com/mrmlnc/fast-glob) yang relatif terhadap `root`.

Pastikan hanya menambahkan berkas yang sering digunakan agar tidak membebani server pengembangan Vite saat startup.

```js
export default defineConfig({
  server: {
    warmup: {
      clientFiles: ['./src/components/*.vue', './src/utils/big-utils.js'],
      ssrFiles: ['./src/server/modules/*.js'],
    },
  },
})
```

## server.watch

- **Tipe:** `object | null`

Opsi pemantau sistem berkas untuk dilewatkan ke [chokidar](https://github.com/paulmillr/chokidar#api).

Pemantau server Vite memantau `root` dan melewati direktori `.git/`, `node_modules/`, dan direktori `cacheDir` dan `build.outDir` Vite secara default. Saat memperbarui berkas yang dipantau, Vite akan menerapkan HMR dan memperbarui halaman hanya jika diperlukan.

Jika diatur ke `null`, tidak ada berkas yang akan dipantau. `server.watcher` akan menyediakan pemberi acara yang kompatibel, tetapi pemanggilan `add` atau `unwatch` tidak akan berpengaruh.

::: warning Memantau berkas di `node_modules`

Saat ini tidak memungkinkan untuk memantau berkas dan paket di `node_modules`. Untuk kemajuan lebih lanjut dan solusi sementara, Anda dapat mengikuti [issue #8619](https://github.com/vitejs/vite/issues/8619).

:::

::: warning Menggunakan Vite pada Windows Subsystem for Linux (WSL) 2

Saat menjalankan Vite di WSL2, pemantau sistem berkas tidak akan berfungsi saat sebuah berkas diedit oleh aplikasi Windows (proses non-WSL2). Hal ini disebabkan oleh [keterbatasan WSL2](https://github.com/microsoft/WSL/issues/4739). Ini juga berlaku untuk menjalankan di Docker dengan backend WSL2.

Untuk memperbaikinya, Anda bisa:

- **Disarankan**: Gunakan aplikasi WSL2 untuk mengedit berkas Anda.
  - Juga disarankan untuk memindahkan folder proyek keluar dari sistem file Windows. Mengakses sistem file Windows dari WSL2 lambat. Menghilangkan overhead itu akan meningkatkan kinerja.
- Atur `{ usePolling: true }`.
  - Perhatikan bahwa [`usePolling` menyebabkan penggunaan CPU tinggi](https://github.com/paulmillr/chokidar#performance).

:::

## server.middlewareMode

- **Tipe:** `boolean`
- **Default:** `false`

Buat server Vite dalam mode middleware.

- **Terkait:** [appType](./shared-options#apptype), [SSR - Setting Up the Dev Server](/guide/ssr#setting-up-the-dev-server)

- **Contoh:**

```js
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  // Buat server Vite dalam mode middleware
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom', // jangan sertakan middleware penanganan HTML default Vite
  })
  // Gunakan instance connect vite sebagai middleware
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // Karena `appType` adalah `'custom'`, harus melayani respons di sini.
    // Catatan: jika `appType` adalah `'spa'` atau `'mpa'`, Vite menyertakan middlewares untuk menangani
    // permintaan HTML dan 404 sehingga middlewares pengguna harus ditambahkan
    // sebelum middlewares Vite agar efektif
  })
}

createServer()
```

## server.fs.strict

- **Tipe:** `boolean`
- **Default:** `true` (diaktifkan secara default sejak Vite 2.7)

Membatasi penyediaan file di luar root workspace.

## server.fs.allow

- **Tipe:** `string[]`

Membatasi file yang dapat disajikan melalui `/@fs/`. Ketika `server.fs.strict` diatur ke `true`, mengakses file di luar daftar direktori ini yang tidak diimpor dari file yang diizinkan akan menghasilkan 403.

Baik direktori maupun file dapat disediakan.

Vite akan mencari root dari workspace potensial dan menggunakannya sebagai default. Sebuah workspace valid memenuhi kondisi berikut, jika tidak akan kembali ke [root proyek](/guide/#index-html-and-project-root).

- berisi bidang `workspaces` di `package.json`
- berisi salah satu dari file berikut
  - `lerna.json`
  - `pnpm-workspace.yaml`

Menerima path untuk menentukan root workspace kustom. Dapat berupa path absolut atau path relatif ke [root proyek](/guide/#index-html-and-project-root). Contohnya:

```js
export default defineConfig({
  server: {
    fs: {
      // Memungkinkan penyajian file dari satu tingkat di atas root proyek
      allow: ['..'],
    },
  },
})
```

Ketika `server.fs.allow` ditentukan, deteksi root workspace otomatis akan dinonaktifkan. Untuk memperluas perilaku asli, utilitas `searchForWorkspaceRoot` diekspos:

```js
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  server: {
    fs: {
      allow: [
        // mencari root workspace
        searchForWorkspaceRoot(process.cwd()),
        // aturan kustom Anda
        '/path/to/custom/allow_directory',
        '/path/to/custom/allow_file.demo',
      ],
    },
  },
})
```

## server.fs.deny

- **Tipe:** `string[]`
- **Default:** `['.env', '.env.*', '*.{crt,pem}']`

Daftar hitam untuk file sensitif yang dibatasi untuk disajikan oleh server pengembangan Vite. Ini akan memiliki prioritas lebih tinggi daripada [`server.fs.allow`](#server-fs-allow). Pola [picomatch](https://github.com/micromatch/picomatch#globbing-features) didukung.

## server.origin

- **Tipe:** `string`

Mendefinisikan asal URL asset yang dihasilkan selama pengembangan.

```js
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:8080',
  },
})
```

## server.sourcemapIgnoreList

- **Type:** `false | (sourcePath: string, sourcemapPath: string) => boolean`
- **Default:** `(sourcePath) => sourcePath.includes('node_modules')`

Whether or not to ignore source files in the server sourcemap, used to populate the [`x_google_ignoreList` source map extension](https://developer.chrome.com/blog/devtools-better-angular-debugging/#the-x_google_ignorelist-source-map-extension).

`server.sourcemapIgnoreList` is the equivalent of [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) for the dev server. A difference between the two config options is that the rollup function is called with a relative path for `sourcePath` while `server.sourcemapIgnoreList` is called with an absolute path. During dev, most modules have the map and the source in the same folder, so the relative path for `sourcePath` is the file name itself. In these cases, absolute paths makes it convenient to be used instead.

By default, it excludes all paths containing `node_modules`. You can pass `false` to disable this behavior, or, for full control, a function that takes the source path and sourcemap path and returns whether to ignore the source path.

```js
export default defineConfig({
  server: {
    // This is the default value, and will add all files with node_modules
    // in their paths to the ignore list.
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules')
    }
  }
};
```

::: tip Note
[`server.sourcemapIgnoreList`](#server-sourcemapignorelist) and [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) need to be set independently. `server.sourcemapIgnoreList` is a server only config and doesn't get its default value from the defined rollup options.
:::
