# Membangun untuk Produksi

Saatnya untuk mendeploy aplikasi Anda untuk produksi, cukup jalankan perintah `vite build`. Secara default, ini menggunakan `<root>/index.html` sebagai titik masuk pembangunan, dan menghasilkan paket aplikasi yang sesuai untuk disajikan melalui layanan hosting statis. Lihat [Mendeploy Situs Statis](./static-deploy) untuk panduan tentang layanan populer.

## Kompatibilitas Browser

Paket produksi mengasumsikan dukungan untuk JavaScript modern. Secara default, Vite mengincar browser yang mendukung [Modul ES asli](https://caniuse.com/es6-module), [impor dinamis ESM asli](https://caniuse.com/es6-module-dynamic-import), dan [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta):

- Chrome >=87
- Firefox >=78
- Safari >=14
- Edge >=88

Anda dapat menentukan target kustom melalui opsi konfigurasi [`build.target`](/config/build-options.md#build-target), di mana target terendahnya adalah `es2015`.

Perhatikan bahwa secara default, Vite hanya menangani transformasi sintaks dan **tidak mencakup polifil**. Anda dapat melihat [Polyfill.io](https://polyfill.io/) yang merupakan layanan yang secara otomatis menghasilkan bundel polifil berdasarkan string UserAgent browser pengguna.

Browser kuno dapat didukung melalui [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy), yang akan secara otomatis menghasilkan potongan legacy dan polifil fitur bahasa ES yang sesuai. Potongan legacy hanya dimuat secara kondisional di browser yang tidak memiliki dukungan ESM asli.

## Jalur Dasar Publik

- Terkait: [Penanganan Aset](./assets)

Jika Anda mendeploy proyek Anda di bawah jalur publik bertingkat, cukup tentukan opsi konfigurasi [`base`](/config/shared-options.md#base) dan semua jalur aset akan ditulis ulang sesuai. Opsi ini juga dapat ditentukan sebagai flag baris perintah, misalnya `vite build --base=/my/public/path/`.

URL aset yang diimpor dalam JS, referensi `url()` CSS, dan referensi aset dalam file `.html` Anda secara otomatis disesuaikan untuk menghormati opsi ini selama pembangunan.

Pengecualian terjadi ketika Anda perlu menggabungkan URL secara dinamis saat berjalan. Dalam kasus ini, Anda dapat menggunakan variabel yang disuntikkan secara global `import.meta.env.BASE_URL` yang akan menjadi jalur dasar publik. Perhatikan variabel ini digantikan secara statis selama pembangunan sehingga harus muncul persis seperti yang ada (misalnya, `import.meta.env['BASE_URL']` tidak akan berfungsi).

Untuk kontrol jalur dasar yang lebih canggih, lihat [Opsi Jalur Dasar Lanjutan](#advanced-base-options).

## Menyesuaikan Pembangunan

Pembangunan dapat disesuaikan melalui berbagai [opsi konfigurasi pembangunan](/config/build-options.md). Secara khusus, Anda dapat langsung menyesuaikan opsi Rollup yang mendasarinya (https://rollupjs.org/configuration-options/) melalui `build.rollupOptions`:

```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
    },
  },
})
```

Sebagai contoh, Anda dapat menentukan output Rollup multipel dengan plugin yang hanya diterapkan selama pembangunan.

## Strategi Pemecahan Chunk

Anda dapat mengonfigurasi cara chunk dipisahkan menggunakan `build.rollupOptions.output.manualChunks` (lihat [dokumentasi Rollup](https://rollupjs.org/configuration-options/#output-manualchunks)). Sampai Vite 2.8, strategi default pemecahan chunk membagi chunk menjadi `index` dan `vendor`. Ini adalah strategi yang baik untuk beberapa SPA, tetapi sulit untuk memberikan solusi umum untuk setiap kasus penggunaan target Vite. Mulai dari Vite 2.9, `manualChunks` tidak lagi dimodifikasi secara default. Anda dapat terus menggunakan strategi Pemecahan Chunk Vendor dengan menambahkan `splitVendorChunkPlugin` dalam file konfigurasi Anda:

```js
// vite.config.js
import { splitVendorChunkPlugin } from 'vite'
export default defineConfig({
  plugins: [splitVendorChunkPlugin()],
})
```

Strategi ini juga disediakan sebagai `splitVendorChunk({ cache: SplitVendorChunkCache })` factory, jika komposisi dengan logika kustom diperlukan. `cache.reset()` harus dipanggil pada `buildStart` untuk mode tontonan pembangunan agar berfungsi dengan benar dalam kasus ini.

::: peringatan
Anda harus menggunakan formulir fungsi `build.rollupOptions.output.manualChunks` saat menggunakan plugin ini. Jika formulir objek digunakan, plugin tidak akan memiliki efek apa pun.
:::

## Penanganan Kesalahan Muat

Vite mengeluarkan acara `vite:preloadError` ketika gagal memuat impor dinamis. `event.payload` berisi kesalahan impor asli. Jika Anda memanggil `event.preventDefault()`, kesalahan tidak akan dilemparkan.

```js
window.addEventListener('vite:preloadError', (event) => {
  window.reload() // misalnya, segarkan halaman
})
```

Ketika penerapan baru terjadi, layanan hosting dapat menghapus aset dari penerapan sebelumnya. Sebagai hasilnya, pengguna yang mengunjungi situs Anda sebelum penerapan baru mungkin mengalami kesalahan impor. Kesalahan ini terjadi karena aset yang berjalan di perangkat pengguna tersebut sudah ketinggalan zaman dan mencoba mengimpor potongan lama yang sesuai, yang dihapus. Acara ini berguna untuk mengatasi situasi ini.

## Rebuild saat berubahnya file

Anda dapat mengaktifkan penonton rollup dengan `vite build --watch`. Atau, Anda dapat langsung menyesuaikan [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch) yang mendasarinya melalui `build.watch`:

```js
// vite.config.js
export default defineConfig({
  build: {
    watch: {
      // https://rollupjs.org/configuration-options/#watch
    },
  },
})
```

Dengan flag `--watch` diaktifkan, perubahan pada `vite.config.js`, serta file apa pun yang akan dibundel, akan memicu pembangunan ulang.

## Aplikasi Multi-Halaman

Misalkan Anda memiliki struktur kode sumber berikut:

```
├── package.json
├── vite.config.js
├── index.html
├── main.js
└── nested
    ├── index.html
    └── nested.js
```

Selama pengembangan, cukup navigasi atau tautkan ke `/nested/` - ini akan berfungsi seperti yang diharapkan, seperti halnya untuk server file statis normal.

Selama pembangunan, yang perlu Anda lakukan hanyalah menentukan beberapa file `.html` sebagai titik masuk:

```js
// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html'),
      },
    },
  },
})
```

Jika Anda menentukan root yang berbeda, ingatlah bahwa `__dirname` masih akan menjadi folder file vite.config.js Anda saat menyelesaikan jalur input. Oleh karena itu, Anda perlu menambahkan entri `root` Anda ke argumen untuk `resolve`.

Perhatikan bahwa untuk file HTML, Vite mengabaikan nama yang diberikan pada entri dalam objek `rollupOptions.input` dan sebagai gantinya menghormati id yang diselesaikan dari file saat menghasilkan aset HTML di folder dist. Ini memastikan struktur yang konsisten dengan cara server pengembangan berfungsi.

## Mode Perpustakaan

Ketika Anda mengembangkan perpustakaan yang ditujukan untuk browser, Anda kemungkinan besar menghabiskan sebagian besar waktu pada halaman uji/demo yang mengimpor perpustakaan aktual Anda. Dengan Vite, Anda dapat menggunakan `index.html` Anda untuk tujuan tersebut untuk mendapatkan pengalaman pengembangan yang lancar.

Ketika waktunya untuk bundel perpustakaan Anda untuk distribusi, gunakan opsi konfigurasi [`build.lib`](/config/build-options.md#build-lib). Pastikan juga untuk memperluas ketergantungan apa pun yang tidak ingin Anda bundel ke dalam perpustakaan Anda, misalnya `vue` atau `react`:

```js
// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      // Bisa juga berupa kamus atau array dari beberapa titik masuk
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',
      // ekstensi yang tepat akan ditambahkan
      fileName: 'my-lib',
    },
    rollupOptions: {
      // pastikan untuk memperluas dep yang tidak boleh dibundel
      // ke dalam perpustakaan Anda
      external: ['vue'],
      output: {
        // Memberikan variabel global untuk digunakan dalam pembangunan UMD
        // untuk dep yang diperluas
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

Berkas entri akan berisi ekspor yang dapat diimpor oleh pengguna paket Anda:

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    }
  }
}
```

Atau, jika mengekspos beberapa titik masuk:

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.cjs"
    },
    "./secondary": {
      "import": "./dist/secondary.js",
      "require": "./dist/secondary.cjs"
    }
  }
}
```

::: tip Ekstensi Berkas
Jika `package.json` tidak mengandung `"type": "module"`, Vite akan menghasilkan ekstensi berkas yang berbeda untuk kompatibilitas Node.js. `.js` akan menjadi `.mjs` dan `.cjs` akan menjadi `.js`.
:::

::: tip Variabel Lingkungan
Dalam mode perpustakaan, semua penggunaan [`import.meta.env.*`](./env-and-mode.md) diganti secara statis saat membangun untuk produksi. Namun, penggunaan `process.env.*` tidak, sehingga konsumen perpustakaan Anda dapat mengubahnya secara dinamis. Jika ini tidak diinginkan, Anda dapat menggunakan `define: { 'process.env.NODE_ENV': '"production"' }` misalnya untuk menggantikan secara statis, atau gunakan [`esm-env`](https://github.com/benmccann/esm-env) untuk kompatibilitas yang lebih baik dengan bundler dan runtime.
:::

::: warning Penggunaan Lanjutan
Mode perpustakaan mencakup konfigurasi yang sederhana dan berdasarkan opini untuk perpustakaan berorientasi browser dan kerangka kerja JS. Jika Anda membangun perpustakaan non-browser, atau memerlukan alur kerja pembangunan lanjutan, Anda dapat menggunakan [Rollup](https://rollupjs.org) atau [esbuild](https://esbuild.github.io) secara langsung.
:::

## Opsi Dasar Lanjutan

::: warning
Fitur ini bersifat eksperimental. [Beri Masukan](https://github.com/vitejs/vite/discussions/13834).
:::

Untuk kasus penggunaan lanjutan, aset yang didistribusikan dan file publik mungkin berada di jalur yang berbeda, misalnya untuk menggunakan strategi cache yang berbeda.
Seorang pengguna dapat memilih untuk mendistribusikan dalam tiga jalur yang berbeda:

- File HTML entri yang dihasilkan (yang mungkin diproses selama SSR)
- Aset yang dihasilkan dengan hash (JS, CSS, dan jenis file lain seperti gambar)
- File [publik yang disalin](assets.md#the-public-directory)

Satu base statis [base](#public-base-path) tidak cukup dalam skenario ini. Vite menyediakan dukungan eksperimental untuk opsi dasar lanjutan selama pembangunan, menggunakan `experimental.renderBuiltUrl`.

```ts
experimental: {
  renderBuiltUrl(filename: string, { hostType }: { hostType: 'js' | 'css' | 'html' }) {
    if (hostType === 'js') {
      return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
    } else {
      return { relative: true }
    }
  }
}
```

Jika aset yang dihashkan dan file publik tidak didistribusikan bersama, opsi untuk setiap grup dapat didefinisikan secara independen menggunakan jenis aset `type` yang disertakan dalam param kedua `context` yang diberikan ke fungsi.

```ts
experimental: {
  renderBuiltUrl(filename: string, { hostId, hostType, type }: { hostId: string, hostType: 'js' | 'css' | 'html', type: 'public' | 'asset' }) {
    if (type === 'public') {
      return 'https://www.domain.com/' + filename
    }
    else if (path.extname(hostId) === '.js') {
      return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` }
    }
    else {
      return 'https://cdn.domain.com/assets/' + filename
    }
  }
}
```

