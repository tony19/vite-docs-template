---
title: Mengumumkan Vite 2.0
author:
  - name: Tim Vite
sidebar: false
date: 2021-02-16
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Mengumumkan Vite 2.0
  - - meta
    - property: og:url
      content: https://vitejs.dev/blog/announcing-vite2
  - - meta
    - property: og:description
      content: Pengumuman Rilis Vite 2
---

# Announcing Vite 2.0

_February 16, 2021_ - Lihat bagian [Vite 3.0 announcement](./announcing-vite3.md)

<p style="text-align:center">
  <img src="/logo.svg" style="height:200px">
</p>

Hari ini kami dengan senang hati mengumumkan perilisan resmi Vite 2.0!

Vite (Berasal dari bahasa Prancin yang berarti "cepat", penyebutanya `/vit/`) adalah jenis alat building baru untuk pengembangan web frontend. Bayangkan sebuah server pengembangan yang sudah diatur sebelumnya + bundler, tetapi lebih ringan dan cepat. dengan memanfaatkan dukungan [native ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) dari browser dan alat-alat yang ditulis dalam bahasa compile-to-native seperti [esbuild](https://esbuild.github.io/) untuk memberikan pengalaman pengembangan yang cepat dan modern.

Untuk mendapatkan gambaran seberapa cepat Vite, cek [vidio perbandingan ini](https://twitter.com/amasad/status/1355379680275128321) of tentang proses booting aplikasi React di Repl.it menggunakan Vite VS `create-react-app` (CRA).

Jika Anda belum pernah mendengar tentang Vite sebelumnya dan ingin belajar lebih lanjut tentangnya, lihat [alasan dibalik proyek ini](https://vitejs.dev/guide/why.html). Jika Anda tertarik dengan perbedaan Vite dari alat serupa lainnya, cek [perbandingannya](https://vitejs.dev/guide/comparisons.html).

## Apa yang Baru di Versi 2.0

Karena kami memutuskan untuk merombak total bagian internal sebelum 1.0 keluar dari RC, ini adalah rilis stabil pertama Vite. Meskipun demikian, Vite 2.0 membawa banyak peningkatan besar dibandingkan versi sebelumnya:

### Framework Agnostic Core

Ide asli dari Vite dimulai sebagai [ prototipe sederhana yang melayani komponen-komponen tunggal Vue melalui ESM asli.](https://github.com/vuejs/vue-dev-server). Vite 1 merupakan kelanjutan dari ide tersebut dengan HMR diimplementasikan di atasnya.

Vite 2.0 mengambil apa yang telah kita pelajari sepanjang perjalanan tersebut dan diubah ulang dari awal dengan arsitektur internal yang lebih kokoh. Sekarang, Vite sepenuhnya tidak berkaitan dengan kerangka kerja tertentu, dan semua dukungan khusus kerangka kerja didelegasikan ke dalam plugin. Sekarang ada [ template resmi untuk Vue, React, Preact, Lit Element](https://github.com/vitejs/vite/tree/main/packages/create-vite), dan upaya komunitas yang sedang berlangsung untuk integrasi Svelte.

### Format Plugin Baru dan API

Terinspirasi oleh [WMR](https://github.com/preactjs/wmr), sistem plugin baru ini memperluas antarmuka plugin Rollup dan [ kompatibel dengan banyak plugin Rollup ](https://vite-rollup-plugins.patak.dev/) secara langsung. Plugin dapat menggunakan hook yang kompatibel dengan Rollup, dengan tambahan hook dan properti khusus Vite untuk menyesuaikan perilaku yang hanya berlaku pada Vite (misalnya membedakan antara pengembangan dan pembangunan atau penanganan kustom untuk HMR).

 [API programatik](https://vitejs.dev/guide/api-javascript.html) juga telah ditingkatkan secara signifikan untuk memfasilitasi alat / kerangka kerja tingkat tinggi yang dibangun di atas Vite.

### esbuild Powered Dep Pre-Bundling

Karena Vite adalah server pengembangan native ESM, ia melakukan prapemaketan dependensi untuk mengurangi jumlah permintaan browser dan menangani konversi CommonJS menjadi ESM. Sebelumnya, Vite melakukannya menggunakan Rollup, dan pada versi 2.0 sekarang menggunakan `esbuild` yang menghasilkan prapemaketan dependensi 10-100x lebih cepat. Sebagai referensi, pemuatan dingin sebuah aplikasi uji dengan dependensi berat seperti React Material UI sebelumnya membutuhkan waktu 28 detik pada MacBook Pro yang didukung oleh M1, dan sekarang hanya memerlukan ~1.5 detik. Harapkan peningkatan serupa jika Anda beralih dari pengaturan bundler tradisional.

### Dukungan CSS Kelas Utama

Vite memperlakukan CSS sebagai warga pertama dalam grafik modul dan mendukung hal-hal berikut secara langsung:

- **Peningkatan Pemecahan Masalah**: `@import` dan `url()` dalam CSS ditingkatkan dengan resolver Vite untuk memperhatikan alias dan dependensi npm.
- **Penggabungan Ulang URL**: `url()` secara otomatis digabungkan ulang tanpa memperdulikan dari mana file tersebut diimpor.
- **Pemisahan Kode CSS**: Sebuah chunk JS yang dipisahkan kode juga mengeluarkan sebuah file CSS yang sesuai, yang secara otomatis dimuat secara paralel dengan chunk JS saat diminta.

### Dukungan Server-Side Rendering (SSR)

Vite 2.0 dilengkapi dengan [ dukungan SSR eksperimental](https://vitejs.dev/guide/ssr.html). Vite menyediakan API untuk memuat dan memperbarui kode sumber berbasis ESM secara efisien di Node.js selama pengembangan (hampir seperti HMR sisi server), dan secara otomatis mengexternalisasikan dependensi yang kompatibel dengan CommonJS untuk meningkatkan kecepatan pengembangan dan pembangunan SSR. Server produksi dapat sepenuhnya terpisah dari Vite, dan setup yang sama dapat dengan mudah disesuaikan untuk melakukan pra-rendering / SSG.

SSR Vite disediakan sebagai fitur tingkat rendah dan kami berharap akan melihat kerangka kerja tingkat tinggi memanfaatkannya di bawah kap mesin.

### Dukungan opt-in Legacy Browser 

Secara default, Vite ditujukan untuk browser modern dengan dukungan ESM asli, tetapi Anda juga dapat memilih untuk mendukung browser legacy melalui [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) resmi. Plugin ini secara otomatis menghasilkan bundel ganda modern/legacy, dan memberikan bundel yang tepat berdasarkan deteksi fitur browser, sehingga memastikan kode yang lebih efisien di browser modern yang mendukungnya.

## Cobalah Sekarang!

walaupun Vite ini memiliki banyak fitur, tetapi memulai dengan Vite sangatlah mudah! Anda dapat membuat aplikasi yang didukung oleh Vite secara harfiah dalam satu menit, mulai dengan perintah berikut (pastikan Node.js memiliki versi yang >=12):

```bash
npm init @vitejs/app
```

Selanjutnya, periksa [panduannya](https://vitejs.dev/guide/) untuk melihat apa yang disediakan Vite secara langsung. Anda juga dapat melihat kode sumbernya di [GitHub](https://github.com/vitejs/vite), mengikuti pembaruan di [Twitter](https://twitter.com/vite_js), atau bergabung dalam diskusi dengan pengguna Vite lainnya di [server obrolan Discord.](http://chat.vitejs.dev/).
