# Opsi Bersama

## root

- **Tipe:** `string`
- **Default:** `process.cwd()`

Direktori root proyek (di mana `index.html` berada). Dapat berupa path absolut atau path relatif terhadap direktori kerja saat ini.

Lihat [Root Proyek](/guide/#index-html-and-project-root) untuk lebih detail.

## base

- **Tipe:** `string`
- **Default:** `/`
- **Terkait:** [`server.origin`](/config/server-options.md#server-origin)

Path publik dasar saat disajikan dalam pengembangan atau produksi. Nilai valid meliputi:

- Path absolut URL, misalnya `/foo/`
- URL lengkap, misalnya `https://foo.com/` (Bagian origin tidak akan digunakan dalam pengembangan)
- String kosong atau `./` (untuk penyebaran tersemat)

Lihat [Path Dasar Publik](/guide/build#public-base-path) untuk lebih detail.

## mode

- **Tipe:** `string`
- **Default:** `'development'` untuk serve, `'production'` untuk build

Menentukan ini dalam konfigurasi akan menggantikan mode default untuk **baik serve maupun build**. Nilai ini juga dapat digantikan melalui opsi baris perintah `--mode`.

Lihat [Variabel Lingkungan dan Mode](/guide/env-and-mode) untuk lebih detail.

## define

- **Tipe:** `Record<string, string>`

Tentukan penggantian konstan global. Entri akan ditentukan sebagai global selama pengembangan dan diganti secara statis selama build.

Vite menggunakan [esbuild defines](https://esbuild.github.io/api/#define) untuk melakukan penggantian, jadi ekspresi nilai harus berupa string yang berisi nilai yang dapat di-JSON-serialisasi (null, boolean, number, string, array, atau object) atau sebuah identifikasi tunggal. Untuk nilai non-string, Vite akan secara otomatis mengonversinya menjadi string dengan `JSON.stringify`.

**Contoh:**

```js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('v1.0.0'),
    __API_URL__: 'window.__backend_api_url',
  },
})
```

::: tip CATATAN
Untuk pengguna TypeScript, pastikan untuk menambahkan deklarasi tipe dalam file `env.d.ts` atau `vite-env.d.ts` untuk mendapatkan pengecekan tipe dan Intellisense.

Contoh:

```ts
// vite-env.d.ts
declare const __APP_VERSION__: string
```

:::

## plugins

- **Tipe:** `(Plugin | Plugin[] | Promise<Plugin | Plugin[]>)[]`

Array plugin yang digunakan. Plugin yang falsy diabaikan dan array plugin diluruskannya. Jika sebuah promise dikembalikan, itu akan diselesaikan sebelum berjalan. Lihat [API Plugin](/guide/api-plugin) untuk detail lebih lanjut tentang plugin Vite.

## publicDir

- **Tipe:** `string | false`
- **Default:** `"public"`

Direktori yang digunakan sebagai aset statis biasa. File dalam direktori ini disajikan di `/` selama pengembangan dan disalin ke root `outDir` selama build, dan selalu disajikan atau disalin apa adanya tanpa transformasi. Nilainya bisa berupa path sistem file absolut atau path relatif terhadap root proyek.

Menentukan `publicDir` sebagai `false` menonaktifkan fitur ini.

Lihat [Direktori `public`](/guide/assets#the-public-directory) untuk detail lebih lanjut.

## cacheDir

- **Tipe:** `string`
- **Default:** `"node_modules/.vite"`

Direktori untuk menyimpan file cache. File dalam direktori ini adalah dependensi yang telah di-bundle sebelumnya atau beberapa file cache lain yang dihasilkan oleh vite, yang dapat meningkatkan kinerja. Anda dapat menggunakan flag `--force` atau menghapus direktori secara manual untuk memperbarui ulang file cache. Nilainya bisa berupa path sistem file absolut atau path relatif terhadap root proyek. Default ke `.vite` ketika tidak ada package.json yang terdeteksi.

## resolve.alias

- **Tipe:**
  `Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>`

Akan diteruskan ke `@rollup/plugin-alias` sebagai [opsi entri](https://github.com/rollup/plugins/tree/master/packages/alias#entries)-nya. Bisa berupa objek, atau array pasangan `{ find, replacement, customResolver }`.

Ketika menetapkan alias ke path sistem file, selalu gunakan path absolut. Nilai alias relatif akan digunakan apa adanya dan tidak akan diubah menjadi path sistem file.

Resolusi kustom yang lebih canggih dapat dicapai melalui [plugin](/guide/api-plugin).

::: warning Penggunaan dengan SSR
Jika Anda telah mengonfigurasi alias untuk [dependensi eksternal SSR](/guide/ssr.md#ssr-externals), Anda mungkin ingin mengalias paket `node_modules` yang sebenarnya. Baik [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) maupun [pnpm](https://pnpm.io/aliases/) mendukung pengaliasan melalui awalan `npm:`.
:::

## resolve.dedupe

- **Tipe:** `string[]`

Jika Anda memiliki salinan duplikat dari dependensi yang sama di aplikasi Anda (mungkin karena hoisting atau paket yang terhubung di repositori monorepo), gunakan opsi ini untuk memaksa Vite selalu meresolusi dependensi yang terdaftar ke salinan yang sama (dari root proyek).

:::warning SSR + ESM
Untuk build SSR, deduplikasi tidak berfungsi untuk output build ESM yang dikonfigurasi dari `build.rollupOptions.output`. Solusi sementara adalah menggunakan output build CJS hingga ESM memiliki dukungan plugin yang lebih baik untuk pemuatan modul.
:::

## resolve.conditions

- **Tipe:** `string[]`

Kondisi tambahan yang diizinkan saat meresolusi [Ekspor Kondisional](https://nodejs.org/api/packages.html#packages_conditional_exports) dari sebuah paket.

Sebuah paket dengan ekspor kondisional dapat memiliki bidang `exports` berikut dalam `package.json`-nya:

```json
{
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.js"
    }
  }
}
```

Di sini, `import` dan `require` adalah "kondisi". Kondisi dapat bersarang dan harus ditentukan dari yang paling spesifik hingga yang paling umum.

Vite memiliki daftar "kondisi yang diizinkan" dan akan mencocokkan kondisi pertama yang ada dalam daftar yang diizinkan. Opsi konfigurasi `resolve.conditions` memungkinkan untuk menentukan kondisi tambahan yang diizinkan.

:::warning Resolusi ekspor subpath
Kunci ekspor yang berakhir dengan "/" sudah tidak direkomendasikan oleh Node dan mungkin tidak berfungsi dengan baik. Silakan hubungi pengarang paket untuk menggunakan [pola subpath `*`](https://nodejs.org/api/packages.html#package-entry-points) sebagai gantinya.
:::

## resolve.mainFields

- **Tipe:** `string[]`
- **Default:** `['browser', 'module', 'jsnext:main', 'jsnext']`

Daftar bidang dalam `package.json` yang dicoba saat meresolusi titik masuk paket. Perhatikan ini mengambil prioritas lebih rendah daripada ekspor kondisional yang diresolusi dari bidang `exports`: jika sebuah titik masuk berhasil diresolusi dari `exports`, bidang utama akan diabaikan.

## resolve.extensions

- **Tipe:** `string[]`
- **Default:** `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`

Daftar ekstensi file yang dicoba untuk impor yang tidak menyertakan ekstensi. Perhatikan bahwa **TIDAK** disarankan untuk menghilangkan ekstensi untuk jenis impor kustom (mis. `.vue`) karena dapat mengganggu dukungan IDE dan tipe.

## resolve.preserveSymlinks

- **Tipe:** `boolean`
- **Default:** `false`

Mengaktifkan pengaturan ini menyebabkan vite menentukan identitas file berdasarkan path file asli (yaitu path tanpa mengikuti symlink) alih-alih path file yang sebenarnya (yaitu path setelah mengikuti symlink).

- **Terkait:** [esbuild#preserve-symlinks](https://esbuild.github.io/api/#preserve-symlinks), [webpack#resolve.symlinks](https://webpack.js.org/configuration/resolve/#resolvesymlinks)

## css.modules

- **Tipe:**
  ```ts
  interface CSSModulesOptions {
    getJSON?: (
      cssFileName: string,
      json: Record<string, string>,
      outputFileName: string,
    ) => void
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: RegExp[]
    exportGlobals?: boolean
    generateScopedName?:
      | string
      | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    /**
     * default: undefined
     */
    localsConvention?:
      | 'camelCase'
      | 'camelCaseOnly'
      | 'dashes'
      | 'dashesOnly'
      | ((
          originalClassName: string,
          generatedClassName: string,
          inputFile: string,
        ) => string)
  }
  ```

Konfigurasi perilaku CSS modules. Opsi tersebut diteruskan ke [postcss-modules](https://github.com/css-modules/postcss-modules).

Opsi ini tidak memiliki efek apa pun saat menggunakan [Lightning CSS](../guide/features.md#lightning-css). Jika diaktifkan, [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) harus digunakan.

## css.postcss

- **Tipe:** `string | (postcss.ProcessOptions & { plugins?: postcss.AcceptedPlugin[] })`

Konfigurasi PostCSS dalam kode atau direktori khusus untuk mencari konfigurasi PostCSS (default adalah root proyek).

Untuk konfigurasi PostCSS dalam kode, formatnya sama seperti `postcss.config.js`. Namun untuk properti `plugins`, hanya [format array](https://github.com/postcss/postcss-load-config/blob/main/README.md#array) yang dapat digunakan.

Pencarian dilakukan menggunakan [postcss-load-config](https://github.com/postcss/postcss-load-config) dan hanya nama file konfigurasi yang didukung yang dimuat.

Catatan: jika konfigurasi dalam kode disediakan, Vite tidak akan mencari sumber konfigurasi PostCSS lainnya.

## css.preprocessorOptions

- **Tipe:** `Record<string, object>`

Menentukan opsi yang akan diteruskan ke pra-pemroses CSS. Ekstensi file digunakan sebagai kunci untuk opsi. Opsi yang didukung untuk masing-masing pra-pemroses dapat ditemukan dalam dokumentasi mereka masing-masing:

- `sass`/`scss` - [Opsi](https://sass-lang.com/documentation/js-api/interfaces/LegacyStringOptions).
- `less` - [Opsi](https://lesscss.org/usage/#less-options).
- `styl`/`stylus` - Hanya [`define`](https://stylus-lang.com/docs/js.html#define-name-node) yang didukung, yang dapat diteruskan sebagai objek.

Semua opsi pra-pemroses juga mendukung opsi `additionalData`, yang dapat digunakan untuk menyisipkan kode ekstra untuk setiap konten gaya.

**Contoh:**

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        math: 'parens-division',
      },
      styl: {
        define: {
          $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1),
        },
      },
    },
  },
})
```

### css.preprocessorOptions[extension].additionalData

- **Tipe:** `string | ((source: string, filename: string) => (string | { content: string; map?: SourceMap }))`

Opsi ini dapat digunakan untuk menyisipkan kode ekstra untuk setiap konten gaya. Perhatikan bahwa jika Anda menyertakan gaya sebenarnya dan bukan hanya variabel, gaya tersebut akan diduplikasi dalam bundel akhir.

**Contoh:**

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`,
      },
    },
  },
})
```

## css.preprocessorMaxWorkers

- **Eksperimental:** [Berikan Masukan](TODO: update)
- **Tipe:** `number | true`
- **Default:** `0` (tidak membuat pekerja dan berjalan di utas utama)

Jika opsi ini diatur, pra-pemroses CSS akan berjalan di pekerja ketika memungkinkan. `true` berarti jumlah CPU dikurangi 1.

## css.devSourcemap

- **Eksperimental:** [Berikan Masukan](https://github.com/vitejs/vite/discussions/13845)
- **Tipe:** `boolean`
- **Default:** `false`

Apakah akan mengaktifkan sourcemaps selama pengembangan.

## css.transformer

- **Eksperimental:** [Berikan Masukan](https://github.com/vitejs/vite/discussions/13835)
- **Tipe:** `'postcss' | 'lightningcss'`
- **Default:** `'postcss'`

Memilih mesin yang digunakan untuk pemrosesan CSS. Lihat [Lightning CSS](../guide/features.md#lightning-css) untuk informasi lebih lanjut.

## css.lightningcss

- **Eksperimental:** [Berikan Masukan](https://github.com/vitejs/vite/discussions/13835)
- **Tipe:**

```js
import type {
  CSSModulesConfig,
  Drafts,
  Features,
  NonStandard,
  PseudoClasses,
  Targets,
} from 'lightningcss'
```

```js
{
  targets?: Targets
  include?: Features
  exclude?: Features
  drafts?: Drafts
  nonStandard?: NonStandard
  pseudoClasses?: PseudoClasses
  unusedSymbols?: string[]
  cssModules?: CSSModulesConfig,
  // ...
}
```

Mengkonfigurasi Lightning CSS. Opsi transformasi lengkap dapat ditemukan di [repo Lightning CSS](https://github.com/parcel-bundler/lightningcss/blob/master/node/index.d.ts).

## json.namedExports

- **Tipe:** `boolean`
- **Default:** `true`

Menentukan apakah akan mendukung impor bernama dari file `.json`.

## json.stringify

- **Tipe:** `boolean`
- **Default:** `false`

Jika diatur menjadi `true`, JSON yang diimpor akan diubah menjadi `export default JSON.parse("...")` yang jauh lebih performant daripada literal Objek, terutama ketika file JSON tersebut besar.

Mengaktifkan ini akan menonaktifkan impor bernama.

## esbuild

- **Tipe:** `ESBuildOptions | false`

`ESBuildOptions` memperluas [opsi transformasi esbuild sendiri](https://esbuild.github.io/api/#transform). Kasus penggunaan yang paling umum adalah menyesuaikan JSX:

```js
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
```

Secara default, esbuild diterapkan pada file `ts`, `jsx` dan `tsx`. Anda dapat menyesuaikan ini dengan `esbuild.include` dan `esbuild.exclude`, yang dapat berupa regex, pola [picomatch](https://github.com/micromatch/picomatch#globbing-features), atau sebuah array dari keduanya.

Selain itu, Anda juga dapat menggunakan `esbuild.jsxInject` untuk secara otomatis menyisipkan impor helper JSX untuk setiap file yang diubah oleh esbuild:

```js
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
```

Ketika [`build.minify`](./build-options.md#build-minify) adalah `true`, semua optimisasi minify diterapkan secara default. Untuk menonaktifkan [aspek tertentu](https://esbuild.github.io/api/#minify) dari itu, set salah satu opsi `esbuild.minifyIdentifiers`, `esbuild.minifySyntax`, atau `esbuild.minifyWhitespace` menjadi `false`. Perhatikan bahwa opsi `esbuild.minify` tidak dapat digunakan untuk mengganti `build.minify`.

Setel menjadi `false` untuk menonaktifkan transformasi esbuild.

## assetsInclude

- **Tipe:** `string | RegExp | (string | RegExp)[]`
- **Terkait:** [Penanganan Aset Statis](/guide/assets)

Tentukan pola [picomatch tambahan](https://github.com/micromatch/picomatch#globbing-features) untuk dianggap sebagai aset statis sehingga:

- Mereka akan dikecualikan dari pipa transformasi plugin saat direferensikan dari HTML atau secara langsung diminta melalui `fetch` atau XHR.

- Mengimpor mereka dari JS akan mengembalikan string URL yang diresolusikan mereka (ini dapat ditimpa jika Anda memiliki plugin `enforce: 'pre'` untuk menangani jenis aset secara berbeda).

Daftar jenis aset bawaan dapat ditemukan [di sini](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts).

**Contoh:**

```js
export default defineConfig({
  assetsInclude: ['**/*.gltf'],
})
```

## logLevel

- **Tipe:** `'info' | 'warn' | 'error' | 'silent'`

Atur tingkat kecerewetan output konsol. Default adalah `'info'`.

## customLogger

- **Tipe:**
  ```ts
  interface Logger {
    info(msg: string, options?: LogOptions): void
    warn(msg: string, options?: LogOptions): void
    warnOnce(msg: string, options?: LogOptions): void
    error(msg: string, options?: LogErrorOptions): void
    clearScreen(type: LogType): void
    hasErrorLogged(error: Error | RollupError): boolean
    hasWarned: boolean
  }
  ```

Gunakan logger kustom untuk mencatat pesan. Anda dapat menggunakan API `createLogger` dari Vite untuk mendapatkan logger default dan menyesuaikannya, misalnya, mengubah pesan atau menyaring peringatan tertentu.

```js
import { createLogger, defineConfig } from 'vite'

const logger = createLogger()
const loggerWarn = logger.warn

logger.warn = (msg, options) => {
  // Mengabaikan peringatan file CSS kosong
  if (msg.includes('vite:css') && msg.includes(' is empty')) return
  loggerWarn(msg, options)
}

export default defineConfig({
  customLogger: logger,
})
```

## clearScreen

- **Tipe:** `boolean`
- **Default:** `true`

Setel menjadi `false` untuk mencegah Vite membersihkan layar terminal saat mencatat beberapa pesan tertentu. Melalui baris perintah, gunakan `--clearScreen false`.

## envDir

- **Tipe:** `string`
- **Default:** `root`

Direktori dari mana file `.env` dimuat. Dapat berupa path absolut, atau path relatif terhadap root proyek.

Lihat [di sini](/guide/env-and-mode#env-files) untuk informasi lebih lanjut tentang file lingkungan.

## envPrefix

- **Tipe:** `string | string[]`
- **Default:** `VITE_`

Variabel env yang dimulai dengan `envPrefix` akan dipaparkan ke kode sumber klien Anda melalui import.meta.env.

:::peringatan CATATAN KEAMANAN
`envPrefix` sebaiknya tidak diatur sebagai `''`, yang akan mengekspos semua variabel env Anda dan menyebabkan kebocoran informasi sensitif yang tidak terduga. Vite akan melemparkan error ketika mendeteksi `''`.

Jika Anda ingin mengekspos variabel tanpa awalan, Anda dapat menggunakan [define](#define) untuk mengeksposnya:

```js
define: {
  'import.meta.env.ENV_VARIABLE': JSON.stringify(process.env.ENV_VARIABLE)
}
```

:::

## appType

- **Tipe:** `'spa' | 'mpa' | 'custom'`
- **Default:** `'spa'`

Apakah aplikasi Anda adalah Single Page Application (SPA), [Multi Page Application (MPA)](../guide/build#multi-page-app), atau Custom Application (SSR dan kerangka kerja dengan penanganan HTML kustom):

- `'spa'`: sertakan middlewares HTML dan gunakan fallback SPA. Konfigurasikan [sirv](https://github.com/lukeed/sirv) dengan `single: true` dalam pratinjau
- `'mpa'`: sertakan middlewares HTML
- `'custom'`: jangan sertakan middlewares HTML

Pelajari lebih lanjut di [panduan SSR](/guide/ssr#vite-cli) Vite. Terkait: [`server.middlewareMode`](./server-options#server-middlewaremode).