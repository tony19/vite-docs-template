# Server-Side Rendering

:::tip Catatan
SSR secara khusus merujuk pada kerangka kerja front-end (misalnya React, Preact, Vue, dan Svelte) yang mendukung menjalankan aplikasi yang sama di Node.js, merender pratinjau menjadi HTML, dan akhirnya menghidrasi aplikasi tersebut di sisi klien. Jika Anda mencari integrasi dengan kerangka kerja server-side tradisional, lihat [Panduan Integrasi Backend](./backend-integration) sebagai gantinya.

Panduan berikut juga mengasumsikan pengalaman sebelumnya dalam bekerja dengan SSR di kerangka kerja pilihan Anda, dan hanya akan berfokus pada detail integrasi spesifik Vite.
:::

:::warning API Tingkat Rendah
Ini adalah API tingkat rendah yang ditujukan untuk penulis pustaka dan kerangka kerja. Jika tujuan Anda adalah membuat aplikasi, pastikan untuk melihat plugin dan alat SSR tingkat lebih tinggi di [bagian SSR Vite yang Luar Biasa](https://github.com/vitejs/awesome-vite#ssr) terlebih dahulu. Dengan demikian, banyak aplikasi yang berhasil dibangun langsung di atas API tingkat rendah bawaan Vite.
:::

:::tip Bantuan
Jika Anda memiliki pertanyaan, komunitas biasanya membantu di [saluran #ssr Discord Vite](https://discord.gg/PkbxgzPhJv).
:::

## Proyek Contoh

Vite menyediakan dukungan bawaan untuk server-side rendering (SSR). [`create-vite-extra`](https://github.com/bluwy/create-vite-extra) berisi contoh setup SSR yang dapat Anda gunakan sebagai referensi untuk panduan ini:

- [Vanilla](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vanilla)
- [Vue](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vue)
- [React](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-react)
- [Preact](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-preact)
- [Svelte](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-svelte)
- [Solid](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-solid)

Anda juga dapat membuat proyek-proyek ini secara lokal dengan [menjalankan `create-vite`](./index.md#scaffolding-your-first-vite-project) dan memilih `Others > create-vite-extra` di bawah opsi kerangka kerja.

## Struktur Sumber

Aplikasi SSR yang khas akan memiliki struktur berkas sumber berikut:

```
- index.html
- server.js # server aplikasi utama
- src/
  - main.js          # mengekspor kode aplikasi yang agnostik lingkungan (universal)
  - entry-client.js  # memasang aplikasi ke elemen DOM
  - entry-server.js  # merender aplikasi menggunakan API SSR kerangka kerja
```

`index.html` akan perlu merujuk `entry-client.js` dan menyertakan placeholder di mana markup yang dirender oleh server harus disuntikkan:

```html
<div id="app"><!--ssr-outlet--></div>
<script type="module" src="/src/entry-client.js"></script>
```

Anda dapat menggunakan placeholder apa pun yang Anda sukai sebagai gantinya `<!--ssr-outlet-->`, selama itu dapat digantikan dengan tepat.

## Logika Kondisional

Jika Anda perlu melakukan logika kondisional berdasarkan SSR vs. klien, Anda dapat menggunakan

```js
if (import.meta.env.SSR) {
  // ... logika hanya untuk server
}
```

Ini secara statis digantikan selama pembangunan sehingga akan memungkinkan tree-shaking dari cabang yang tidak digunakan.

## Menyiapkan Server Pengembangan

Saat membangun aplikasi SSR, Anda kemungkinan ingin memiliki kontrol penuh atas server utama Anda dan memisahkan Vite dari lingkungan produksi. Oleh karena itu, disarankan untuk menggunakan Vite dalam mode middleware. Berikut contohnya dengan [express](https://expressjs.com/):

**server.js**

```js{15-18}
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // Buat server Vite dalam mode middleware dan konfigurasikan jenis aplikasi sebagai
  // 'custom', menonaktifkan logika pelayanan HTML bawaan Vite sehingga server induk
  // dapat mengambil alih kendali
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // Gunakan instansi konek vite sebagai middleware. Jika Anda menggunakan router express Anda sendiri
  // (express.Router()), Anda harus menggunakan router.use
  // Ketika server restarts (misalnya setelah pengguna memodifikasi
  // vite.config.js), `vite.middlewares` masih akan menjadi referensi yang sama
  // (dengan tumpukan internal baru dari Vite dan plugin-injected
  // middlewares). Berikut valid bahkan setelah restart.
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // layani index.html - kita akan menangani ini selanjutnya
  })

  app.listen(5173)
}

createServer()
```

Di sini `vite` adalah contoh dari [ViteDevServer](./api-javascript#vitedevserver). `vite.middlewares` adalah instansi [Connect](https://github.com/senchalabs/connect) yang dapat digunakan sebagai middleware dalam kerangka kerja Node.js yang kompatibel dengan Connect.

Langkah berikutnya adalah mengimplementasikan penangan `*` untuk melayani HTML yang dirender oleh server:

```js
app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  try {
    // 1. Baca index.html
    let template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'),
      'utf-8',
    )

    // 2. Terapkan transformasi HTML Vite. Ini menyuntikkan klien Vite HMR,
    //    dan juga menerapkan transformasi HTML dari plugin Vite, misalnya
    //    awalan global dari @vitejs/plugin-react
    template = await vite.transformIndexHtml(url, template)

    // 3. Muat entri server. ssrLoadModule secara otomatis mengubah
    //    kode sumber ESM agar dapat digunakan di Node.js! Tidak ada bundling
    //    yang diperlukan, dan memberikan invalidasi yang efisien mirip dengan HMR.
    const { render } = await vite.ssrLoadModule('/src/entry-server.js')

    // 4. Merender HTML aplikasi. Ini mengasumsikan fungsi `render` yang diekspor
    //     oleh entry-server.js memanggil API SSR kerangka kerja yang sesuai,
    //    misalnya ReactDOMServer.renderToString()
    const appHtml = await render(url)

    // 5. Menyuntikkan HTML yang dirender oleh aplikasi ke dalam template.
    const html = template.replace(`<!--ssr-outlet-->`, appHtml)

    // 6. Kirim HTML yang dirender kembali.
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    // Jika terjadi kesalahan, biarkan Vite memperbaiki jejak stack sehingga dapat dipetakan kembali
    // ke kode sumber asli Anda.
    vite.ssrFixStacktrace(e)
    next(e)
  }
})
```

Skrip `dev` dalam `package.json` juga harus diubah untuk menggunakan skrip server:

```diff
  "scripts": {
-   "dev": "vite"
+   "dev": "node server"
  }
```

## Membangun untuk Produksi

Untuk mengirimkan proyek SSR untuk produksi, kita perlu:

1. Menghasilkan build klien seperti biasa;
2. Menghasilkan build SSR, yang dapat dimuat langsung melalui `import()` sehingga kita tidak perlu melalui `ssrLoadModule` Vite;

Skrip-skrip kita dalam `package.json` akan terlihat seperti ini:

```json
{
  "scripts": {
    "dev": "node server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.js"
  }
}
```

Perhatikan flag `--ssr` yang menunjukkan ini adalah build SSR. Ini juga harus menentukan entri SSR.

Kemudian, di `server.js` kita perlu menambahkan beberapa logika khusus produksi dengan memeriksa `process.env.NODE_ENV`:

- Daripada membaca `index.html` root, gunakan `dist/client/index.html` sebagai templat karena berisi tautan aset yang benar ke build klien.

- Daripada `await vite.ssrLoadModule('/src/entry-server.js')`, gunakan `import('./dist/server/entry-server.js')` (berkas ini adalah hasil dari build SSR).

- Pindahkan pembuatan dan semua penggunaan dari server Vite di belakang cabang kondisional hanya untuk pengembangan, lalu tambahkan middleware penyedia berkas statis untuk melayani berkas dari `dist/client`.

Lihat [proyek contoh](#proyek-contoh) untuk setup yang berfungsi.

## Menghasilkan Petunjuk Preload

`vite build` mendukung flag `--ssrManifest` yang akan menghasilkan `.vite/ssr-manifest.json` di direktori output build:

```diff
- "build:client": "vite build --outDir dist/client",
+ "build:client": "vite build --outDir dist/client --ssrManifest",
```

Skrip di atas sekarang akan menghasilkan `dist/client/.vite/ssr-manifest.json` untuk build klien (Ya, manifest SSR dihasilkan dari build klien karena kita ingin memetakan ID modul ke berkas klien). Manifest tersebut berisi pemetaan ID modul ke chunk mereka dan berkas aset terkait.

Untuk memanfaatkan manifest, kerangka kerja perlu menyediakan cara untuk mengumpulkan ID modul dari komponen yang digunakan selama panggilan render server.

`@vitejs/plugin-vue` mendukung ini secara otomatis dan secara otomatis mendaftarkan ID modul komponen yang digunakan ke konteks Vue SSR yang terkait:

```js
// src/entry-server.js
const ctx = {}
const html = await vueServerRenderer.renderToString(app, ctx)
// ctx.modules sekarang adalah Set dari ID modul yang digunakan selama render
```

Di cabang produksi dari `server.js` kita perlu membaca dan meneruskan manifest ke fungsi `render` yang diekspor oleh `src/entry-server.js`. Ini akan memberikan informasi yang cukup untuk merender petunjuk preload untuk berkas yang digunakan oleh rute-rute async! Lihat [sumber demo](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/src/entry-server.js) untuk contoh lengkap.

## Pra-Rending / SSG

Jika rute-rute dan data yang dibutuhkan untuk rute-rute tertentu diketahui sebelumnya, kita dapat melakukan pra-render rute-rute ini ke dalam HTML statis menggunakan logika yang sama dengan SSR produksi. Ini juga dapat dianggap sebagai bentuk Static-Site Generation (SSG). Lihat [skrip pra-render demo](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/prerender.js) untuk contoh yang berfungsi.

## Eksternal SSR

Dependency "dipertahankan" dari sistem modul transformasi SSR Vite secara default saat menjalankan SSR. Ini mempercepat pengembangan dan pembangunan.

Jika sebuah dependency perlu ditransformasi oleh pipeline Vite, misalnya, karena fitur Vite digunakan tanpa ditranspilasi di dalamnya, mereka dapat ditambahkan ke [`ssr.noExternal`](../config/ssr-options.md#ssr-noexternal).

Untuk dependensi terhubung, mereka tidak dipertahankan secara default untuk memanfaatkan HMR Vite. Jika ini tidak diinginkan, misalnya, untuk menguji dependensi seolah-olah mereka tidak terhubung, Anda dapat menambahkannya ke [`ssr.external`](../config/ssr-options.md#ssr-external).

:::warning Bekerja dengan Alias
Jika Anda telah mengkonfigurasi alias yang mengalihkan satu paket ke yang lain, Anda mungkin ingin mengalihkan paket `node_modules` yang sebenarnya sebagai gantinya untuk membuatnya berfungsi untuk dependensi eksternal SSR. Baik [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) maupun [pnpm](https://pnpm.io/aliases/) mendukung pembuatan alias melalui awalan `npm:`.
:::

## Logika Plugin Khusus SSR

Beberapa kerangka kerja seperti Vue atau Svelte mengkompilasi komponen ke format yang berbeda berdasarkan klien vs. SSR. Untuk mendukung transformasi kondisional, Vite melewatkan properti tambahan `ssr` dalam objek `options` dari hook plugin berikut:

- `resolveId`
- `load`
- `transform`

**Contoh:**

```js
export function mySSRPlugin() {
  return {
    name: 'my-ssr',
    transform(code, id, options) {
      if (options?.ssr) {
        // lakukan transformasi khusus ssr...
      }
    },
  }
}
```

Objek opsi dalam `load` dan `transform` adalah opsional, rollup saat ini tidak menggunakan objek ini tetapi mungkin memperluas hook ini dengan metadata tambahan di masa mendatang.

:::tip Catatan
Sebelum Vite 2.7, ini diberitahukan ke hook plugin dengan parameter `ssr` posisional alih-alih menggunakan objek `options`. Semua kerangka kerja utama dan plugin telah diperbarui tetapi Anda mungkin menemukan pos-pos usang yang menggunakan API sebelumnya.
:::

## Target SSR

Target default untuk build SSR adalah lingkungan node, tetapi Anda juga dapat menjalankan server di Web Worker. Resolusi entri paket berbeda untuk setiap platform. Anda dapat mengonfigurasi target untuk menjadi Web Worker dengan `ssr.target` disetel ke `'webworker'`.

## Bundel SSR

Dalam beberapa kasus seperti runtime `webworker`, Anda mungkin ingin membundle build SSR Anda ke dalam satu berkas JavaScript. Anda dapat mengaktifkan perilaku ini dengan mengatur `ssr.noExternal` menjadi `true`. Ini akan melakukan dua hal:

- Memperlakukan semua dependensi sebagai `noExternal`
- Melemparkan kesalahan jika ada Node.js built-ins yang diimpor

## Kondisi Resolve SSR

Secara default resolusi entri paket akan menggunakan kondisi yang diatur dalam [`resolve.conditions`](../config/shared-options.md#resolve-conditions) untuk build SSR. Anda dapat menggunakan [`ssr.resolve.conditions`](../config/ssr-options.md#ssr-resolve-conditions) dan [`ssr.resolve.externalConditions`](../config/ssr-options.md#ssr-resolve-externalconditions) untuk menyesuaikan perilaku ini.

## CLI Vite

Perintah CLI `$ vite dev` dan `$ vite preview` juga dapat digunakan untuk aplikasi SSR. Anda dapat menambahkan middlewares SSR Anda ke server pengembangan dengan [`configureServer`](/guide/api-plugin#configureserver) dan ke server pratinjau dengan [`configurePreviewServer`](/guide/api-plugin#configurepreviewserver).

:::tip Catatan
Gunakan hook post sehingga middleware SSR Anda berjalan _setelah_ middleware Vite.
:::
