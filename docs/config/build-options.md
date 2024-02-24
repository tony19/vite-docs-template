# Opsi Pembangunan

## build.target

- **Tipe:** `string | string[]`
- **Default:** `'modules'`
- **Terhubung:** [Kompatibilitas Browser](/guide/build#browser-compatibility)

Target kompatibilitas browser untuk bundel akhir. Nilai default adalah nilai khusus Vite, `'modules'`, yang ditargetkan pada browser dengan dukungan [Modul ES native](https://caniuse.com/es6-module), [import dinamis ESM native](https://caniuse.com/es6-module-dynamic-import), dan dukungan [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta). Vite akan mengganti `'modules'` menjadi `['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']`

Nilai khusus lainnya adalah `'esnext'` - yang mengasumsikan dukungan impor dinamis native dan akan mentranspilasi sedikit mungkin:

- Jika opsi [`build.minify`](#build-minify) adalah `'terser'` dan versi Terser yang terpasang berada di bawah 5.16.0, `'esnext'` akan dipaksa turun menjadi `'es2021'`.
- Dalam kasus lain, itu tidak akan melakukan transpilasi sama sekali.

Transformasi dilakukan dengan esbuild dan nilai harus menjadi opsi target [esbuild yang valid](https://esbuild.github.io/api/#target). Target kustom dapat berupa versi ES (misalnya `es2015`), browser dengan versi (misalnya `chrome58`), atau sebuah array dari beberapa string target.

Perlu dicatat bahwa pembangunan akan gagal jika kode mengandung fitur yang tidak dapat diterjemahkan dengan aman oleh esbuild. Lihat [dokumentasi esbuild](https://esbuild.github.io/content-types/#javascript) untuk lebih detail.

## build.modulePreload

- **Tipe:** `boolean | { polyfill?: boolean, resolveDependencies?: ResolveModulePreloadDependenciesFn }`
- **Default:** `{ polyfill: true }`

Secara default, sebuah [module preload polyfill](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill) secara otomatis disuntikkan. Polyfill secara otomatis disuntikkan ke modul proxy dari setiap entri `index.html`. Jika pembangunan dikonfigurasi untuk menggunakan entri kustom non-HTML melalui `build.rollupOptions.input`, maka perlu untuk mengimpor secara manual polyfill di entri kustom Anda:

```js
import 'vite/modulepreload-polyfill'
```

Catatan: polyfill tidak **berlaku** untuk [Mode Perpustakaan](/guide/build#library-mode). Jika Anda perlu mendukung browser tanpa impor dinamis native, Anda sebaiknya menghindari menggunakannya dalam perpustakaan Anda.

Polyfill dapat dinonaktifkan menggunakan `{ polyfill: false }`.

Daftar chuck yang akan dimuat sebelumnya untuk setiap impor dinamis dihitung oleh Vite. Secara default, sebuah path absolut termasuk `base` akan digunakan saat memuat dependensi ini. Jika `base` bersifat relatif (`''` atau `'./'`), `import.meta.url` digunakan saat runtime untuk menghindari path absolut yang tergantung pada base yang diterapkan akhir.

Ada dukungan eksperimental untuk kontrol yang sangat halus terhadap daftar dependensi dan path mereka menggunakan fungsi `resolveDependencies`. [Beri Masukan](https://github.com/vitejs/vite/discussions/13841). Ini mengharapkan sebuah fungsi dengan tipe `ResolveModulePreloadDependenciesFn`:

```ts
type ResolveModulePreloadDependenciesFn = (
  url: string,
  deps: string[],
  context: {
    importer: string
  },
) => string[]
```

Fungsi `resolveDependencies` akan dipanggil untuk setiap impor dinamis dengan daftar chuck yang dibutuhkan, dan juga akan dipanggil untuk setiap chunk yang diimpor dalam file HTML entri. Sebuah array dependensi baru dapat dikembalikan dengan dependensi ini difilter atau lebih banyak yang disuntikkan, dan path mereka dimodifikasi. Path `deps` relatif terhadap `build.outDir`. Mengembalikan path relatif ke `hostId` untuk `hostType === 'js'` diperbolehkan, dalam hal ini `new URL(dep, import.meta.url)` digunakan untuk mendapatkan path absolut saat menyuntikkan modul preload ini di kepala HTML.

```js
modulePreload: {
  resolveDependencies: (filename, deps, { hostId, hostType }) => {
    return deps.filter(condition)
  }
}
```

Path dependensi yang dipecahkan dapat dimodifikasi lebih lanjut menggunakan [`experimental.renderBuiltUrl`](../guide/build.md#advanced-base-options).

## build.polyfillModulePreload

- **Tipe:** `boolean`
- **Default:** `true`
- **Diperingatkan** gunakan `build.modulePreload.polyfill` sebagai gantinya

Apakah akan secara otomatis menyuntikkan [module preload polyfill](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill).

## build.outDir

- **Tipe:** `string`
- **Default:** `dist`

Tentukan direktori output (relatif terhadap [root proyek](/guide/#index-html-and-project-root)).

## build.assetsDir

- **Tipe:** `string`
- **Default:** `assets`

Tentukan direktori untuk meletakkan aset yang dihasilkan di bawah (relatif terhadap `build.outDir`. Ini tidak digunakan dalam [Mode Perpustakaan](/guide/build#library-mode)).

## build.assetsInlineLimit

- **Tipe:** `number` | `((filePath: string, content: Buffer) => boolean | undefined)`
- **Default:** `4096` (4 KiB)

Aset yang diimpor atau direferensikan yang lebih kecil dari ambang batas ini akan disisipkan sebagai URL base64 untuk menghindari permintaan http tambahan. Tetapkan ke `0` untuk menonaktifkan penyisipan secara keseluruhan.

Jika sebuah panggilan kembali dilewatkan, sebuah boolean dapat dikembalikan untuk mendaftar masuk atau keluar. Jika tidak ada yang dikembalikan, logika default diterapkan.

Placeholder Git LFS secara otomatis dikecualikan dari penyisipan karena mereka tidak berisi konten dari file yang mereka wakili.

::: tip Catatan
Jika Anda menentukan `build.lib`, `build.assetsInlineLimit` akan diabaikan dan aset akan selalu disisipkan, terlepas dari ukuran file atau merupakan placeholder Git LFS.
:::

## build.cssCodeSplit

- **Tipe:** `boolean`
- **Default:** `true`

Aktif/nonaktifkan pembelahan kode CSS. Ketika diaktifkan, CSS yang diimpor dalam chunk JS async akan dipertahankan sebagai chunk dan diambil bersama saat chunk diambil.

Jika dinonaktifkan, semua CSS dalam proyek keseluruhan akan diekstraksi menjadi satu file CSS.

::: tip Catatan
Jika Anda menentukan `build.lib`, `build.cssCodeSplit` akan `false` secara default.
:::

## build.cssTarget

- **Tipe:** `string | string[]`
- **Default:** sama dengan [`build.target`](#build-target)

Opsi ini memungkinkan pengguna untuk mengatur target browser yang berbeda untuk pemadatan CSS dari yang digunakan untuk transpilasi JavaScript.

Ini seharusnya hanya digunakan saat Anda mengarahkan browser yang tidak umum.
Salah satu contohnya adalah Android WeChat WebView, yang mendukung sebagian besar fitur JavaScript modern tetapi tidak mendukung [notasi warna heksadesimal `#RGBA` dalam CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb_colors).
Dalam kasus ini, Anda perlu mengatur `build.cssTarget` ke `chrome61` untuk mencegah vite mentransformasi warna `rgba()` menjadi notasi heksadesimal `#RGBA`.

## build.cssMinify

- **Tipe:** `boolean | 'esbuild' | 'lightningcss'`
- **Default:** sama dengan [`build.minify`](#build-minify)

Opsi ini memungkinkan pengguna untuk mengesampingkan pemadatan CSS secara khusus daripada mengembalikan ke default `build.minify`, sehingga Anda dapat mengonfigurasi pemadatan untuk JS dan CSS secara terpisah. Vite menggunakan `esbuild` secara default untuk memadatkan CSS. Atur opsi ini menjadi `'lightningcss'` untuk menggunakan [Lightning CSS](https://lightningcss.dev/minification.html) sebagai gantinya. Jika dipilih, itu dapat dikonfigurasi menggunakan [`css.lightningcss`](./shared-options.md#css-lightningcss).

## build.sourcemap

- **Tipe:** `boolean | 'inline' | 'hidden'`
- **Default:** `false`

Menghasilkan sourcemap produksi. Jika `true`, file sourcemap terpisah akan dibuat. Jika `'inline'`, sourcemap akan ditambahkan ke file output hasil sebagai URI data. `'hidden'` bekerja seperti `true` kecuali bahwa komentar sourcemap yang sesuai dalam file bundel akan ditahan.

## build.rollupOptions

- **Tipe:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

Menyesuaikan bundel Rollup yang mendasarinya secara langsung. Ini sama dengan opsi yang dapat diekspor dari file konfigurasi Rollup dan akan digabungkan dengan opsi Rollup internal Vite. Lihat [dokumentasi opsi Rollup](https://rollupjs.org/configuration-options/) untuk detail lebih lanjut.

## build.commonjsOptions

- **Tipe:** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

Opsi untuk dilewatkan ke [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs).

## build.dynamicImportVarsOptions

- **Tipe:** [`RollupDynamicImportVarsOptions`](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options)
- **Terhubung:** [Impor Dinamis](/guide/features#dynamic-import)

Opsi untuk dilewatkan ke [@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars).

## build.lib

- **Tipe:** `{ entry: string | string[] | { [entryAlias: string]: string }, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat, entryName: string) => string) }`
- **Terhubung:** [Mode Perpustakaan](/guide/build#library-mode)

Bangun sebagai perpustakaan. `entry` diperlukan karena perpustakaan tidak dapat menggunakan HTML sebagai entri. `name` adalah variabel global yang diekspos dan diperlukan ketika `formats` mencakup `'umd'` atau `'iife'`. Default `formats` adalah `['es', 'umd']`, atau `['es', 'cjs']`, jika beberapa entri digunakan. `fileName` adalah nama output file paket, default `fileName` adalah opsi nama dari package.json, itu juga dapat didefinisikan sebagai fungsi yang mengambil `format` dan `entryAlias` sebagai argumen.

## build.manifest

- **Tipe:** `boolean | string`
- **Default:** `false`
- **Terhubung:** [Integrasi Backend](/guide/backend-integration)

Ketika diatur ke `true`, pembangunan juga akan menghasilkan file `.vite/manifest.json` yang berisi pemetaan nama file aset yang tidak terhash dengan versi yang dihash, yang kemudian dapat digunakan oleh kerangka kerja server untuk merender tautan aset yang benar. Ketika nilainya adalah string, itu akan digunakan sebagai nama file manifest.

## build.ssrManifest

- **Tipe:** `boolean | string`
- **Default:** `false`
- **Terkait:** [Rendering di Sisi Server](/guide/ssr)

Ketika diatur menjadi `true`, pembangunan juga akan menghasilkan manifes SSR untuk menentukan tautan gaya dan direktif pra-pemuatan aset dalam produksi. Ketika nilai tersebut berupa string, akan digunakan sebagai nama file manifes.

## build.ssr

- **Tipe:** `boolean | string`
- **Default:** `false`
- **Terkait:** [Rendering di Sisi Server](/guide/ssr)

Menghasilkan pembangunan berorientasi SSR. Nilai dapat berupa string untuk secara langsung menentukan entri SSR, atau `true`, yang memerlukan penentuan entri SSR melalui `rollupOptions.input`.

## build.ssrEmitAssets

- **Tipe:** `boolean`
- **Default:** `false`

Selama pembangunan SSR, aset statis tidak dihasilkan karena diasumsikan bahwa mereka akan dihasilkan sebagai bagian dari pembangunan klien. Opsi ini memungkinkan framework untuk memaksa menghasilkan mereka baik dalam pembangunan klien maupun SSR. Tanggung jawab framework untuk menggabungkan aset dengan langkah pembangunan pasca.

## build.minify

- **Tipe:** `boolean | 'terser' | 'esbuild'`
- **Default:** `'esbuild'` untuk pembangunan klien, `false` untuk pembangunan SSR

Atur menjadi `false` untuk menonaktifkan pemampatan, atau tentukan pemampat yang akan digunakan. Defaultnya adalah [esbuild](https://github.com/evanw/esbuild) yang 20 ~ 40x lebih cepat daripada terser dan hanya 1 ~ 2% lebih buruk kompresinya. [Benchmarks](https://github.com/privatenumber/minification-benchmarks)

Perhatikan bahwa opsi `build.minify` tidak memampatkan spasi putih ketika menggunakan format `'es'` dalam mode lib, karena menghapus anotasi murni dan menghancurkan tree-shaking.

Terser harus diinstal saat diatur menjadi `'terser'`.

```sh
npm add -D terser
```

## build.terserOptions

- **Tipe:** `TerserOptions`

Opsi pemampatan tambahan [minify options](https://terser.org/docs/api-reference#minify-options) untuk dilewatkan ke Terser.

Selain itu, Anda juga dapat melewati opsi `maxWorkers: number` untuk menentukan jumlah maksimum pekerja yang akan dihasilkan. Defaultnya adalah jumlah CPU dikurangi 1.

## build.write

- **Tipe:** `boolean`
- **Default:** `true`

Atur menjadi `false` untuk menonaktifkan penulisan bundel ke disk. Ini sebagian besar digunakan dalam [panggilan `build()` programatik](/guide/api-javascript#build) di mana proses lanjutan bundel diperlukan sebelum penulisan ke disk.

## build.emptyOutDir

- **Tipe:** `boolean`
- **Default:** `true` jika `outDir` berada di dalam `root`

Secara default, Vite akan mengosongkan `outDir` saat pembangunan jika berada di dalam root proyek. Ini akan mengeluarkan peringatan jika `outDir` berada di luar root untuk menghindari penghapusan file penting secara tidak sengaja. Anda dapat secara eksplisit mengatur opsi ini untuk menekan peringatan. Ini juga tersedia melalui baris perintah sebagai `--emptyOutDir`.

## build.copyPublicDir

- **Tipe:** `boolean`
- **Default:** `true`

Secara default, Vite akan menyalin file dari `publicDir` ke dalam `outDir` saat pembangunan. Atur menjadi `false` untuk menonaktifkan ini.

## build.reportCompressedSize

- **Tipe:** `boolean`
- **Default:** `true`

Aktif/nonaktifkan pelaporan ukuran yang diperkecil dengan gzip. Mengompresi file output besar bisa lambat, jadi menonaktifkan ini dapat meningkatkan kinerja pembangunan untuk proyek-proyek besar.

## build.chunkSizeWarningLimit

- **Tipe:** `number`
- **Default:** `500`

Batas untuk peringatan ukuran chunk (dalam kB). Ini dibandingkan dengan ukuran chunk yang tidak terkompresi karena [ukuran JavaScript sendiri terkait dengan waktu eksekusi](https://v8.dev/blog/cost-of-javascript-2019).

## build.watch

- **Tipe:** [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch)`| null`
- **Default:** `null`

Atur ke `{}` untuk mengaktifkan pemantauan rollup. Ini sebagian besar digunakan dalam kasus-kasus yang melibatkan proses plugin atau integrasi hanya pembangunan.

::: Peringatan Menggunakan Vite pada Windows Subsystem for Linux (WSL) 2

Ada kasus-kasus di mana pemantauan sistem file tidak berfungsi dengan WSL2.
Lihat [`server.watch`](./server-options.md#server-watch) untuk lebih detail.

:::
