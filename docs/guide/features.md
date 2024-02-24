# Fitur

Pada tingkat dasar, pengembangan menggunakan Vite tidak terlalu berbeda dari menggunakan server file statis. Namun, Vite menyediakan banyak peningkatan atas impor ESM asli untuk mendukung berbagai fitur yang biasanya ditemui dalam pengaturan berbasis bundler.

## Pencarian dan Pra-Bundling Dependensi NPM

Impor ESM asli tidak mendukung impor modul kosong seperti berikut:

```js
import { someMethod } from 'my-dep'
```

Di atas akan menyebabkan kesalahan di peramban. Vite akan mendeteksi impor modul kosong seperti ini dalam semua berkas sumber yang disajikan dan melakukan hal berikut:

1. [Meng-pra-bundle](./dep-pre-bundling) mereka untuk meningkatkan kecepatan pengambilan halaman dan mengonversi modul CommonJS / UMD menjadi ESM. Langkah pra-bundling dilakukan dengan [esbuild](http://esbuild.github.io/) dan membuat waktu mulai dingin Vite jauh lebih cepat daripada bundler berbasis JavaScript lainnya.

2. Menulis ulang impor menjadi URL yang valid seperti `/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd` sehingga peramban dapat mengimpornya dengan benar.

**Dependensi Dicache dengan Kuat**

Vite mencache permintaan dependensi melalui header HTTP, jadi jika Anda ingin mengedit/debug dependensi secara lokal, ikuti langkah-langkah [di sini](./dep-pre-bundling#browser-cache).

## Penggantian Modul Panas (Hot Module Replacement)

Vite menyediakan [API HMR](./api-hmr) di atas ESM asli. Framework dengan kemampuan HMR dapat memanfaatkan API ini untuk menyediakan pembaruan instan, tepat tanpa me-refresh halaman atau menghapus status aplikasi. Vite menyediakan integrasi HMR first-party untuk [Vue Single File Components](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) dan [React Fast Refresh](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react). Ada juga integrasi resmi untuk Preact melalui [@prefresh/vite](https://github.com/JoviDeCroock/prefresh/tree/main/packages/vite).

Perlu dicatat Anda tidak perlu mengatur ini secara manual - saat Anda [membuat aplikasi melalui `create-vite`](./), template yang dipilih sudah memiliki konfigurasi ini sebelumnya.

## TypeScript

Vite mendukung impor berkas `.ts` secara langsung.

### Transpile Saja

Perhatikan bahwa Vite hanya melakukan transpilasi pada berkas `.ts` dan **TIDAK** melakukan pengecekan tipe. Ini mengasumsikan pengecekan tipe diatur oleh IDE dan proses pembangunan Anda.

Alasan Vite tidak melakukan pengecekan tipe sebagai bagian dari proses transformasi adalah karena kedua pekerjaan tersebut bekerja secara fundamental berbeda. Transpilasi dapat bekerja pada basis per-berkas dan selaras dengan model kompilasi on-demand Vite. Dibandingkan dengan itu, pengecekan tipe memerlukan pengetahuan tentang seluruh grafik modul. Memasukkan pengecekan tipe ke dalam pipeline transformasi Vite akan mengorbankan manfaat kecepatan Vite.

Pekerjaan Vite adalah untuk membuat modul sumber Anda menjadi bentuk yang dapat berjalan di peramban sesegera mungkin. Untuk itu, kami menyarankan untuk memisahkan pemeriksaan analisis statis dari pipeline transformasi Vite. Prinsip ini berlaku untuk pemeriksaan analisis statis lainnya seperti ESLint.

- Untuk pembangunan produksi, Anda dapat menjalankan `tsc --noEmit` bersamaan dengan perintah pembangunan Vite.

- Selama pengembangan, jika Anda memerlukan lebih dari petunjuk IDE, kami menyarankan untuk menjalankan `tsc --noEmit --watch` dalam proses terpisah, atau gunakan [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) jika Anda lebih suka mendapatkan kesalahan tipe secara langsung dilaporkan di peramban.

Vite menggunakan [esbuild](https://github.com/evanw/esbuild) untuk mentranspilasi TypeScript menjadi JavaScript yang sekitar 20~30x lebih cepat dari `tsc` polos, dan pembaruan HMR dapat tercermin di peramban dalam waktu kurang dari 50ms.

Gunakan sintaks [Type-Only Imports and Export](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export) untuk menghindari masalah potensial seperti impor hanya-tipe yang salah-bundel, misalnya:

```ts
import type { T } from 'only/types'
export type { T }
```

### Opsi Kompilator TypeScript

Beberapa bidang konfigurasi di bawah `compilerOptions` dalam `tsconfig.json` memerlukan perhatian khusus.

#### `isolatedModules`

- [Dokumentasi TypeScript](https://www.typescriptlang.org/tsconfig#isolatedModules)

Harus diatur ke `true`.

Ini karena `esbuild` hanya melakukan transpilasi tanpa informasi tipe, tidak mendukung fitur tertentu seperti const enum dan impor hanya-tipe implisit.

Anda harus menetapkan `"isolatedModules": true` di `tsconfig.json` Anda di bawah `compilerOptions`, sehingga TS akan memperingatkan Anda terhadap fitur-fitur yang tidak berfungsi dengan transpilasi terisolasi.

Namun, beberapa pustaka (misalnya [`vue`](https://github.com/vuejs/core/issues/1228)) tidak berfungsi dengan baik dengan `"isolatedModules": true`. Anda dapat menggunakan `"skipLibCheck": true` untuk sementara menekan kesalahan sampai diperbaiki secara hulu.

#### `useDefineForClassFields`

- [Dokumentasi TypeScript](https://www.typescriptlang.org/tsconfig#useDefineForClassFields)

Mulai dari Vite 2.5.0, nilai defaultnya akan menjadi `true` jika target TypeScript adalah `ESNext` atau `ES2022` atau yang lebih baru. Ini konsisten dengan [perilaku `tsc` 4.3.2 dan setelahnya](https://github.com/microsoft/TypeScript/pull/42663). Ini juga perilaku runtime ECMAScript standar.

Target TypeScript lainnya akan default menjadi `false`.

Namun, ini mungkin tidak intuitif bagi mereka yang berasal dari bahasa pemrograman lain atau versi TypeScript yang lebih lama. Anda dapat membaca lebih lanjut tentang transisi ini di [catatan rilis TypeScript 3.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier).

Jika Anda menggunakan pustaka yang sangat bergantung pada bidang kelas, harap berhati-hati tentang penggunaan yang dimaksudkan pustaka tersebut.

Sebagian besar pustaka mengharapkan `"useDefineForClassFields": true`, seperti [MobX](https://mobx.js.org/installation.html#use-spec-compliant-transpilation-for-class-properties).

Tetapi beberapa pustaka belum beralih ke nilai default baru ini, termasuk [`lit-element`](https://github.com/lit/lit-element/issues/1030). Harap tetapkan `useDefineForClassFields` secara eksplisit ke `false` dalam kasus-kasus ini.

#### `target`

- [Dokumentasi TypeScript](https://www.typescriptlang.org/tsconfig#target)

Vite tidak mentranspilasi TypeScript dengan nilai `target` yang dikonfigurasi secara default, mengikuti perilaku yang sama dengan `esbuild`.

Opsi [`esbuild.target`](/config/shared-options.html#esbuild) dapat digunakan sebagai gantinya, yang defaultnya adalah `esnext` untuk transpilasi minimal. Dalam pembangunan, opsi [`build.target`](/config/build-options.html#build-target) memiliki prioritas yang lebih tinggi dan juga dapat diatur jika diperlukan.

::: peringatan `useDefineForClassFields`
Jika `target` bukan `ESNext` atau `ES2022` atau yang lebih baru, atau jika tidak ada berkas `tsconfig.json`, `useDefineForClassFields` akan default menjadi `false` yang dapat bermasalah dengan nilai default `esbuild.target` dari `esnext`. Ini dapat mentranspilasi ke [blok inisialisasi statis](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility) yang mungkin tidak didukung di peramban Anda.

Oleh karena itu, disarankan untuk mengatur `target` ke `ESNext` atau `ES2022` atau yang lebih baru, atau tetapkan `useDefineForClassFields` ke `true` secara eksplisit saat mengonfigurasi `tsconfig.json`.
:::

### Opsi Compiler Lain yang Mempengaruhi Hasil Pembangunan

- [`extends`](https://www.typescriptlang.org/tsconfig#extends)
- [`importsNotUsedAsValues`](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues)
- [`preserveValueImports`](https://www.typescriptlang.org/tsconfig#preserveValueImports)
- [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax)
- [`jsx`](https://www.typescriptlang.org/tsconfig#jsx)
- [`jsxFactory`](https://www.typescriptlang.org/tsconfig#jsxFactory)
- [`jsxFragmentFactory`](https://www.typescriptlang.org/tsconfig#jsxFragmentFactory)
- [`jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource)
- [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators)
- [`alwaysStrict`](https://www.typescriptlang.org/tsconfig#alwaysStrict)

::: tip `skipLibCheck`
Template awal Vite memiliki `"skipLibCheck": "true"` secara default untuk menghindari pengecekan tipe pada dependensi, karena mereka mungkin memilih untuk hanya mendukung versi dan konfigurasi TypeScript tertentu. Anda dapat mempelajari lebih lanjut di [vuejs/vue-cli#5688](https://github.com/vuejs/vue-cli/pull/5688).
:::

### Tipe Klien

Tipe default Vite adalah untuk API Node.js-nya. Untuk meniru lingkungan kode sisi klien dalam aplikasi Vite, tambahkan sebuah berkas deklarasi `d.ts`:

```typescript
/// <reference types="vite/client" />
```

Sebagai alternatif, Anda dapat menambahkan `vite/client` ke `compilerOptions.types` di dalam `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

Ini akan memberikan peniruan tipe berikut:

- Impor aset (misalnya, mengimpor berkas `.svg`)
- Tipe untuk [variabel env](./env-and-mode#env-variables) yang disuntikkan Vite pada `import.meta.env`
- Tipe untuk [API HMR](./api-hmr) pada `import.meta.hot`

::: tip
Untuk mengganti pengetikan default, tambahkan sebuah berkas definisi tipe yang berisi pengetikan Anda. Kemudian, tambahkan referensi tipe sebelum `vite/client`.

Misalnya, untuk membuat impor default dari `*.svg` menjadi komponen React:

- `vite-env-override.d.ts` (berkas yang berisi pengetikan Anda):
  ```ts
  declare module '*.svg' {
    const content: React.FC<React.SVGProps<SVGElement>>
    export default content
  }
  ```
- Berkas yang berisi referensi ke `vite/client`:
  ```ts
  /// <reference types="./vite-env-override.d.ts" />
  /// <reference types="vite/client" />
  ```

:::

## Vue

Vite menyediakan dukungan Vue kelas satu:

- Dukungan Vue 3 SFC melalui [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)
- Dukungan Vue 3 JSX melalui [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)
- Dukungan Vue 2.7 melalui [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)
- Dukungan Vue <2.7 melalui [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2)

## JSX

Berkas `.jsx` dan `.tsx` juga didukung secara langsung. Transpilasi JSX juga ditangani melalui [esbuild](https://esbuild.github.io).

Pengguna Vue harus menggunakan plugin [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) resmi, yang menyediakan fitur khusus Vue 3 termasuk HMR, penyelesaian komponen global, direktif, dan slot.

Jika tidak menggunakan JSX dengan React atau Vue, `jsxFactory` dan `jsxFragment` kustom dapat dikonfigurasi menggunakan [opsi `esbuild`](/config/shared-options.md#esbuild). Misalnya untuk Preact:

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
```

Lebih banyak detail di [dokumentasi esbuild](https://esbuild.github.io/content-types/#jsx).

Anda dapat menyuntikkan pembantu JSX menggunakan `jsxInject` (yang merupakan opsi khusus Vite) untuk menghindari impor manual:

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
```

## CSS

Mengimpor berkas `.css` akan menyuntikkan kontennya ke halaman melalui tag `<style>` dengan dukungan HMR.

### `@import` Inline dan Rebasing

Vite telah dikonfigurasi sebelumnya untuk mendukung `@import` CSS dengan cara menyisipkannya melalui `postcss-import`. Aliases Vite juga dihormati untuk `@import` CSS. Selain itu, semua referensi `url()` CSS, bahkan jika berkas yang diimpor berada di direktori yang berbeda, selalu secara otomatis di-rebase untuk memastikan kebenaran.

`@import` alias dan rebasing URL juga didukung untuk berkas Sass dan Less (lihat [Pre-pemrosesan CSS](#css-pre-pemrosesan)).

### PostCSS

Jika proyek ini berisi konfigurasi PostCSS yang valid (format yang didukung oleh [postcss-load-config](https://github.com/postcss/postcss-load-config), misalnya `postcss.config.js`), itu akan secara otomatis diterapkan pada semua CSS yang diimpor.

Perhatikan bahwa minimasi CSS akan berjalan setelah PostCSS dan akan menggunakan opsi [`build.cssTarget`](/config/build-options.md#build-csstarget).

### Modul CSS

Setiap berkas CSS yang diakhiri dengan `.module.css` dianggap sebagai [berkas modul CSS](https://github.com/css-modules/css-modules). Mengimpor berkas tersebut akan mengembalikan objek modul yang sesuai:

```css
/* example.module.css */
.red {
  color: red;
}
```

```js
import classes from './example.module.css'
document.getElementById('foo').className = classes.red
```

Perilaku modul CSS dapat dikonfigurasi melalui [opsi `css.modules`](/config/shared-options.md#css-modules).

Jika `css.modules.localsConvention` diatur untuk mengaktifkan lokal camelCase (misalnya, `localsConvention: 'camelCaseOnly'`), Anda juga dapat menggunakan impor bernama:

```js
// .apply-color -> applyColor
import { applyColor } from './example.module.css'
document.getElementById('foo').className = applyColor
```

### Prapemrosesan CSS

Karena Vite hanya menyasar browser modern, disarankan untuk menggunakan variabel CSS asli dengan plugin PostCSS yang mengimplementasikan draf CSSWG (misalnya [postcss-nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting)) dan menulis CSS yang sederhana, sesuai dengan standar masa depan.

Meskipun begitu, Vite menyediakan dukungan bawaan untuk berkas `.scss`, `.sass`, `.less`, `.styl`, dan `.stylus`. Tidak perlu menginstal plugin khusus Vite untuk mereka, tetapi praprosesor yang sesuai harus diinstal:

```bash
# .scss dan .sass
npm add -D sass

# .less
npm add -D less

# .styl dan .stylus
npm add -D stylus
```

Jika menggunakan komponen berkas tunggal Vue, ini juga secara otomatis mengaktifkan `<style lang="sass">` dan sebagainya.

Vite meningkatkan resolusi `@import` untuk Sass dan Less sehingga alias Vite juga dihormati. Selain itu, referensi `url()` relatif di dalam berkas Sass/Less yang diimpor yang berada di direktori yang berbeda dari berkas root juga secara otomatis direbas untuk memastikan kebenaran.

`@import` alias dan url rebasing tidak didukung untuk Stylus karena batasan API-nya.

Anda juga dapat menggunakan modul CSS yang dikombinasikan dengan praprosesor dengan menambahkan `.module` ke ekstensi berkas, misalnya `style.module.scss`.

### Menonaktifkan Penyisipan CSS ke dalam Halaman

Penyisipan otomatis konten CSS dapat dimatikan melalui parameter kueri `?inline`. Dalam hal ini, string CSS yang diproses dikembalikan sebagai ekspor default modul seperti biasa, tetapi gaya tidak disisipkan ke dalam halaman.

```js
import styles from './foo.css' // akan disisipkan ke dalam halaman
import otherStyles from './bar.css?inline' // tidak akan disisipkan
```

::: tip CATATAN
Impor default dan bernama dari berkas CSS (mis., `import style from './foo.css'`) dihapus sejak Vite 5. Gunakan kueri `?inline` sebagai gantinya.
:::

### CSS Lightning

Mulai dari Vite 4.4, ada dukungan eksperimental untuk [Lightning CSS](https://lightningcss.dev/). Anda dapat memilihnya dengan menambahkan [`css.transformer: 'lightningcss'`](../config/shared-options.md#css-transformer) ke file konfigurasi Anda dan menginstal dependensi opsional [`lightningcss`](https://www.npmjs.com/package/lightningcss):

```bash
npm add -D lightningcss
```

Jika diaktifkan, berkas CSS akan diproses oleh Lightning CSS daripada PostCSS. Untuk mengonfigurasinya, Anda dapat meneruskan opsi Lightning CSS ke opsi konfigurasi [`css.lightningcss`](../config/shared-options.md#css-lightningcss).

Untuk mengonfigurasi Modul CSS, Anda akan menggunakan [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) sebagai gantinya [`css.modules`](../config/shared-options.md#css-modules) (yang mengonfigurasi cara PostCSS menangani Modul CSS).

Secara default, Vite menggunakan esbuild untuk meminimalkan CSS. Lightning CSS juga dapat digunakan sebagai pengurang CSS dengan [`build.cssMinify: 'lightningcss'`](../config/build-options.md#build-cssminify).

::: tip CATATAN
[Praprosesor CSS](#css-pre-prosesor) tidak didukung saat menggunakan Lightning CSS.
:::

## Aset Statis

Mengimpor sebuah aset statis akan mengembalikan URL publik yang diselesaikan saat disajikan:

```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

Kueri khusus dapat memodifikasi bagaimana aset dimuat:

```js
// Memuat aset secara eksplisit sebagai URL
import assetAsURL from './asset.js?url'
```

```js
// Memuat aset sebagai string
import assetAsString from './shader.glsl?raw'
```

```js
// Memuat Web Workers
import Worker from './worker.js?worker'
```

```js
// Web Worker di dalamkan sebagai string base64 pada waktu pembangunan
import InlineWorker from './worker.js?worker&inline'
```

Lebih banyak detail di [Penanganan Aset Statis](./assets).

## JSON

Berkas JSON dapat diimpor langsung - impor bernama juga didukung:

```js
// impor seluruh objek
import json from './example.json'
// impor bidang root sebagai ekspor bernama - membantu dengan pohon shake!
import { field } from './example.json'
```

## Impor Glob

Vite mendukung impor beberapa modul dari sistem berkas melalui fungsi khusus `import.meta.glob`:

```js
const modules = import.meta.glob('./dir/*.js')
```

Di atas akan diubah menjadi:

```js
// kode yang dihasilkan oleh vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js'),
}
```

Anda kemudian dapat mengulanginya untuk kunci objek `modules` untuk mengakses modul yang sesuai:

```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

Berkas yang cocok secara default dimuat secara malas melalui impor dinamis dan akan dibagi menjadi potongan terpisah selama pembangunan. Jika Anda lebih suka mengimpor semua modul langsung (misalnya mengandalkan efek samping dalam modul ini untuk diterapkan terlebih dahulu), Anda dapat melewatkan `{ eager: true }` sebagai argumen kedua:

```js
const modules = import.meta.glob('./dir/*.js', { eager: true })
```

Di atas akan diubah menjadi:

```js
// kode yang dihasilkan oleh vite
import * as __glob__0_0 from './dir/foo.js'
import * as __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}
```

### Pola Ganda

Argumen pertama dapat berupa array glob, misalnya

```js
const modules = import.meta.glob(['./dir/*.js', './another/*.js'])
```

### Pola Negatif

Pola glob negatif juga didukung (diawali dengan `!`). Untuk mengabaikan beberapa berkas dari hasil, Anda dapat menambahkan pola glob pengecualian ke argumen pertama:

```js
const modules = import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

```js
// kode yang dihasilkan oleh vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
}
```

#### Impor Bernama

Mungkin untuk hanya mengimpor bagian dari modul dengan opsi `import`.

```ts
const modules = import.meta.glob('./dir/*.js', { import: 'setup' })
```

```ts
// kode yang dihasilkan oleh vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js').then((m) => m.setup),
  './dir/bar.js': () => import('./dir/bar.js').then((m) => m.setup),
}
```

Ketika digabungkan dengan `eager`, bahkan mungkin untuk mengaktifkan tree-shaking untuk modul-modul itu.

```ts
const modules = import.meta.glob('./dir/*.js', {
  import: 'setup',
  eager: true,
})
```

```ts
// kode yang dihasilkan oleh vite:
import { setup as __glob__0_0 } from './dir/foo.js'
import { setup as __glob__0_1 } from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}
```

Atur `import` menjadi `default` untuk mengimpor ekspor default.

```ts
const modules = import.meta.glob('./dir/*.js', {
  import: 'default',
  eager: true,
})
```

```ts
// kode yang dihasilkan oleh vite:
import __glob__0_0 from './dir/foo.js'
import __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}
```

## Kueri Kustom

Anda juga dapat menggunakan opsi `query` untuk menyediakan kueri ke impor, misalnya, untuk mengimpor aset [sebagai string](https://vitejs.dev/guide/assets.html#importing-asset-as-string) atau [sebagai url](https://vitejs.dev/guide/assets.html#importing-asset-as-url):

```ts
const moduleStrings = import.meta.glob('./dir/*.svg', {
  query: '?raw',
  import: 'default',
})
const moduleUrls = import.meta.glob('./dir/*.svg', {
  query: '?url',
  import: 'default',
})
```

```ts
// kode yang dihasilkan oleh vite:
const moduleStrings = {
  './dir/foo.svg': () => import('./dir/foo.js?raw').then((m) => m['default']),
  './dir/bar.svg': () => import('./dir/bar.js?raw').then((m) => m['default']),
}
const moduleUrls = {
  './dir/foo.svg': () => import('./dir/foo.js?url').then((m) => m['default']),
  './dir/bar.svg': () => import('./dir/bar.js?url').then((m) => m['default']),
}
```

Anda juga dapat menyediakan kueri kustom untuk plugin lainnya untuk dikonsumsi:

```ts
const modules = import.meta.glob('./dir/*.js', {
  query: { foo: 'bar', bar: true },
})
```

### Catatan Impor Glob

Perhatikan bahwa:

- Ini adalah fitur hanya untuk Vite dan bukan standar web atau ES.
- Pola glob diperlakukan seperti spesifikasi impor: mereka harus relatif (dimulai dengan `./`) atau absolut (dimulai dengan `/`, dipecahkan relatif terhadap akar proyek) atau jalur alias (lihat opsi [`resolve.alias`](/config/shared-options.md#resolve-alias)).
- Pencocokan glob dilakukan melalui [`fast-glob`](https://github.com/mrmlnc/fast-glob) - lihat dokumentasinya untuk [pola glob yang didukung](https://github.com/mrmlnc/fast-glob#pattern-syntax).
- Anda juga harus menyadari bahwa semua argumen dalam `import.meta.glob` harus **dilewatkan sebagai literal**. Anda TIDAK bisa menggunakan variabel atau ekspresi di dalamnya.

## Impor Dinamis

Sama seperti [impor glob](#glob-import), Vite juga mendukung impor dinamis dengan variabel.

```ts
const module = await import(`./dir/${file}.js`)
```

Perhatikan bahwa variabel hanya mewakili nama berkas satu tingkat kedalaman. Jika `file` adalah `'foo/bar'`, impor akan gagal. Untuk penggunaan yang lebih canggih, Anda dapat menggunakan fitur [impor glob](#glob-import).

## WebAssembly

Berkas `.wasm` yang telah dikompilasi sebelumnya dapat diimpor dengan `?init`.
Ekspor default akan menjadi fungsi inisialisasi yang mengembalikan Promise dari [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Instance):

```js
import init from './example.wasm?init'

init().then((instance) => {
  instance.exports.test()
})
```

Fungsi init juga dapat mengambil importObject yang diteruskan ke [`WebAssembly.instantiate`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate) sebagai argumen keduanya:

```js
init({
  imports: {
    someFunc: () => {
      /* ... */
    },
  },
}).then(() => {
  /* ... */
})
```

Pada pembangunan produksi, berkas `.wasm` yang lebih kecil dari `assetInlineLimit` akan diinlining sebagai string base64. Jika tidak, mereka akan diperlakukan sebagai [aset statis](./assets) dan diambil secara on-demand.

::: tip CATATAN
[Proposal Integrasi Modul ES untuk WebAssembly](https://github.com/WebAssembly/esm-integration) saat ini tidak didukung.
Gunakan [`vite-plugin-wasm`](https://github.com/Menci/vite-plugin-wasm) atau plugin komunitas lainnya untuk menangani ini.
:::

### Mengakses Modul WebAssembly

Jika Anda memerlukan akses ke objek `Module`, misalnya untuk menginisialisasinya beberapa kali, gunakan [impor URL eksplisit](./assets#explicit-url-imports) untuk menyelesaikan aset, dan kemudian lakukan inisialisasi:

```js
import wasmUrl from 'foo.wasm?url'

const main = async () => {
  const responsePromise = fetch(wasmUrl)
  const { module, instance } =
    await WebAssembly.instantiateStreaming(responsePromise)
  /* ... */
}

main()
```

### Mengambil modul di Node.js

Dalam SSR, `fetch()` yang terjadi sebagai bagian dari impor `?init`, mungkin gagal dengan `TypeError: Invalid URL`.
Lihat masalah [Dukungan wasm di SSR](https://github.com/vitejs/vite/issues/8882).

Berikut adalah alternatifnya, dengan asumsi dasar proyek adalah direktori saat ini:

```js
import wasmUrl from 'foo.wasm?url'
import { readFile } from 'node:fs/promises'

const main = async () => {
  const resolvedUrl = (await import('./test/boot.test.wasm?url')).default
  const buffer = await readFile('.' + resolvedUrl)
  const { instance } = await WebAssembly.instantiate(buffer, {
    /* ... */
  })
  /* ... */
}

main()
```

## Web Workers

### Impor dengan Konstruktor

Script pekerja web dapat diimpor menggunakan [`new Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) dan [`new SharedWorker()`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker/SharedWorker). Dibandingkan dengan akhiran pekerja, sintaks ini lebih mendekati standar dan merupakan cara yang **direkomendasikan** untuk membuat pekerja.

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url))
```

Konstruktor pekerja juga menerima opsi, yang dapat digunakan untuk membuat pekerja "modul":

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
})
```

Deteksi pekerja hanya akan berfungsi jika konstruktor `new URL()` digunakan langsung di dalam deklarasi `new Worker()`. Selain itu, semua parameter opsi harus berupa nilai statis (yaitu string literal).

### Impor dengan Sufiks Query

Script pekerja web dapat diimpor langsung dengan menambahkan `?worker` atau `?sharedworker` ke permintaan impor. Ekspor default akan menjadi konstruktor pekerja kustom:

```js
import MyWorker from './worker?worker'

const worker = new MyWorker()
```

Script pekerja juga dapat menggunakan pernyataan `import` ESM daripada `importScripts()`. **Catatan**: Selama pengembangan ini bergantung pada [dukungan asli browser](https://caniuse.com/?search=module%20worker), namun untuk build produksi akan dikompilasi.

Secara default, script pekerja akan dihasilkan sebagai chunk terpisah dalam build produksi. Jika Anda ingin menyisipkan pekerja sebagai string base64, tambahkan query `inline`:

```js
import MyWorker from './worker?worker&inline'
```

Jika Anda ingin mengambil pekerja sebagai URL, tambahkan query `url`:

```js
import MyWorker from './worker?worker&url'
```

Lihat [Opsi Pekerja](/config/worker-options.md) untuk detail tentang mengkonfigurasi bundling semua pekerja.

## Optimisasi Pembangunan

> Fitur yang tercantum di bawah ini secara otomatis diterapkan sebagai bagian dari proses pembangunan dan tidak perlu dikonfigurasi secara eksplisit kecuali jika Anda ingin menonaktifkannya.

### Pemisahan Kode CSS

Vite secara otomatis mengekstrak CSS yang digunakan oleh modul dalam chunk async dan menghasilkan file terpisah untuknya. File CSS secara otomatis dimuat melalui tag `<link>` ketika chunk async terkait dimuat, dan chunk async dijamin hanya dievaluasi setelah CSS dimuat untuk menghindari [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content#:~:text=A%20flash%20of%20unstyled%20content,before%20all%20information%20is%20retrieved.).

Jika Anda lebih suka memiliki semua CSS diekstrak ke dalam satu file, Anda dapat menonaktifkan pemisahan kode CSS dengan mengatur [`build.cssCodeSplit`](/config/build-options.md#build-csscodesplit) menjadi `false`.

### Pembangkitan Direktif Preload

Vite secara otomatis menghasilkan direktif `<link rel="modulepreload">` untuk chunk entri dan impor langsung mereka dalam HTML yang dibangun.

### Optimisasi Pemuatan Chunk Async

Dalam aplikasi dunia nyata, Rollup sering kali menghasilkan "chunk umum" - kode yang dibagikan antara dua atau lebih chunk lainnya. Digabungkan dengan impor dinamis, sangat umum untuk memiliki skenario berikut:

```html
<script setup>
import graphSvg from '../images/graph.svg?raw'
</script>
<svg-image :svg="graphSvg" />
```

Dalam skenario yang tidak dioptimalkan, ketika chunk async `A` diimpor, browser harus meminta dan menguraikan `A` sebelum dapat memahami bahwa ia juga membutuhkan chunk umum `C`. Hal ini mengakibatkan satu putaran tambahan jaringan:

```
Entri ---> A ---> C
```

Vite secara otomatis menulis ulang panggilan impor dinamis pembagi kode dengan langkah preload sehingga ketika `A` diminta, `C` diambil **secara paralel**:

```
Entri ---> (A + C)
```

Mungkin bagi `C` untuk memiliki impor lebih lanjut, yang akan menghasilkan lebih banyak putaran tambahan dalam skenario yang tidak dioptimalkan. Optimasi Vite akan melacak semua impor langsung untuk sepenuhnya menghilangkan putaran tambahan tanpa memperdulikan kedalaman impor.
