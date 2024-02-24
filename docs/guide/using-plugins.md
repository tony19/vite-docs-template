# Menggunakan Plugin

Vite dapat diperluas menggunakan plugin, yang didasarkan pada antarmuka plugin Rollup yang dirancang dengan baik dengan beberapa opsi khusus Vite tambahan. Hal ini berarti pengguna Vite dapat mengandalkan ekosistem matang plugin Rollup, sambil juga dapat memperluas fungsionalitas server pengembangan dan SSR sesuai kebutuhan.

## Menambahkan Sebuah Plugin

Untuk menggunakan sebuah plugin, plugin tersebut perlu ditambahkan ke `devDependencies` dari proyek dan disertakan dalam array `plugins` dalam file konfigurasi `vite.config.js`. Sebagai contoh, untuk memberikan dukungan untuk browser legacy, plugin resmi [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) dapat digunakan:

```
$ npm add -D @vitejs/plugin-legacy
```

```js
// vite.config.js
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```

`plugins` juga menerima preset termasuk beberapa plugin sebagai satu elemen tunggal. Ini berguna untuk fitur kompleks (seperti integrasi kerangka kerja) yang diimplementasikan menggunakan beberapa plugin. Array tersebut akan di-flatten secara internal.

Plugin yang falsy akan diabaikan, yang dapat digunakan untuk dengan mudah mengaktifkan atau menonaktifkan plugin.

## Menemukan Plugin

:::tip CATATAN
Vite bertujuan untuk menyediakan dukungan out-of-the-box untuk pola pengembangan web umum. Sebelum mencari plugin Vite atau plugin Rollup yang kompatibel, periksa [Panduan Fitur](../guide/features.md). Banyak kasus di mana sebuah plugin akan dibutuhkan dalam proyek Rollup sudah tercakup dalam Vite.
:::

Periksa bagian [Plugins](../plugins/) untuk informasi tentang plugin resmi. Plugin komunitas terdaftar di [awesome-vite](https://github.com/vitejs/awesome-vite#plugins). Untuk plugin Rollup yang kompatibel, periksa [Vite Rollup Plugins](https://vite-rollup-plugins.patak.dev) untuk daftar plugin resmi Rollup yang kompatibel dengan instruksi penggunaan atau [Bagian Kompatibilitas Plugin Rollup](../guide/api-plugin#rollup-plugin-compatibility) jika tidak terdaftar di sana.

Anda juga dapat menemukan plugin yang mengikuti [konvensi yang direkomendasikan](./api-plugin.md#conventions) menggunakan [pencarian npm untuk vite-plugin](https://www.npmjs.com/search?q=vite-plugin&ranking=popularity) untuk plugin Vite atau [pencarian npm untuk rollup-plugin](https://www.npmjs.com/search?q=rollup-plugin&ranking=popularity) untuk plugin Rollup.

## Memaksa Urutan Plugin

Untuk kompatibilitas dengan beberapa plugin Rollup, mungkin diperlukan untuk memaksa urutan plugin atau hanya menerapkan pada waktu pembangunan. Hal ini seharusnya menjadi detail implementasi untuk plugin Vite. Anda dapat memaksa posisi sebuah plugin dengan modifikasi `enforce`:

- `pre`: memanggil plugin sebelum plugin inti Vite
- default: memanggil plugin setelah plugin inti Vite
- `post`: memanggil plugin setelah plugin pembangunan Vite

```js
// vite.config.js
import image from '@rollup/plugin-image'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...image(),
      enforce: 'pre',
    },
  ],
})
```

Periksa [Panduan API Plugin](./api-plugin.md#plugin-ordering) untuk informasi detail, dan perhatikan label `enforce` dan instruksi penggunaan untuk plugin populer dalam daftar kompatibilitas [Vite Rollup Plugins](https://vite-rollup-plugins.patak.dev).

## Aplikasi Kondisional

Secara default, plugin dipanggil baik untuk serve maupun build. Dalam kasus di mana sebuah plugin perlu diterapkan secara kondisional hanya selama serve atau build, gunakan properti `apply` untuk hanya memanggil mereka selama `'build'` atau `'serve'`:

```js
// vite.config.js
import typescript2 from 'rollup-plugin-typescript2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...typescript2(),
      apply: 'build',
    },
  ],
})
```

## Membangun Plugin

Periksa [Panduan API Plugin](./api-plugin.md) untuk dokumentasi tentang membuat plugin.
