---
title: Vite 5.1 Telah Dirilis!
author:
  name: The Vite Team
date: 2024-02-08
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 5.1
  - - meta
    - property: og:image
      content: https://vitejs.dev/og-image-announcing-vite5-1.png
  - - meta
    - property: og:url
      content: https://vitejs.dev/blog/announcing-vite5-1
  - - meta
    - property: og:description
      content: Vite 5.1 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 5.1 Telah Dirilis!

_Pada 8 Februari 2024_

![Gambar Sampul Pengumuman Vite 5.1](/og-image-announcing-vite5-1.png)

Vite 5 [telah dirilis](./announcing-vite5.md) pada bulan November lalu, dan itu merupakan lonjatan besar lainnya bagi Vite dan ekosistemnya. Beberapa minggu yang lalu kami merayakan 10 juta unduhan npm mingguan dan 900 kontributor ke repositori Vite. Hari ini, kami sangat senang untuk mengumumkan rilis Vite 5.1.

Tautan cepat: [Dokumentasi](/), [Log Perubahan](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#510-2024-02-08)

Dokumentasi dalam bahasa lain: [简体中文](https://cn.vitejs.dev/), [日本語](https://ja.vitejs.dev/), [Español](https://es.vitejs.dev/), [Português](https://pt.vitejs.dev/), [한국어](https://ko.vitejs.dev/), [Deutsch](https://de.vitejs.dev/)

Coba Vite 5.1 secara online di StackBlitz: [vanilla](https://vite.new/vanilla-ts), [vue](https://vite.new/vue-ts), [react](https://vite.new/react-ts), [preact](https://vite.new/preact-ts), [lit](https://vite.new/lit-ts), [svelte](https://vite.new/svelte-ts), [solid](https://vite.new/solid-ts), [qwik](https://vite.new/qwik-ts).

Jika Anda baru menggunakan Vite, kami sarankan untuk membaca terlebih dahulu panduan [Memulai](/guide/) dan [Fitur](/guide/features).

Untuk tetap terinformasi, ikuti kami di [X](https://x.com/vite_js) atau [Mastodon](https://webtoo.ls/@vite).

## API Runtime Vite

Vite 5.1 menambahkan dukungan eksperimental untuk API Runtime Vite baru. Ini memungkinkan menjalankan kode apa pun dengan memprosesnya terlebih dahulu dengan plugin Vite. Ini berbeda dari `server.ssrLoadModule` karena implementasi runtime terpisah dari server. Ini memungkinkan pengarang pustaka dan kerangka kerja untuk mengimplementasikan lapisan komunikasi mereka sendiri antara server dan runtime. API baru ini dimaksudkan untuk menggantikan primitif SSR saat ini dari Vite begitu stabil.

API baru ini membawa banyak manfaat:

- Dukungan untuk HMR selama SSR.
- Ini terpisah dari server, sehingga tidak ada batasan pada berapa banyak klien yang dapat menggunakan satu server - setiap klien memiliki cache modulnya sendiri (Anda bahkan dapat berkomunikasi dengannya seperti yang Anda inginkan - menggunakan saluran pesan/panggilan fetch/panggilan fungsi langsung/websocket).
- Ini tidak bergantung pada API bawaan node/bun/deno apa pun, sehingga dapat berjalan di berbagai lingkungan.
- Mudah diintegrasikan dengan alat-alat yang memiliki mekanisme mereka sendiri untuk menjalankan kode (Anda dapat menyediakan pelari untuk menggunakan `eval` daripada `new AsyncFunction` misalnya).

Ide awal [diajukan oleh Pooya Parsa](https://github.com/nuxt/vite/pull/201) dan diimplementasikan oleh [Anthony Fu](https://github.com/antfu) sebagai paket [vite-node](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node#readme) untuk [mendukung Nuxt 3 Dev SSR](https://antfu.me/posts/dev-ssr-on-nuxt) dan kemudian juga digunakan sebagai dasar untuk [Vitest](https://vitest.dev). Jadi ide umum vite-node telah diuji secara coba perang untuk waktu yang cukup lama sekarang. Ini adalah iterasi baru dari API oleh [Vladimir Sheremet](https://github.com/sheremet-va), yang sudah menulis ulang vite-node di Vitest dan mengambil pembelajaran untuk membuat API bahkan lebih kuat dan fleksibel saat menambahkannya ke Vite Core. PR ini memakan waktu satu tahun untuk disusun, Anda dapat melihat evolusi dan diskusi dengan pengelola ekosistem [di sini](https://github.com/vitejs/vite/issues/12165).

Baca lebih lanjut dalam [panduan API Runtime Vite](/guide/api-vite-runtime) dan [berikan kami umpan balik](https://github.com/vitejs/vite/discussions/15774).

## Fitur

### Dukungan yang Ditingkatkan untuk `.css?url`

Impor file CSS sebagai URL sekarang berfungsi secara dapat diandalkan dan benar. Ini adalah rintangan terakhir dalam perpindahan Remix ke Vite. Lihat ([#15259](https://github.com/vitejs/vite/issues/15259)).

### `build.assetsInlineLimit` sekarang mendukung sebuah callback

Pengguna sekarang dapat [memberikan sebuah callback](/config/build-options.html#build-assetsinlinelimit) yang mengembalikan sebuah boolean untuk menerima atau menolak penggabungan untuk aset tertentu. Jika `undefined` dikembalikan, logika default berlaku. Lihat ([#15366](https://github.com/vitejs/vite/issues/15366)).

### HMR yang Ditingkatkan untuk impor sirkular

Pada Vite 5.0, modul yang diterima dalam impor sirkular selalu memicu reload halaman penuh bahkan jika mereka dapat ditangani dengan baik di klien. Ini sekarang lebih fleksibel untuk memungkinkan HMR diterapkan tanpa reload halaman penuh, tetapi jika terjadi kesalahan selama HMR, halaman akan dimuat ulang. Lihat ([#15118](https://github.com/vitejs/vite/issues/15118)).

### Dukungan `ssr.external: true` untuk eksternalisasi semua paket SSR

Secara historis, Vite mengexternalisasikan semua paket kecuali paket yang terhubung. Opsi baru ini dapat digunakan untuk memaksa eksternalisasi semua paket termasuk paket yang terhubung juga. Ini berguna dalam pengujian dalam monorepo di mana kita ingin meniru kasus biasa dari semua paket yang dieksternalisasikan, atau ketika menggunakan `ssrLoadModule` untuk memuat file sembarang dan kita ingin selalu eksternal paket karena kita tidak peduli tentang HMR. Lihat ([#10939](https://github.com/vitejs/vite/issues/10939)).

### Memperlihatkan metode `close` dalam server pratinjau

Server pratinjau sekarang memperlihatkan metode `close`, yang akan secara benar menutup server termasuk semua koneksi soket yang dibuka. Lihat ([#15630](https://github.com/vitejs/vite/issues/15630)).

## Peningkatan Kinerja

Vite terus menjadi lebih cepat dengan setiap rilis, dan Vite 5.1 dipenuhi dengan peningkatan kinerja. Kami mengukur waktu muat untuk 10K modul (25 tingkat kedalaman pohon) menggunakan [vite-dev-server-perf](https://github.com/yyx990803/vite-dev-server-perf) untuk semua versi minor dari Vite 4.0. Ini adalah benchmark yang baik untuk mengukur efek pendekatan Vite yang tidak mengikat bundel. Setiap modul adalah file TypeScript kecil dengan penghitung dan impor ke file lain dalam pohon, jadi ini sebagian besar mengukur waktu yang dibutuhkan untuk melakukan permintaan pada modul yang berbeda. Pada Vite 4.0, memuat 10K modul memakan waktu 8 detik pada M1 MAX. Kami memiliki terobosan pada [Vite 4.3 di mana kami fokus pada kinerja](./announcing-vite4-3.md), dan kami bisa memuatnya dalam 6.35 detik. Pada Vite 5.1, kami berhasil melakukan lonjatan kinerja lainnya. Sekarang Vite melayani 10K modul dalam 5.35 detik.

![Progres Waktu Muat 10K Modul Vite](/vite5-1-10K-modules-loading-time.png)

Hasil benchmark ini dijalankan pada Headless Puppeteer dan merupakan cara yang baik untuk membandingkan versi. Namun, mereka tidak mewakili waktu seperti yang dialami oleh pengguna. Ketika menjalankan 10K modul yang sama di jendela Incognito di Chrome, kami memiliki:

| 10K Modul             | Vite 5.0 | Vite 5.1 |
| --------------------- | :------: | :------: |
| Waktu Muat            |  2892ms  |  2765ms  |
| Waktu Muat (disimpan) |  2778ms  |  2477ms  |
| Muat Penuh            |  2003ms  |  1878ms  |
| Muat Penuh (disimpan) |  1682ms  |  1604ms  |

### Jalankan Pra-pemproses CSS dalam Thread

Vite sekarang memiliki dukungan opsional untuk menjalankan pra-pemproses CSS dalam thread. Anda dapat mengaktifkannya menggunakan [`css.preprocessorMaxWorkers: true`](/config/shared-options.html#css-preprocessormaxworkers). Untuk proyek Vuetify 2, waktu startup dev berkurang 40% dengan fitur ini diaktifkan. Ada [perbandingan kinerja untuk setup lainnya dalam PR](https://github.com/vitejs/vite/pull/13584#issuecomment-1678827918). Lihat ([#13584](https://github.com/vitejs/vite/issues/13584)). [Beri Masukan](https://github.com/vitejs/vite/discussions/15835).

### Opsi Baru untuk Meningkatkan Awal Dingin Server

Anda dapat mengatur `optimizeDeps.holdUntilCrawlEnd: false` untuk beralih ke strategi baru untuk optimasi dependensi yang mungkin membantu dalam proyek-proyek besar. Kami sedang mempertimbangkan untuk beralih ke strategi ini secara default di masa depan. [Beri Masukan](https://github.com/vitejs/vite/discussions/15834). ([#15244](https://github.com/vitejs/vite/issues/15244))

### Resolusi Lebih Cepat dengan Pemeriksaan yang Dicache

Optimasi `fs.cachedChecks` sekarang diaktifkan secara default. Di Windows, `tryFsResolve` sekitar ~14x lebih cepat dengan itu, dan resolusi id secara keseluruhan mendapat peningkatan kecepatan sekitar ~5x dalam benchmark segitiga. ([#15704](https://github.com/vitejs/vite/issues/15704))

### Peningkatan Kinerja Internal

Server pengembangan memiliki beberapa peningkatan kinerja inkremental. Middleware baru untuk menghentikan jalur pada 304 ([#15586](https://github.com/vitejs/vite/issues/15586)). Kami menghindari `parseRequest` dalam jalur panas ([#15617](https://github.com/vitejs/vite/issues/15617)). Rollup sekarang dimuat secara malas dengan benar ([#15621](https://github.com/vitejs/vite/issues/15621)).

## Depresiasi

Kami terus mengurangi permukaan API Vite jika memungkinkan untuk membuat proyek mudah dipelihara dalam jangka panjang.

### Depresiasi opsi `as` dalam `import.meta.glob`

Standar beralih ke [Atribut Impor](https://github.com/tc39/proposal-import-attributes), tetapi kami tidak berencana untuk mengganti `as` dengan opsi baru pada titik ini. Sebagai gantinya, disarankan agar pengguna beralih ke `query`. Lihat ([#14420](https://github.com/vitejs/vite/issues/14420)).

### Menghapus pembundelan pra-bundel saat pembuatan

Pembundelan pra-bundel saat pembuatan, fitur eksperimental yang ditambahkan dalam Vite 3, dihapus. Dengan Rollup 4 beralih parser-nya menjadi native, dan Rolldown sedang dalam pengembangan, baik kinerja maupun konsistensi dev-vs-build untuk fitur ini tidak lagi valid. Kami ingin terus meningkatkan konsistensi dev/build, dan kami telah menyimpulkan bahwa menggunakan Rolldown untuk "pembundelan pra-bundel selama dev" dan "build produksi" adalah pilihan yang lebih baik ke depannya. Rolldown juga dapat mengimplementasikan caching dengan cara yang jauh lebih efisien selama pembuatan daripada pembundelan dependensi pra-bundel. Lihat ([#15184](https://github.com/vitejs/vite/issues/15184)).

## Terlibatlah

Kami berterima kasih kepada [900 kontributor untuk Vite Core](https://github.com/vitejs/vite/graphs/contributors), dan para maintainers plugin, integrasi, alat, dan terjemahan yang terus mendorong ekosistem ke depan. Jika Anda menikmati menggunakan Vite, kami mengundang Anda untuk berpartisipasi dan membantu kami. Lihat [Panduan Kontribusi Kami](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md), dan bergabunglah dalam [mengevaluasi isu-isu](https://github.com/vitejs/vite/issues), [meninjau PR](https://github.com/vitejs/vite/pulls), menjawab pertanyaan di [Diskusi GitHub](https://github.com/vitejs/vite/discussions), dan membantu orang lain dalam komunitas di [Vite Land](https://chat.vitejs.dev).

## Pengakuan

Vite 5.1 mungkin berkat komunitas kontributor kami, para maintainer dalam ekosistem, dan [Tim Vite](/team). Terima kasih kepada individu dan perusahaan yang mensponsori pengembangan Vite. [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/), dan [Astro](https://astro.build) karena telah mempekerjakan anggota tim Vite. Dan juga kepada para sponsor di [Vite's GitHub Sponsors](https://github.com/sponsors/vitejs), [Vite's Open Collective](https://opencollective.com/vite), dan [GitHub Sponsors Evan You](https://github.com/sponsors/yyx990803).
