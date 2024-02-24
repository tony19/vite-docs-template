---
title: Vite 3.0 is out!
author:
  name: The Vite Team
date: 2022-07-23
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 3
  - - meta
    - property: og:image
      content: https://vitejs.dev/og-image-announcing-vite3.png
  - - meta
    - property: og:url
      content: https://vitejs.dev/blog/announcing-vite3
  - - meta
    - property: og:description
      content: Vite 3 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 3.0 Telah Dirilis!

_23 Juli 2022_ - Lihat [pengumuman Vite 4.0](./announcing-vite4.md)

Pada bulan Februari tahun lalu, [Evan You](https://twitter.com/youyuxi) merilis Vite 2. Sejak saat itu, adopsinya terus meningkat, mencapai lebih dari 1 juta unduhan npm per minggu. Sebuah ekosistem yang luas dengan cepat terbentuk setelah rilis tersebut. Vite mendorong perlombaan inovasi yang baru dalam kerangka kerja Web. [Nuxt 3](https://v3.nuxtjs.org/) menggunakan Vite secara default. [SvelteKit](https://kit.svelte.dev/), [Astro](https://astro.build/), [Hydrogen](https://hydrogen.shopify.dev/), dan [SolidStart](https://docs.solidjs.com/start) semuanya dibangun dengan Vite. [Laravel sekarang memutuskan untuk menggunakan Vite secara default](https://laravel.com/docs/9.x/vite). [Vite Ruby](https://vite-ruby.netlify.app/) menunjukkan bagaimana Vite dapat meningkatkan Rails DX. [Vitest](https://vitest.dev) membuat kemajuan sebagai alternatif asli Vite untuk Jest. Vite berada di balik fitur Pengujian Komponen baru [Cypress](https://docs.cypress.io/guides/component-testing/writing-your-first-component-test) dan [Playwright](https://playwright.dev/docs/test-components), Storybook memiliki [Vite sebagai pembangun resmi](https://github.com/storybookjs/builder-vite). Dan [daftar ini terus berlanjut](https://patak.dev/vite/ecosystem.html). Para pengelola dari sebagian besar proyek-proyek ini terlibat dalam meningkatkan inti Vite itu sendiri, bekerja sama dengan [tim](https://vitejs.dev/team) Vite dan kontributor lainnya.

![Gambar Sampul Pengumuman Vite 3](/og-image-announcing-vite3.png)

Hari ini, 16 bulan setelah peluncuran v2 kami dengan senang hati mengumumkan rilis Vite 3. Kami memutuskan untuk merilis versi mayor baru dari Vite setidaknya setiap tahun untuk sejalan dengan [EOL Node.js](https://nodejs.org/en/about/releases/), dan memanfaatkan kesempatan untuk secara teratur meninjau API Vite dengan jalur migrasi singkat untuk proyek-proyek dalam ekosistem.

Tautan cepat:

- [Dokumentasi](/)
- [Panduan Migrasi](https://v3.vitejs.dev/guide/migration.html)
- [Catatan Perubahan](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#300-2022-07-13)

Jika Anda baru menggunakan Vite, kami sarankan untuk membaca [Panduan Mengapa Vite](https://vitejs.dev/guide/why.html). Kemudian lihat [Mulai](https://vitejs.dev/guide/) dan [Panduan Fitur](https://vitejs.dev/guide/features) untuk melihat apa yang disediakan Vite secara default. Seperti biasa, kontribusi selalu diterima di [GitHub](https://github.com/vitejs/vite). Lebih dari [600 kolaborator](https://github.com/vitejs/vite/graphs/contributors) telah membantu meningkatkan Vite sejauh ini. Ikuti pembaruan di [Twitter](https://twitter.com/vite_js), atau bergabunglah dalam diskusi dengan pengguna Vite lainnya di [server obrolan Discord](http://chat.vitejs.dev/) kami.

## Dokumentasi Baru

Pergi ke [vitejs.dev](https://vitejs.dev) untuk menikmati dokumen v3 baru. Vite sekarang menggunakan tema default [VitePress](https://vitepress.vuejs.org) yang baru, dengan mode gelap yang menakjubkan di antara fitur-fitur lainnya.

[![Halaman Depan Dokumentasi Vite](../images/v3-docs.png)](https://vitejs.dev)

Beberapa proyek dalam ekosistem telah bermigrasi ke sana (lihat [Vitest](https://vitest.dev), [vite-plugin-pwa](https://vite-plugin-pwa.netlify.app/), dan [VitePress](https://vitepress.vuejs.org/) itu sendiri).

Jika Anda perlu mengakses dokumen Vite 2, mereka akan tetap tersedia secara online di [v2.vitejs.dev](https://v2.vitejs.dev). Ada juga subdomain baru [main.vitejs.dev](https://main.vitejs.dev), di mana setiap komit ke cabang utama Vite secara otomatis diimplementasikan. Ini berguna ketika menguji versi beta atau berkontribusi pada pengembangan inti.

Sekarang juga ada terjemahan resmi dalam bahasa Spanyol, yang telah ditambahkan ke terjemahan Tionghoa dan Jepang sebelumnya:

- [简体中文](https://cn.vitejs.dev/)
- [日本語](https://ja.vitejs.dev/)
- [Español](https://es.vitejs.dev/)

## Buat Template Awal Vite

Template [create-vite](/guide/#trying-vite-online) telah menjadi alat yang hebat untuk dengan cepat menguji Vite dengan kerangka kerja favorit Anda. Di Vite 3, semua template mendapatkan tema baru sesuai dengan dokumen baru. Buka mereka secara online dan mulai bermain dengan Vite 3 sekarang:

<div class="stackblitz-links">
<a target="_blank" href="https://vite.new"><img width="75" height="75" src="../images/vite.svg" alt="Vite logo"></a>
<a target="_blank" href="https://vite.new/vue"><img width="75" height="75" src="../images/vue.svg" alt="Vue logo"></a>
<a target="_blank" href="https://vite.new/svelte"><img width="60" height="60" src="../images/svelte.svg" alt="Svelte logo"></a>
<a target="_blank" href="https://vite.new/react"><img width="75" height="75" src="../images/react.svg" alt="React logo"></a>
<a target="_blank" href="https://vite.new/preact"><img width="65" height="65" src="../images/preact.svg" alt="Preact logo"></a>
<a target="_blank" href="https://vite.new/lit"><img width="60" height="60" src="../images/lit.svg" alt="Lit logo"></a>
</div>

<style>
.stackblitz-links {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
}
@media screen and (max-width: 550px) {
  .stackblitz-links {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    gap: 2rem;
    padding-left: 3rem;
    padding-right: 3rem;
  }
}
.stackblitz-links > a {
  width: 70px;
  height: 70px;
  display: grid;
  align-items: center;
  justify-items: center;
}
.stackblitz-links > a:hover {
  filter: drop-shadow(0 0 0.5em #646cffaa);
}
</style>

## Peningkatan Pengembangan

### CLI Vite

<pre style="background-color: var(--vp-code-block-bg);padding:2em;border-radius:8px;max-width:100%;overflow-x:auto;">
  <span style="color:lightgreen"><b>VITE</b></span> <span style="color:lightgreen">v3.0.0</span>  <span style="color:gray">siap dalam <b>320</b> ms</span>

  <span style="color:lightgreen"><b>➜</b></span>  <span style="color:white"><b>Lokal</b>:</span>   <span style="color:cyan">http://127.0.0.1:5173/</span>
  <span style="color:green"><b>➜</b></span>  <span style="color:gray"><b>Jaringan</b>: gunakan --host untuk mengekspos</span>
</pre>

Selain peningkatan estetika CLI, Anda akan melihat bahwa port server pengembangan default sekarang adalah 5173 dan server pratinjau mendengarkan pada 4173. Perubahan ini memastikan bahwa Vite akan menghindari tabrakan dengan alat lain.

### Strategi Koneksi WebSocket yang Ditingkatkan

Salah satu titik masalah dari Vite 2 adalah mengkonfigurasi server saat berjalan di belakang proxy. Vite 3 mengubah skema koneksi default sehingga bekerja secara langsung dalam sebagian besar skenario. Semua pengaturan ini sekarang diuji sebagai bagian dari CI Ekosistem Vite melalui [`vite-setup-catalogue`](https://github.com/sapphi-red/vite-setup-catalogue).

### Peningkatan Cold Start

Vite sekarang menghindari reload penuh selama cold start ketika impor disuntikkan oleh plugin saat merayapi modul yang diimpor secara statis pada awalnya ([#8869](https://github.com/vitejs/vite/issues/8869)).

<details>
  <summary><b>Klik untuk mempelajari lebih lanjut</b></summary>

Pada Vite 2.9, baik pemindai maupun optimizer dijalankan di latar belakang. Pada skenario terbaik, di mana pemindai akan menemukan setiap dependensi, tidak ada reload yang diperlukan saat cold start. Tetapi jika pemindai melewatkan dependensi, fase optimisasi baru dan kemudian reload diperlukan. Vite dapat menghindari beberapa reload ini pada v2.9, karena kami mendeteksi apakah potongan yang dioptimalkan baru kompatibel dengan yang dimiliki browser. Tetapi jika ada dep bersama, potongan sub bisa berubah dan reload diperlukan untuk menghindari keadaan yang duplikat. Pada Vite 3, dependensi yang dioptimalkan tidak diberikan kepada browser sampai merayapi impor statis selesai. Sebuah fase optimasi cepat dikeluarkan jika ada dep yang hilang (misalnya, disuntikkan oleh plugin), dan hanya setelah itu, dependensi yang dibundel dikirim. Jadi, reload halaman tidak lagi diperlukan untuk kasus-kasus ini.

</details>

<img style="background-color: var(--vp-code-block-bg);padding:4%;border-radius:8px;" width="100%" height="auto" src="../images/vite-3-cold-start.svg" alt="Two graphs comparing Vite 2.9 and Vite 3 optimization strategy">

### import.meta.glob

Dukungan untuk `import.meta.glob` telah ditulis ulang. Baca tentang fitur-fitur baru di [Panduan Glob Import](/guide/features.html#glob-import):

[Multiple Patterns](/guide/features.html#multiple-patterns) dapat dilewatkan sebagai array

```js
import.meta.glob(['./dir/*.js', './another/*.js'])
```

[Negative Patterns](/guide/features.html#negative-patterns) sekarang didukung (diberi awalan `!`) untuk mengabaikan beberapa file tertentu

```js
import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

[Named Imports](/guide/features.html#named-imports) dapat ditentukan untuk meningkatkan tree-shaking

```js
import.meta.glob('./dir/*.js', { import: 'setup' })
```

[Custom Queries](/guide/features.html#custom-queries) dapat dilewatkan untuk melampirkan metadata

```js
import.meta.glob('./dir/*.js', { query: { custom: 'data' } })
```

[Eager Imports](/guide/features.html#glob-import) sekarang dilewatkan sebagai flag

```js
import.meta.glob('./dir/*.js', { eager: true })
```

### Penyesuaian Impor WASM dengan Standar Masa Depan

API impor WebAssembly telah direvisi untuk menghindari tabrakan dengan standar masa depan dan membuatnya lebih fleksibel:

```js
import init from './example.wasm?init'

init().then((instance) => {
  instance.exports.test()
})
```

Pelajari lebih lanjut di [panduan WebAssembly](/guide/features.html#webassembly)

## Peningkatan Pembangunan

### ESM SSR Build secara Default

Sebagian besar kerangka kerja SSR dalam ekosistem sudah menggunakan build ESM. Jadi, Vite 3 membuat ESM sebagai format default untuk build SSR. Hal ini memungkinkan kami untuk menyederhanakan [heuristik eksternalisasi SSR sebelumnya](https://vitejs.dev/guide/ssr.html#ssr-externals), dengan menjadikan dependensi eksternal secara default.

### Dukungan Base Relatif yang Ditingkatkan

Vite 3 sekarang mendukung base relatif dengan benar (menggunakan `base: ''`), memungkinkan aset yang dibangun untuk didistribusikan ke base yang berbeda tanpa perlu membangun ulang. Ini berguna ketika base tidak diketahui pada waktu pembangunan, misalnya ketika mendistribusikan ke jaringan berbasis konten seperti [IPFS](https://ipfs.io/).

## Fitur Eksperimental

### Kontrol Detail Jalur Aset yang Dibangun (Eksperimental)

Ada skenario penyebaran lain di mana ini tidak cukup. Misalnya, jika aset terhash yang dihasilkan perlu didistribusikan ke CDN yang berbeda dari file publik, maka kontrol yang lebih detail diperlukan terhadap pembangkitan jalur pada waktu pembangunan. Vite 3 menyediakan API eksperimental untuk memodifikasi jalur file yang dibangun. Periksa [Opsi Base Pembangunan Lanjutan](/guide/build.html#advanced-base-options) untuk informasi lebih lanjut.

### Optimisasi Deps Esbuild pada Waktu Pembangunan (Eksperimental)

Salah satu perbedaan utama antara waktu pengembangan dan waktu pembangunan adalah bagaimana Vite menangani dependensi. Selama waktu pembangunan, [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs) digunakan untuk mengizinkan impor dependensi hanya CJS (seperti React). Saat menggunakan server pengembangan, esbuild digunakan sebagai gantinya untuk pra-bundel dan mengoptimalkan dependensi, dan skema interop inline diterapkan saat mengubah kode pengguna yang mengimpor dependensi CJS. Selama pengembangan Vite 3, kami memperkenalkan perubahan yang diperlukan untuk juga memungkinkan penggunaan [esbuild untuk mengoptimalkan dependensi pada waktu pembangunan](https://v3.vitejs.dev/guide/migration.html#using-esbuild-deps-optimization-at-build-time). [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs) kemudian dapat dihindari, membuat waktu pengembangan dan pembangunan bekerja dengan cara yang sama.

Mengingat bahwa Rollup v3 akan keluar dalam beberapa bulan mendatang, dan kami akan mengikuti dengan versi utama Vite lainnya, kami memutuskan untuk membuat mode ini opsional untuk mengurangi cakupan v3 dan memberikan waktu lebih bagi Vite dan ekosistem untuk menyelesaikan masalah yang mungkin muncul dengan pendekatan interop CJS baru selama waktu pembangunan. Kerangka kerja dapat beralih untuk menggunakan optimisasi dependensi esbuild pada waktu pembangunan secara default dengan kecepatan mereka sendiri sebelum Vite 4.

### HMR Partial Accept (Eksperimental)

Ada dukungan opsional untuk [HMR Partial Accept](https://github.com/vitejs/vite/pull/7324). Fitur ini bisa membuka kunci HMR yang lebih halus untuk komponen kerangka kerja yang mengekspor beberapa binding dalam modul yang sama. Anda dapat mempelajari lebih lanjut di [diskusi untuk proposal ini](https://github.com/vitejs/vite/discussions/7309).

## Pengurangan Ukuran Bundel

Vite peduli dengan jejak penerbitan dan instalasinya; instalasi cepat dari aplikasi baru adalah fitur. Vite menggabungkan sebagian besar dependensinya dan mencoba menggunakan alternatif ringan modern dimana memungkinkan. Melanjutkan dengan tujuan berkelanjutan ini, ukuran penerbitan Vite 3 adalah 30% lebih kecil dari v2.

|             | Ukuran Penerbitan | Ukuran Instalasi |
| ----------- | :---------------: | :--------------: |
| Vite 2.9.14 |      4.38MB       |      19.1MB      |
| Vite 3.0.0  |      3.05MB       |      17.8MB      |
| Pengurangan |       -30%        |        -7%       |

Sebagian besar, pengurangan ini dimungkinkan dengan membuat beberapa dependensi yang kebanyakan pengguna tidak memerlukannya menjadi opsional. Pertama, [Terser](https://github.com/terser/terser) tidak lagi diinstal secara default. Dependensi ini tidak lagi diperlukan karena kami sudah menjadikan esbuild sebagai minifier default untuk JS dan CSS di Vite 2. Jika Anda menggunakan `build.minify: 'terser'`, Anda perlu menginstalnya (`npm add -D terser`). Kami juga memindahkan [node-forge](https://github.com/digitalbazaar/forge) keluar dari monorepo, mengimplementasikan dukungan untuk pembuatan sertifikat https otomatis sebagai plugin baru: [`@vitejs/plugin-basic-ssl`](https://v3.vitejs.dev/guide/migration.html#automatic-https-certificate-generation).

Karena fitur ini hanya membuat sertifikat tidak dipercaya yang tidak ditambahkan ke toko lokal, ini tidak membenarkan penambahan ukuran.

## Perbaikan Bug

Sebuah maraton triase dipimpin oleh [@bluwyoo](https://twitter.com/bluwyoo), [@sapphi_red](https://twitter.com/sapphi_red), yang baru-baru ini bergabung dengan tim Vite. Selama tiga bulan terakhir, issue terbuka Vite berkurang dari 770 menjadi 400. Dan pencapaian ini dicapai saat PR yang baru dibuka berada pada puncaknya. Pada saat yang sama, [@haoqunjiang](https://twitter.com/haoqunjiang) juga telah menyusun [gambaran komprehensif tentang masalah Vite](https://github.com/vitejs/vite/discussions/8232).

[![Grafik issue dan pull request terbuka di Vite](../images/v3-open-issues-and-PRs.png)](https://www.repotrends.com/vitejs/vite)

[![Grafik issue dan pull request baru di Vite](../images/v3-new-open-issues-and-PRs.png)](https://www.repotrends.com/vitejs/vite)

## Catatan Kompatibilitas

- Vite tidak lagi mendukung Node.js 12 / 13 / 15, yang telah mencapai EOL-nya. Node.js 14.18+ / 16+ sekarang diperlukan.
- Vite sekarang diterbitkan sebagai ESM, dengan proxy CJS ke entri ESM untuk kompatibilitas.
- Baseline Browser Modern sekarang ditargetkan pada browser yang mendukung [native ES Modules](https://caniuse.com/es6-module), [native ESM dynamic import](https://caniuse.com/es6-module-dynamic-import), dan [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) fitur.
- Ekstensi file JS dalam mode SSR dan pustaka sekarang menggunakan ekstensi yang valid (`js`, `mjs`, atau `cjs`) untuk entri JS output dan chunk berdasarkan format dan jenis paket mereka.

Pelajari lebih lanjut di [Panduan Migrasi](https://v3.vitejs.dev/guide/migration.html).

## Pembaruan ke Inti Vite

Saat menuju ke Vite 3, kami juga meningkatkan pengalaman berkontribusi bagi kolaborator ke [Inti Vite](https://github.com/vitejs/vite).

- Unit dan E2E tes telah bermigrasi ke [Vitest](https://vitest.dev), memberikan DX yang lebih cepat dan stabil. Langkah ini juga berfungsi sebagai makanan anjing untuk proyek infrastruktur penting dalam ekosistem.
- Pembangunan VitePress sekarang diuji sebagai bagian dari CI.
- Vite ditingkatkan ke [pnpm 7](https://pnpm.io/), mengikuti bagian lain dari ekosistem.
- Playground telah dipindahkan ke [`/playgrounds`](https://github.com/vitejs/vite/tree/main/playground) keluar dari direktori paket.
- Paket dan playground sekarang `"type": "module"`.
- Plugin sekarang dibundel menggunakan [unbuild](https://github.com/unjs/unbuild), dan [plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) dan [plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) dipindahkan ke TypeScript.

## Ekosistem Siap untuk v3

Kami telah bekerja sama dengan proyek-proyek dalam ekosistem untuk memastikan bahwa kerangka kerja yang didukung oleh Vite siap untuk Vite 3. [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) memungkinkan kami untuk menjalankan CI dari pemain utama dalam ekosistem melawan cabang utama Vite dan menerima laporan tepat waktu sebelum memperkenalkan regresi. Rilis hari ini seharusnya segera kompatibel dengan sebagian besar proyek yang menggunakan Vite.

## Pengakuan

Vite 3 adalah hasil dari upaya bersama anggota [Tim Vite](/team) bekerja sama dengan para pemelihara proyek ekosistem dan kontributor lainnya terhadap inti Vite.

Kami ingin berterima kasih kepada semua orang yang telah mengimplementasikan fitur-fitur, memberikan masukan, dan terlibat dalam Vite 3:

- Anggota tim Vite [@youyuxi](https://twitter.com/youyuxi), [@patak_dev](https://twitter.com/patak_dev), [@antfu7](https://twitter.com/antfu7),
[@bluwyoo](https://twitter.com/bluwyoo), [@sapphi_red](https://twitter.com/sapphi_red), [@haoqunjiang](https://twitter.com/haoqunjiang), [@poyoho](https://github.com/poyoho),
[@Shini_92](https://twitter.com/Shini_92), dan [@retropragma](https://twitter.com/retropragma).
- [@benmccann](https://github.com/benmccann), [@danielcroe](https://twitter.com/danielcroe),
[@brillout](https://twitter.com/brillout), [@sheremet_va](https://twitter.com/sheremet_va),
[@userquin](https://twitter.com/userquin), [@enzoinnocenzi](https://twitter.com/enzoinnocenzi),
[@maximomussini](https://twitter.com/maximomussini), [@IanVanSchooten](https://twitter.com/IanVanSchooten),
tim [Astro](https://astro.build/), dan semua pemelihara kerangka kerja dan plugin lainnya di ekosistem yang membantu membentuk v3.
- [@dominikg](https://github.com/dominikg) untuk pekerjaannya pada vite-ecosystem-ci.
- [@ZoltanKochan](https://twitter.com/ZoltanKochan) untuk pekerjaannya pada [pnpm](https://pnpm.io/), dan responsivitasnya saat kami membutuhkan dukungan.
- [@rixo](https://github.com/rixo) untuk dukungan HMR Partial Accept.
- [@KiaKing85](https://twitter.com/KiaKing85) untuk menyiapkan tema untuk rilis Vite 3, dan [@\_brc_dd](https://twitter.com/_brc_dd) untuk bekerja pada internal VitePress.
- [@CodingWithCego](https://twitter.com/CodingWithCego) untuk terjemahan Spanyol baru, dan [@ShenQingchuan](https://twitter.com/ShenQingchuan),
[@hiro-lapis](https://github.com/hiro-lapis), dan yang lainnya di tim terjemahan Cina dan Jepang untuk menjaga dokumen terjemahan tetap terkini.

Kami juga ingin berterima kasih kepada individu dan perusahaan yang mensponsori tim Vite, dan perusahaan yang berinvestasi dalam pengembangan Vite: sebagian pekerjaan [@antfu7](https://twitter.com/antfu7) pada Vite dan ekosistem adalah bagian dari pekerjaannya di [Nuxt Labs](https://nuxtlabs.com/), dan [StackBlitz](https://stackblitz.com/) menyewa [@patak_dev](https://twitter.com/patak_dev)
untuk bekerja penuh waktu pada Vite.

## Apa Selanjutnya

Kami akan mengambil beberapa bulan berikutnya untuk memastikan transisi yang lancar bagi semua proyek yang dibangun di atas Vite. Jadi, minor pertama akan difokuskan pada melanjutkan upaya triaging dengan fokus pada isu yang baru dibuka.

Tim Rollup sedang [mengerjakan versi utama berikutnya](https://twitter.com/lukastaegert/status/1544186847399743488), yang akan dirilis dalam beberapa bulan mendatang. Setelah ekosistem plugin Rollup memiliki waktu untuk memperbarui, kami akan menyusul dengan versi utama Vite yang baru. Ini akan memberi kami kesempatan lain untuk memperkenalkan perubahan yang lebih signifikan tahun ini, yang bisa kami gunakan untuk menstabilkan beberapa fitur eksperimental yang diperkenalkan dalam rilis ini.

Jika Anda tertarik untuk membantu meningkatkan Vite, cara terbaik untuk bergabung adalah dengan membantu triaging isu-isu. Bergabunglah [di Discord kami](https://chat.vitejs.dev) dan cari saluran `#contributing`. Atau ikutlah dalam `#docs`, `#help` yang lain, atau buat plugin. Kami baru saja memulai. Ada banyak gagasan terbuka untuk terus meningkatkan DX Vite.