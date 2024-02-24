# Pre-Bundling Dependency

Ketika Anda pertama kali menjalankan `vite`, Vite akan melakukan prebundling dependensi proyek Anda sebelum memuat situs Anda secara lokal. Ini dilakukan secara otomatis dan transparan secara default.

## Mengapa

Ini adalah Vite melakukan apa yang kami sebut "dependency pre-bundling" atau prebundling dependensi. Proses ini memiliki dua tujuan:

1. **Kompatibilitas CommonJS dan UMD:** Selama pengembangan, server pengembangan Vite melayani semua kode sebagai native ESM. Oleh karena itu, Vite harus mengonversi dependensi yang dikirim sebagai CommonJS atau UMD menjadi ESM terlebih dahulu.

   Saat mengonversi dependensi CommonJS, Vite melakukan analisis impor pintar sehingga impor bernama ke modul CommonJS akan berfungsi seperti yang diharapkan bahkan jika ekspornya ditugaskan secara dinamis (mis. React):

   ```js
   // bekerja seperti yang diharapkan
   import React, { useState } from 'react'
   ```

2. **Kinerja:** Vite mengonversi dependensi ESM dengan banyak modul internal menjadi satu modul untuk meningkatkan kinerja muat halaman selanjutnya.

   Beberapa paket mengirimkan build modul ES mereka sebagai banyak file terpisah yang mengimpor satu sama lain. Misalnya, [`lodash-es` memiliki lebih dari 600 modul internal](https://unpkg.com/browse/lodash-es/)! Ketika kita melakukan `import { debounce } from 'lodash-es'`, browser memulai 600+ permintaan HTTP secara bersamaan! Meskipun server tidak memiliki masalah menanganinya, jumlah permintaan yang besar membuat kepadatan jaringan di sisi browser, menyebabkan halaman memuat lebih lambat secara nyata.

   Dengan melakukan pre-bundling `lodash-es` menjadi satu modul, sekarang kita hanya perlu satu permintaan HTTP saja!

::: tip CATATAN
Prebundling dependensi hanya berlaku dalam mode pengembangan, dan menggunakan `esbuild` untuk mengonversi dependensi menjadi ESM. Dalam pembangunan produksi, digunakan `@rollup/plugin-commonjs` sebagai gantinya.
:::

## Penemuan Dependensi Otomatis

Jika cache yang ada tidak ditemukan, Vite akan menjelajahi kode sumber Anda secara otomatis dan menemukan impor dependensi (yaitu "bare imports" yang diharapkan untuk diselesaikan dari `node_modules`) dan menggunakan impor yang ditemukan ini sebagai titik masuk untuk pre-bundle. Pre-bundling dilakukan dengan `esbuild` sehingga biasanya sangat cepat.

Setelah server telah dimulai, jika impor dependensi baru ditemukan yang belum ada dalam cache, Vite akan menjalankan kembali proses bundling dependensi dan me-refresh halaman jika diperlukan.

## Monorepo dan Dependensi Terhubung

Dalam setup monorepo, sebuah dependensi mungkin merupakan paket terhubung dari repositori yang sama. Vite secara otomatis mendeteksi dependensi yang tidak diselesaikan dari `node_modules` dan memperlakukan dependensi terhubung sebagai kode sumber. Ini tidak akan mencoba untuk mem-bundle dependensi terhubung, dan akan menganalisis daftar dependensi dependensi terhubung tersebut.

Namun, ini membutuhkan dependensi terhubung untuk diekspor sebagai ESM. Jika tidak, Anda dapat menambahkan dependensi tersebut ke dalam [`optimizeDeps.include`](/config/dep-optimization-options.md#optimizedeps-include) dan [`build.commonjsOptions.include`](/config/build-options.md#build-commonjsoptions) dalam konfigurasi Anda.

```js
export default defineConfig({
  optimizeDeps: {
    include: ['linked-dep'],
  },
  build: {
    commonjsOptions: {
      include: [/linked-dep/, /node_modules/],
    },
  },
})
```

Ketika melakukan perubahan pada dependensi terhubung, mulai ulang server pengembangan dengan opsi baris perintah `--force` agar perubahan tersebut berlaku.

## Menyesuaikan Perilaku

Heuristik penemuan dependensi default mungkin tidak selalu diinginkan. Pada kasus di mana Anda ingin secara eksplisit menyertakan/mengesampingkan dependensi dari daftar, gunakan opsi konfigurasi [`optimizeDeps`](/config/dep-optimization-options.md).

Sebuah contoh penggunaan tipikal untuk `optimizeDeps.include` atau `optimizeDeps.exclude` adalah ketika Anda memiliki impor yang tidak langsung dapat ditemukan dalam kode sumber. Misalnya, mungkin impor tersebut dibuat sebagai hasil dari transformasi plugin. Ini berarti Vite tidak akan dapat menemukan impor tersebut pada pemindaian awal - hanya bisa menemukannya setelah file diminta oleh browser dan ditransformasikan. Hal ini akan menyebabkan server segera melakukan re-bundel setelah memulai server.

Baik `include` maupun `exclude` dapat digunakan untuk menangani hal ini. Jika dependensinya besar (dengan banyak modul internal) atau merupakan CommonJS, maka Anda harus menyertakannya; Jika dependensinya kecil dan sudah ESM yang valid, Anda bisa mengesampingkannya dan membiarkan browser memuatnya langsung.

Anda juga dapat menyesuaikan esbuild lebih lanjut dengan opsi [`optimizeDeps.esbuildOptions`](/config/dep-optimization-options.md#optimizedeps-esbuildoptions). Misalnya, menambahkan plugin esbuild untuk menangani file khusus dalam dependensi atau mengubah [build `target`](https://esbuild.github.io/api/#target).

## Penyimpanan Cache

### Cache Sistem File

Vite menyimpan dependensi yang telah di-bundel sebelumnya di `node_modules/.vite`. Hal ini menentukan apakah perlu untuk menjalankan kembali langkah pre-bundling berdasarkan beberapa sumber:

- Konten file kunci pengunci manajer paket, misalnya `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, atau `bun.lockb`.
- Waktu modifikasi folder patch.
- Bidang yang relevan dalam `vite.config.js` Anda, jika ada.
- Nilai `NODE_ENV`.

Langkah pre-bundling hanya perlu dijalankan kembali ketika salah satu di atas telah berubah.

Jika dengan beberapa alasan Anda ingin memaksa Vite untuk kembali mem-bundel dependensi, Anda dapat memulai server dev dengan opsi baris perintah `--force`, atau secara manual menghapus direktori cache `node_modules/.vite`.

### Cache Browser

Permintaan dependensi yang telah diselesaikan dicache dengan kuat menggunakan header HTTP `max-age=31536000,immutable` untuk meningkatkan kinerja reload halaman selama pengembangan. Setelah dicache, permintaan ini tidak akan pernah mengenai server dev lagi. Mereka otomatis tidak valid dengan menambahkan kueri versi jika versi yang berbeda diinstal (seperti yang tercermin dalam file kunci pengunci manajer paket Anda). Jika Anda ingin mendepan dependensi Anda dengan membuat edit lokal, Anda dapat:

1. Sementara menonaktifkan cache melalui tab Jaringan di alat pengembangan browser Anda;
2. Memulai ulang server dev Vite dengan flag `--force` untuk mem-bundel ulang dependensi;
3. Muat ulang halaman.