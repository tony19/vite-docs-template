# Migrasi dari v4

## Dukungan Node.js

Vite tidak lagi mendukung Node.js 14 / 16 / 17 / 19, yang telah mencapai EOL. Node.js 18 / 20+ sekarang diperlukan.

## Rollup 4

Vite sekarang menggunakan Rollup 4 yang juga membawa perubahan yang mematahkan, khususnya:

- Penegasan Impor (`assertions` prop) telah diubah namanya menjadi atribut impor (`attributes` prop).
- Plugin Acorn tidak lagi didukung.
- Untuk plugin Vite, opsi `skipSelf` `this.resolve` sekarang `true` secara default.
- Untuk plugin Vite, `this.parse` sekarang hanya mendukung opsi `allowReturnOutsideFunction` untuk saat ini.

Baca perubahan yang lengkap di [catatan rilis Rollup](https://github.com/rollup/rollup/releases/tag/v4.0.0) untuk perubahan terkait pembangunan dalam [`build.rollupOptions`](/config/build-options.md#build-rollupoptions).

Jika Anda menggunakan TypeScript, pastikan untuk mengatur `moduleResolution: 'bundler'` (atau `node16`/`nodenext`) karena Rollup 4 memerlukannya. Atau Anda dapat mengatur `skipLibCheck: true` sebagai gantinya.

## Depreksi CJS Node API

API Node CJS dari Vite sudah kedaluwarsa. Ketika memanggil `require('vite')`, peringatan deprekasi sekarang dicatatkan. Anda harus memperbarui file atau kerangka kerja Anda untuk mengimpor build ESM dari Vite sebagai gantinya.

Dalam proyek Vite dasar, pastikan:

1. Isi file `vite.config.js` menggunakan sintaks ESM.
2. File `package.json` terdekat memiliki `"type": "module"`, atau gunakan ekstensi `.mjs`/`.mts`, misalnya `vite.config.mjs` atau `vite.config.mts`.

Untuk proyek lain, ada beberapa pendekatan umum:

- **Konfigurasikan ESM sebagai default, opt-in ke CJS jika diperlukan:** Tambahkan `"type": "module"` dalam `package.json` proyek. Semua file `*.js` sekarang diinterpretasikan sebagai ESM dan perlu menggunakan sintaks ESM. Anda dapat mengubah nama file dengan ekstensi `.cjs` untuk tetap menggunakan CJS.
- **Biarkan CJS sebagai default, opt-in ke ESM jika diperlukan:** Jika `package.json` proyek tidak memiliki `"type": "module"`, semua file `*.js` diinterpretasikan sebagai CJS. Anda dapat mengubah nama file dengan ekstensi `.mjs` untuk menggunakan ESM sebagai gantinya.
- **Dinamis impor Vite:** Jika Anda perlu tetap menggunakan CJS, Anda dapat mengimpor Vite secara dinamis menggunakan `import('vite')` sebagai gantinya. Ini memerlukan kode Anda ditulis dalam konteks `async`, tetapi seharusnya masih dapat dikelola karena API Vite sebagian besar adalah asinkron.

Lihat [panduan pemecahan masalah](/guide/troubleshooting.html#vite-cjs-node-api-deprecated) untuk informasi lebih lanjut.

## Rework Strategi Penggantian `define` dan `import.meta.env.*`

Di Vite 4, fitur [`define`](/config/shared-options.md#define) dan [`import.meta.env.*`](/guide/env-and-mode.md#env-variables) menggunakan strategi penggantian yang berbeda di pengembangan dan pembangunan:

- Di pengembangan, kedua fitur disuntikkan sebagai variabel global ke `globalThis` dan `import.meta` masing-masing.
- Di pembangunan, kedua fitur diganti secara statis dengan regex.

Hal ini mengakibatkan ketidaksesuaian antara pengembangan dan pembangunan saat mencoba mengakses variabel, dan terkadang bahkan menyebabkan pembangunan gagal. Misalnya:

```js
// vite.config.js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
})
```

```js
const data = { __APP_VERSION__ }
// pengembangan: { __APP_VERSION__: "1.0.0" } ✅
// pembangunan: { "1.0.0" } ❌

const docs = 'Saya suka import.meta.env.MODE'
// pengembangan: "Saya suka import.meta.env.MODE" ✅
// pembangunan: "Saya suka "production"" ❌
```

Vite 5 memperbaiki ini dengan menggunakan `esbuild` untuk menangani penggantian dalam pembangunan, sejalan dengan perilaku pengembangan.

Perubahan ini seharusnya tidak mempengaruhi sebagian besar setup, karena sudah didokumentasikan bahwa nilai `define` harus mengikuti sintaks `esbuild`:

> Untuk konsisten dengan perilaku `esbuild`, ekspresi harus berupa objek JSON (null, boolean, number, string, array, atau object) atau sebuah identifikasi tunggal.

Namun, jika Anda lebih suka tetap mengganti nilai secara statis secara langsung, Anda dapat menggunakan [`@rollup/plugin-replace`](https://github.com/rollup/plugins/tree/master/packages/replace).

## Perubahan Umum

### Nilai modul eksternal SSR sekarang sesuai dengan produksi

Di Vite 4, nilai modul eksternal SSR dibungkus dengan penanganan `.default` dan `.__esModule` untuk interoperabilitas yang lebih baik, tetapi tidak sesuai dengan perilaku produksi saat dimuat oleh lingkungan runtime (misalnya Node.js), menyebabkan inkonsistensi yang sulit dideteksi. Secara default, semua dependensi proyek langsung adalah eksternal SSR.

Vite 5 sekarang menghapus penanganan `.default` dan `.__esModule` untuk sesuai dengan perilaku produksi. Pada prakteknya, ini seharusnya tidak mempengaruhi dependensi yang dikemas dengan baik, tetapi jika Anda mengalami masalah baru saat memuat modul, Anda dapat mencoba refaktor-refaktor ini:

```js
// Sebelum:
import { foo } from 'bar'

// Sesudah:
import _bar from 'bar'
const { foo } = _bar
```

```js
// Sebelum:
import foo from 'bar'

// Sesudah:
import * as _foo from 'bar'
const foo = _foo.default
```

Perhatikan bahwa perubahan ini sesuai dengan perilaku Node.js, sehingga Anda juga dapat menjalankan impor di Node.js untuk mengujinya. Jika Anda lebih suka tetap menggunakan perilaku sebelumnya, Anda dapat mengatur `legacy.proxySsrExternalModules` menjadi `true`.

### `worker.plugins` sekarang merupakan fungsi

Di Vite 4, [`worker.plugins`](/config/worker-options.md#worker-plugins) menerima array plugin (`(Plugin | Plugin[])[]`). Mulai dari Vite 5, perlu dikonfigurasi sebagai fungsi yang mengembalikan array plugin (`() => (Plugin | Plugin[])[]`). Perubahan ini diperlukan agar build pekerjaan paralel berjalan lebih konsisten dan dapat diprediksi.

### Izinkan jalur yang mengandung `.` untuk fallback ke index.html

Di Vite 4, mengakses jalur dalam pengembangan yang mengandung `.` tidak fallback ke index.html bahkan jika [`appType`](/config/shared-options.md#apptype) diatur ke `'spa'` (default). Mulai dari Vite 5, itu akan fallback ke index.html.

Perhatikan bahwa browser tidak lagi menampilkan pesan kesalahan 404 di konsol jika Anda menunjuk jalur gambar ke file yang tidak ada (misalnya `<img src="./file-does-not-exist.png">`).

### Memperbarui perilaku pelayanan HTML pengembangan dan pratinjau

Di Vite 4, server pengembangan dan pratinjau melayani HTML berdasarkan struktur direktori dan trailing slash dengan cara yang berbeda. Ini menyebabkan inkonsistensi saat menguji aplikasi yang dibangun Anda. Vite 5 merefaktor menjadi perilaku tunggal seperti di bawah ini, dengan struktur file berikut:

```
├── index.html
├── file.html
└── dir
    └── index.html
```

| Permintaan         | Sebelumnya (pengembangan)    | Sebelumnya (pratinjau) | Setelahnya (pengembangan & pratinjau) |
| ----------------- | ---------------------------- | ----------------- | ---------------------------- |
| `/dir/index.html` | `/dir/index.html`            | `/dir/index.html` | `/dir/index.html`            |
| `/dir`            | `/index.html` (fallback SPA) | `/dir/index.html` | `/index.html` (fallback SPA) |
| `/dir/`           | `/dir/index.html`            | `/dir/index.html` | `/dir/index.html`            |
| `/file.html`      | `/file.html`                 | `/file.html`      | `/file.html`                 |
| `/file`           | `/index.html` (fallback SPA) | `/file.html`      | `/file.html`                 |
| `/file/`          | `/index.html` (fallback SPA) | `/file.html`      | `/index.html` (fallback SPA) |

### Berkas Manifest sekarang dihasilkan dalam direktori `.vite` secara default

Di Vite 4, berkas manifest ([`build.manifest`](/config/build-options.md#build-manifest) dan [`build.ssrManifest`](/config/build-options.md#build-ssrmanifest)) dihasilkan di root dari [`build.outDir`](/config/build-options.md#build-outdir) secara default.

Mulai dari Vite 5, mereka akan dihasilkan dalam direktori `.vite` di `build.outDir` secara default. Perubahan ini membantu menghindari konflik berkas publik dengan nama berkas manifest yang sama ketika mereka disalin ke `build.outDir`.

### Berkas CSS yang sesuai tidak terdaftar sebagai entri tingkat atas dalam berkas manifest.json

Di Vite 4, berkas CSS yang sesuai untuk titik masuk JavaScript juga terdaftar sebagai entri tingkat atas dalam berkas manifest ([`build.manifest`](/config/build-options.md#build-manifest)). Entri ini ditambahkan secara tidak sengaja dan hanya berfungsi untuk kasus-kasus sederhana.

Di Vite 5, berkas CSS yang sesuai hanya dapat ditemukan dalam bagian berkas masuk JavaScript.
Saat menyuntikkan berkas JS, berkas CSS yang sesuai [harus disuntikkan](/guide/backend-integration.md#:~:text=%3C!%2D%2D%20if%20production%20%2D%2D%3E%0A%3Clink%20rel%3D%22stylesheet%22%20href%3D%22/assets/%7B%7B%20manifest%5B%27main.js%27%5D.css%20%7D%7D%22%20/%3E%0A%3Cscript%20type%3D%22module%22%20src%3D%22/assets/%7B%7B%20manifest%5B%27main.js%27%5D.file%20%7D%7D%22%3E%3C/script%3E).
Saat CSS harus disuntikkan secara terpisah, itu harus ditambahkan sebagai titik masuk terpisah.

### Pintasan CLI memerlukan tekanan `Enter` tambahan

Pintasan CLI, seperti `r` untuk me-restart server pengembangan, sekarang memerlukan tekanan `Enter` tambahan untuk memicu pintasan. Misalnya, `r + Enter` untuk me-restart server pengembangan.

Perubahan ini mencegah Vite menelan dan mengontrol pintasan spesifik OS, memungkinkan kompatibilitas yang lebih baik saat menggabungkan server pengembangan Vite dengan proses lain, dan menghindari [catatan sebelumnya](https://github.com/vitejs/vite/pull/14342).

### Memperbarui Perilaku TypeScript `experimentalDecorators` dan `useDefineForClassFields`

Vite 5 menggunakan esbuild 0.19 dan menghapus lapisan kompatibilitas untuk esbuild 0.18, yang mengubah cara [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators) dan [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig#useDefineForClassFields) ditangani.

- **`experimentalDecorators` tidak diaktifkan secara default**

  Anda perlu mengatur `compilerOptions.experimentalDecorators` menjadi `true` dalam `tsconfig.json` untuk menggunakan decorator.

- **Nilai default `useDefineForClassFields` bergantung pada nilai TypeScript `target`**

  Jika `target` bukan `ESNext` atau `ES2022` atau yang lebih baru, atau jika tidak ada file `tsconfig.json`, `useDefineForClassFields` akan default menjadi `false` yang dapat bermasalah dengan nilai default `esbuild.target` dari `esnext`. Ini dapat ditranspilasi ke [blok inisialisasi statis](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility) yang mungkin tidak didukung di peramban Anda.

  Oleh karena itu, disarankan untuk mengatur `target` menjadi `ESNext` atau `ES2022` atau yang lebih baru, atau atur `useDefineForClassFields` menjadi `true` secara eksplisit saat mengonfigurasi `tsconfig.json`.

```jsonc
{
  "compilerOptions": {
    // Atur true jika Anda menggunakan decorator
    "experimentalDecorators": true,
    // Atur true jika Anda melihat kesalahan parsing di peramban Anda
    "useDefineForClassFields": true,
  },
}
```

### Menghapus `--https` flag dan `https: true`

Flag `--https` mengatur `server.https: true` dan `preview.https: true` secara internal. Konfigurasi ini dimaksudkan untuk digunakan bersama dengan fitur generasi sertifikat https otomatis yang [dihapus pada Vite 3](https://v3.vitejs.dev/guide/migration.html#automatic-https-certificate-generation). Oleh karena itu, konfigurasi ini tidak lagi berguna karena akan memulai server HTTPS Vite tanpa sertifikat.

Jika Anda menggunakan [`@vitejs/plugin-basic-ssl`](https://github.com/vitejs/vite-plugin-basic-ssl) atau [`vite-plugin-mkcert`](https://github.com/liuweiGL/vite-plugin-mkcert), mereka akan mengatur konfigurasi `https` secara internal, sehingga Anda dapat menghapus `--https`, `server.https: true`, dan `preview.https: true` dalam setup Anda.

### Menghapus API `resolvePackageEntry` dan `resolvePackageData`

API `resolvePackageEntry` dan `resolvePackageData` dihapus karena mereka mengekspos internal Vite dan menghalangi optimisasi potensial Vite 4.3 di masa lalu. API ini dapat digantikan dengan paket pihak ketiga, misalnya:

- `resolvePackageEntry`: [`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) atau paket [`import-meta-resolve`](https://github.com/wooorm/import-meta-resolve).
- `resolvePackageData`: Sama seperti di atas, dan jelajahi direktori paket untuk mendapatkan `package.json` root. Atau gunakan paket komunitas [`vitefu`](https://github.com/svitejs/vitefu).

```js
import { resolve } from 'import-meta-env'
import { findDepPkgJsonPath } from 'vitefu'
import fs from 'node:fs'

const pkg = 'my-lib'
const basedir = process.cwd()

// `resolvePackageEntry`:
const packageEntry = resolve(pkg, basedir)

// `resolvePackageData`:
const packageJsonPath = findDepPkgJsonPath(pkg, basedir)
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
```

## API Lama yang Dihapus

- Ekspor default dari berkas CSS (misalnya `import style from './foo.css'`): Gunakan kueri `?inline` sebagai gantinya
- `import.meta.globEager`: Gunakan `import.meta.glob('*', { eager: true })` sebagai gantinya
- `ssr.format: 'cjs'` dan `legacy.buildSsrCjsExternalHeuristics` ([#13816](https://github.com/vitejs/vite/discussions/13816))
- `server.middlewareMode: 'ssr'` dan `server.middlewareMode: 'html'`: Gunakan [`appType`](/config/shared-options.md#apptype) + [`server.middlewareMode: true`](/config/server-options.md#server-middlewaremode) sebagai gantinya ([#8452](https://github.com/vitejs/vite/pull/8452))

## Lanjutan

Ada beberapa perubahan yang hanya memengaruhi pencipta plugin/alat.

- [[#14119] refactor!: menggabungkan `PreviewServerForHook` ke dalam tipe `PreviewServer`](https://github.com/vitejs/vite/pull/14119)
  - Hook `configurePreviewServer` sekarang menerima tipe `PreviewServer` daripada tipe `PreviewServerForHook`.
- [[#14818] refactor(preview)!: menggunakan middleware dasar](https://github.com/vitejs/vite/pull/14818)
  - Middleware yang ditambahkan dari fungsi yang dikembalikan dalam `configurePreviewServer` sekarang tidak memiliki akses ke `base` saat membandingkan nilai `req.url`. Hal ini menyelaraskan perilaku dengan server pengembangan. Anda dapat memeriksa `base` dari hook `configResolved` jika diperlukan.
- [[#14834] fix(types)!: ekspos httpServer dengan Http2SecureServer union](https://github.com/vitejs/vite/pull/14834)
  - `http.Server | http2.Http2SecureServer` sekarang digunakan daripada `http.Server` jika diperlukan.

Terdapat juga perubahan yang mengganggu yang hanya memengaruhi beberapa pengguna.

- [[#14098] fix!: hindari menulis ulang this (membatalkan #5312)](https://github.com/vitejs/vite/pull/14098)
  - `this` tingkat atas ditulis ulang menjadi `globalThis` secara default saat membangun. Perilaku ini sekarang dihapus.
- [[#14231] feat!: tambahkan ekstensi ke modul virtual internal](https://github.com/vitejs/vite/pull/14231)
  - ID modul virtual internal sekarang memiliki ekstensi (`.js`).
- [[#14583] refactor!: hapus ekspor API internal](https://github.com/vitejs/vite/pull/14583)
  - API internal yang diekspor secara tidak sengaja dihapus: `isDepsOptimizerEnabled` dan `getDepOptimizationConfig`
  - Tipe internal yang diekspor dihapus: `DepOptimizationResult`, `DepOptimizationProcessing`, dan `DepsOptimizer`
  - Menamai ulang tipe `ResolveWorkerOptions` menjadi `ResolvedWorkerOptions`
- [[#5657] fix: kembalikan 404 untuk permintaan sumber di luar jalur dasar](https://github.com/vitejs/vite/pull/5657)
  - Sebelumnya, Vite merespons permintaan di luar jalur dasar tanpa `Accept: text/html`, seolah-olah mereka diminta dengan jalur dasar. Vite sekarang tidak melakukan itu dan merespons dengan 404 sebagai gantinya.
- [[#14723] fix(resolve)!: hapus penanganan .mjs khusus](https://github.com/vitejs/vite/pull/14723)
  - Sebelumnya, ketika bidang `"exports"` sebuah pustaka memetakan ke file `.mjs`, Vite masih mencoba mencocokkan bidang `"browser"` dan `"module"` untuk memperbaiki kompatibilitas dengan beberapa pustaka. Perilaku ini sekarang dihapus untuk menyelaraskan dengan algoritma resolusi ekspor.
- [[#14733] feat(resolve)!: hapus `resolve.browserField`](https://github.com/vitejs/vite/pull/14733)
  - `resolve.browserField` sudah ditinggalkan sejak Vite 3 demi default yang diperbarui dari `['browser', 'module', 'jsnext:main', 'jsnext']` untuk [`resolve.mainFields`](/config/shared-options.md#resolve-mainfields).
- [[#14855] feat!: tambahkan isPreview ke ConfigEnv dan resolveConfig](https://github.com/vitejs/vite/pull/14855)
  - Menamai ulang `ssrBuild` menjadi `isSsrBuild` dalam objek `ConfigEnv`.
- [[#14945] fix(css): atur nama sumber manifest dengan benar dan kirimkan file CSS](https://github.com/vitejs/vite/pull/14945)
  - Nama file CSS sekarang dibuat berdasarkan nama chunk.

## Migrasi dari v3

Periksa [Panduan Migrasi dari v3](https://v4.vitejs.dev/guide/migration.html) di dokumen Vite v4 terlebih dahulu untuk melihat perubahan yang diperlukan untuk memindahkan aplikasi Anda ke Vite v4, dan kemudian lanjutkan dengan perubahan pada halaman ini.
