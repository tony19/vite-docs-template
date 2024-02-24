---
title: Vite 5.0 Telah Dirilis!
author:
  name: The Vite Team
date: 2023-11-16
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 5
  - - meta
    - property: og:image
      content: https://vitejs.dev/og-image-announcing-vite5.png
  - - meta
    - property: og:url
      content: https://vitejs.dev/blog/announcing-vite5
  - - meta
    - property: og:description
      content: Vite 5 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 5.0 Telah Dirilis!

_16 November 2023_

![Gambar Sampul Pengumuman Vite 5](/og-image-announcing-vite5.png)

Vite 4 [dirilis](./announcing-vite4.md) hampir satu tahun yang lalu, dan menjadi dasar yang kokoh bagi ekosistem. Unduhan npm per minggu melonjak dari 2,5 juta menjadi 7,5 juta, karena proyek-proyek terus membangun infrastruktur bersama. Kerangka kerja terus berinovasi, dan di atas [Astro](https://astro.build/), [Nuxt](https://nuxt.com/), [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart), [Qwik City](https://qwik.builder.io/qwikcity/overview/), di antara lain, kami melihat kerangka kerja baru bergabung dan memperkuat ekosistem. [RedwoodJS](https://redwoodjs.com/) dan [Remix](https://remix.run/) beralih ke Vite membuka jalan bagi adopsi lebih lanjut dalam ekosistem React. [Vitest](https://vitest.dev) terus berkembang dengan kecepatan yang bahkan lebih cepat dari Vite. Timnya telah bekerja keras dan akan segera [merilis Vitest 1.0](https://github.com/vitest-dev/vitest/issues/3596). Cerita Vite saat digunakan dengan alat-alat lain seperti [Storybook](https://storybook.js.org), [Nx](https://nx.dev), dan [Playwright](https://playwright.dev) terus meningkat, demikian juga dengan lingkungan, dengan pengembangan Vite bekerja baik dalam [Deno](https://deno.com) maupun [Bun](https://bun.sh).

Kami memiliki edisi kedua dari [ViteConf](https://viteconf.org/23/replay) sebulan yang lalu, yang diselenggarakan oleh [StackBlitz](https://stackblitz.com). Seperti tahun lalu, sebagian besar proyek dalam ekosistem berkumpul untuk berbagi ide dan terhubung untuk terus memperluas area umum. Kami juga melihat bagian-bagian baru melengkapi alat meta-framework seperti [Volar](https://volarjs.dev/) dan [Nitro](https://nitro.unjs.io/). Tim Rollup merilis [Rollup 4](https://rollupjs.org) pada hari yang sama, sebuah tradisi yang dimulai Lukas tahun lalu.

Enam bulan yang lalu, Vite 4.3 [dirilis](./announcing-vite4.md). Rilis ini secara signifikan meningkatkan kinerja server pengembangan. Namun, masih ada banyak ruang untuk perbaikan. Di ViteConf, [Evan You mengungkapkan rencana jangka panjang Vite untuk bekerja pada Rolldown](https://www.youtube.com/watch?v=hrdwQHoAp0M), sebuah port Rust dari Rollup dengan API yang kompatibel. Begitu itu siap, kami bermaksud untuk menggunakannya di Vite Core untuk menangani tugas-tugas baik dari Rollup maupun esbuild. Ini akan berarti peningkatan kinerja pembangunan (dan kemudian pada kinerja pengembangan juga saat kami memindahkan bagian-bagian yang sensitif terhadap kinerja dari Vite sendiri ke Rust), dan pengurangan besar ketidak-konsistenan antara pengembangan dan pembangunan. Saat ini Rolldown berada pada tahap awal dan tim sedang mempersiapkan untuk merilis kode sumbernya sebelum akhir tahun. Tunggu kabar selanjutnya!

Hari ini, kami menandai tonggak besar lainnya dalam perjalanan Vite. Tim [Vite](/team), [kontributor](https://github.com/vitejs/vite/graphs/contributors), dan mitra ekosistem, dengan gembira mengumumkan rilis Vite 5. Vite sekarang menggunakan [Rollup 4](https://github.com/vitejs/vite/pull/14508), yang sudah mewakili peningkatan besar dalam kinerja pembangunan. Dan juga ada opsi baru untuk meningkatkan profil kinerja server pengembangan Anda.

Vite 5 berfokus pada membersihkan API (menghapus fitur yang sudah tidak digunakan) dan menyederhanakan beberapa fitur dengan menutup beberapa masalah yang sudah lama ada, misalnya beralih `define` untuk menggunakan penggantian AST yang tepat alih-alih regex. Kami juga terus mengambil langkah-langkah untuk mempersiapkan Vite ke depan (Node.js 18+ sekarang diperlukan, dan [API Node CJS sudah dinyatakan usang](/guide/migration#deprecate-cjs-node-api)).

Quick links:

- [Dokumentasi](/)
- [Panduan Migrasi](/guide/migration)
- [Changelog](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16)

Dokumentasi dalam bahasa lain:

- [简体中文](https://cn.vitejs.dev/)
- [日本語](https://ja.vitejs.dev/)
- [Español](https://es.vitejs.dev/)
- [Português](https://pt.vitejs.dev/)
- [한국어](https://ko.vitejs.dev/)
- [Deutsch](https://de.vitejs.dev/) (terjemahan baru!)

Jika Anda baru mengenal Vite, kami menyarankan untuk membaca terlebih dahulu [Panduan Memulai](/guide/) dan [Fitur-fiturnya](/guide/features).

Kami menghargai lebih dari [850 kontributor ke Vite Core](https://github.com/vitejs/vite/graphs/contributors), dan para pemelihara dan kontributor plugin Vite, integrasi, alat, dan terjemahan yang telah membantu kami mencapai tahap ini. Kami mendorong Anda untuk terlibat dan terus memperbaiki Vite bersama kami. Anda dapat mempelajari lebih lanjut di [Panduan Berkontribusi](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md) kami. Untuk memulai, kami merekomendasikan [menangani isu-isu](https://github.com/vitejs/vite/issues), [meninjau PR](https://github.com/vitejs/vite/pulls), mengirim PR tes yang gagal berdasarkan isu terbuka, dan membantu orang lain di [Diskusi](https://github.com/vitejs/vite/discussions) dan forum bantuan Vite Land's [di sini](https://discord.com/channels/804011606160703521/1019670660856942652). Anda akan belajar banyak sepanjang jalan dan memiliki jalur yang lancar untuk berkontribusi lebih lanjut pada proyek ini. Jika Anda memiliki keraguan, bergabunglah dengan kami di [komunitas Discord](http://chat.vitejs.dev/) kami dan sapa di saluran [#contributing](https://discord.com/channels/804011606160703521/804439875226173480).

Untuk tetap terkini, ikuti kami di [Twitter](https://twitter.com/vite_js) atau [Mastodon](https://webtoo.ls/@vite).

## Memulai Cepat dengan Vite 5

Gunakan `pnpm create vite` untuk membangun proyek Vite dengan kerangka kerja pilihan Anda, atau buka template yang telah dimulai secara online untuk bermain dengan Vite 5 menggunakan [vite.new](https://vite.new). Anda juga dapat menjalankan `pnpm create vite-extra` untuk mengakses template dari kerangka kerja dan runtime lainnya (Solid, Deno, SSR, dan library starters). Template `create vite-extra` juga tersedia saat Anda menjalankan `create vite` di bawah opsi `Others`.

Perhatikan bahwa template awal Vite dimaksudkan untuk digunakan sebagai tempat bermain untuk menguji Vite dengan kerangka kerja yang berbeda. Ketika membangun proyek berikutnya, kami sarankan untuk mencapai starter yang direkomendasikan oleh masing-masing kerangka kerja. Beberapa kerangka kerja sekarang mengarahkan di `create vite` ke starter mereka juga (`create-vue` dan `Nuxt 3` untuk Vue, dan `SvelteKit` untuk Svelte).

## Dukungan Node.js

Vite tidak lagi mendukung Node.js 14 / 16 / 17 / 19, yang telah mencapai akhir dari masa dukungannya. Node.js 18 / 20+ sekarang diperlukan.

## Kinerja

Di atas perbaikan kinerja build dari Rollup 4, ada panduan baru untuk membantu Anda mengidentifikasi dan memperbaiki masalah kinerja umum di [https://vitejs.dev/guide/performance](/guide/performance).

Vite 5 juga memperkenalkan [server.warmup](/guide/performance.html#warm-up-frequently-used-files), fitur baru untuk meningkatkan waktu startup. Ini memungkinkan Anda menentukan daftar modul yang harus dipre-transformasikan segera setelah server dimulai. Ketika menggunakan [`--open` atau `server.open`](/config/server-options.html#server-open), Vite juga secara otomatis akan memanaskan titik masuk aplikasi Anda atau URL yang disediakan untuk dibuka.

## Perubahan Utama

- [Vite sekarang didukung oleh Rollup 4](/guide/migration#rollup-4)
- [API Node CJS telah ditinggalkan](/guide/migration#deprecate-cjs-node-api)
- [Strategi penggantian `define` dan `import.meta.env.*` telah diperbarui](/guide/migration#rework-define-and-import-meta-env-replacement-strategy)
- [Nilai modul eksternal SSR sekarang sesuai dengan produksi](/guide/migration#ssr-externalized-modules-value-now-matches-production)
- [`worker.plugins` sekarang merupakan fungsi](/guide/migration#worker-plugins-is-now-a-function)
- [Izinkan jalur yang mengandung `.` untuk kembali ke index.html](/guide/migration#allow-path-containing-to-fallback-to-index-html)
- [Selaraskan perilaku layanan HTML dev dan preview](/guide/migration#align-dev-and-preview-html-serving-behaviour)
- [File manifest sekarang dihasilkan di direktori `.vite` secara default](/guide/migration#manifest-files-are-now-generated-in-vite-directory-by-default)
- [Pintasan CLI memerlukan tekanan tambahan tombol `Enter`](/guide/migration#cli-shortcuts-require-an-additional-enter-press)
- [Perbarui perilaku TypeScript `experimentalDecorators` dan `useDefineForClassFields`](/guide/migration#update-experimentaldecorators-and-usedefineforclassfields-typescript-behaviour)
- [Hapus flag `--https` dan `https: true`](/guide/migration#remove-https-flag-and-https-true)
- [Hapus API `resolvePackageEntry` dan `resolvePackageData`](/guide/migration#remove-resolvepackageentry-and-resolvepackagedata-apis)
- [Hapus API yang sebelumnya sudah ditinggalkan](/guide/migration#removed-deprecated-apis)
- [Baca lebih lanjut tentang perubahan lanjutan yang memengaruhi penulis plugin dan alat](/guide/migration#advanced)

## Migrasi ke Vite 5

Kami telah bekerja dengan mitra ekosistem untuk memastikan migrasi yang lancar ke major baru ini. Sekali lagi, [vite-ecosystem-ci](https://www.youtube.com/watch?v=7L4I4lDzO48) telah menjadi sangat penting untuk membantu kami melakukan perubahan yang lebih besar sambil menghindari regresi. Kami sangat senang melihat ekosistem lain mengadopsi skema serupa untuk meningkatkan kerja sama antara proyek mereka dan para pengelola downstream.

Untuk sebagian besar proyek, pembaruan ke Vite 5 seharusnya mudah dilakukan. Tetapi kami menyarankan untuk meninjau [Panduan Migrasi yang Detail](/guide/migration) sebelum melakukan upgrade.

Pemecahan tingkat rendah dengan daftar lengkap perubahan inti Vite dapat ditemukan di [Changelog Vite 5](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16).

## Penghargaan

Vite 5 adalah hasil dari jam kerja yang panjang dari komunitas kontributor kami, pengelola downstream, penulis plugin, dan [Tim Vite](/team). Terima kasih kepada [Bjorn Lu](https://twitter.com/bluwyoo) karena memimpin proses rilis untuk major ini.

Kami juga berterima kasih kepada individu dan perusahaan yang mensponsori pengembangan Vite. [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/), dan [Astro](https://astro.build) terus berinvestasi di Vite dengan mempekerjakan anggota tim Vite. Terima kasih kepada para sponsor di [GitHub Sponsors Vite](https://github.com/sponsors/vitejs), [Open Collective Vite](https://opencollective.com/vite), dan [GitHub Sponsors Evan You](https://github.com/sponsors/yyx990803). Penyebutan khusus untuk [Remix](https://remix.run/) karena menjadi sponsor Gold dan berkontribusi kembali setelah beralih ke Vite.