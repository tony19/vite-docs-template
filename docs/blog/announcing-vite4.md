---
title: Vite 4.0 telah dirilis!
author:
  name: The Vite Team
date: 2022-12-09
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 4
  - - meta
    - property: og:image
      content: https://vitejs.dev/og-image-announcing-vite4.png
  - - meta
    - property: og:url
      content: https://vitejs.dev/blog/announcing-vite4
  - - meta
    - property: og:description
      content: Vite 4 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 4.0 telah dirilis!

_9 Desember 2022_ - Lihat [pengumuman Vite 5.0](./announcing-vite5.md)

Vite 3 [dirilis](./announcing-vite3.md) lima bulan yang lalu. Unduhan npm per minggu telah meningkat dari 1 juta menjadi 2,5 juta sejak itu. Ekosistem ini juga telah berkembang dewasa dan terus berkembang. Dalam [survei Konfrensi Jamstack tahun ini](https://twitter.com/vite_js/status/1589665610119585793), penggunaan di antara komunitas melonjak dari 14% menjadi 32% sambil tetap mempertahankan skor kepuasan yang tinggi, yaitu 9,7. Kami melihat rilis stabil dari [Astro 1.0](https://astro.build/), [Nuxt 3](https://v3.nuxtjs.org/), dan kerangka kerja berbasis Vite lainnya yang berinovasi dan berkolaborasi: [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart), [Qwik City](https://qwik.builder.io/qwikcity/overview/). Storybook mengumumkan dukungan kelas satu untuk Vite sebagai salah satu fitur utamanya untuk [Storybook 7.0](https://storybook.js.org/blog/first-class-vite-support-in-storybook/). Deno sekarang [mendukung Vite](https://www.youtube.com/watch?v=Zjojo9wdvmY). Penerimaan [Vitest](https://vitest.dev) sedang melonjak, akan segera mewakili setengah unduhan npm Vite. Nx juga berinvestasi dalam ekosistem ini, dan [secara resmi mendukung Vite](https://nx.dev/packages/vite).

[![Ekosistem Vite 4](/ecosystem-vite4.png)](https://viteconf.org/2022/replay)

Sebagai perwujudan pertumbuhan yang dialami Vite dan proyek terkait, ekosistem Vite berkumpul pada 11 Oktober di [ViteConf 2022](https://viteconf.org/2022/replay). Kami melihat perwakilan dari kerangka kerja web utama dan alat menceritakan kisah inovasi dan kolaborasi. Dan dalam langkah simbolis, tim Rollup memilih hari itu untuk merilis [Rollup 3](https://rollupjs.org).

Hari ini, [tim](https://vitejs.dev/team) Vite dengan bantuan mitra ekosistem kami, dengan senang hati mengumumkan rilis Vite 4, didukung selama waktu pembangunan oleh Rollup 3. Kami telah bekerja dengan ekosistem untuk memastikan jalur upgrade yang lancar untuk mayor baru ini. Vite sekarang menggunakan [Rollup 3](https://github.com/vitejs/vite/issues/9870), yang memungkinkan kami untuk menyederhanakan penanganan aset internal Vite dan memiliki banyak perbaikan. Lihat [catatan rilis Rollup 3 di sini](https://github.com/rollup/rollup/releases/tag/v3.0.0).

![Gambar Sampul Pengumuman Vite 4](/og-image-announcing-vite4.png)

Tautan cepat:

- [Dokumentasi](/)
- [Panduan Migrasi](https://v4.vitejs.dev/guide/migration.html)
- [Changelog](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#400-2022-12-09)

Dokumen dalam bahasa lain:

- [简体中文](https://cn.vitejs.dev/)
- [日本語](https://ja.vitejs.dev/)
- [Español](https://es.vitejs.dev/)

Jika Anda baru saja mulai menggunakan Vite, kami sarankan membaca [Panduan Mengapa Vite](https://vitejs.dev/guide/why.html) dan melihat [Memulai](https://vitejs.dev/guide/) dan [Panduan Fitur](https://vitejs.dev/guide/features). Jika Anda ingin terlibat, kontribusi selalu diterima di [GitHub](https://github.com/vitejs/vite). Hampir [700 kolaborator](https://github.com/vitejs/vite/graphs/contributors) telah berkontribusi pada Vite. Ikuti pembaruan di [Twitter](https://twitter.com/vite_js) dan [Mastodon](https://webtoo.ls/@vite), atau bergabunglah berkolaborasi dengan yang lain di [komunitas Discord kami](http://chat.vitejs.dev/).

## Mulai Bermain dengan Vite 4

Gunakan `pnpm create vite` untuk membentuk proyek Vite dengan kerangka kerja pilihan Anda, atau buka template yang sudah dimulai secara online untuk bermain dengan Vite 4 menggunakan [vite.new](https://vite.new).

Anda juga dapat menjalankan `pnpm create vite-extra` untuk mendapatkan akses ke template dari kerangka kerja dan runtime lainnya (Solid, Deno, SSR, dan starter pustaka). Template `create vite-extra` juga tersedia saat Anda menjalankan `create vite` di bawah opsi `Others`.

Perhatikan bahwa template awal Vite dimaksudkan untuk digunakan sebagai tempat bermain untuk menguji Vite dengan kerangka kerja yang berbeda. Ketika membangun proyek Anda berikutnya, kami sarankan untuk mencapai starter yang direkomendasikan oleh masing-masing kerangka kerja. Beberapa kerangka kerja sekarang mengarahkan di `create vite` ke starter mereka juga (`create-vue` dan `Nuxt 3` untuk Vue, dan `SvelteKit` untuk Svelte).

## Plugin React Baru Menggunakan SWC Selama Pengembangan

[SWC](https://swc.rs/) sekarang merupakan pengganti yang matang untuk [Babel](https://babeljs.io/), terutama dalam konteks proyek React. Implementasi React Fast Refresh SWC jauh lebih cepat daripada Babel, dan untuk beberapa proyek, sekarang merupakan alternatif yang lebih baik. Mulai dari Vite 4, dua plugin tersedia untuk proyek React dengan trade-off yang berbeda. Kami percaya bahwa kedua pendekatan ini layak didukung pada titik ini, dan kami akan terus mengeksplorasi peningkatan untuk kedua plugin tersebut di masa depan.

### @vitejs/plugin-react

[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) adalah plugin yang menggunakan esbuild dan Babel, mencapai HMR yang cepat dengan footprint paket kecil dan fleksibilitas untuk dapat menggunakan pipeline transformasi Babel.

### @vitejs/plugin-react-swc (baru)

[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) adalah plugin baru yang menggunakan esbuild selama pembangunan, tetapi mengganti Babel dengan SWC selama pengembangan. Untuk proyek-proyek besar yang tidak memerlukan ekstensi React non-standar, waktu start awal dan Hot Module Replacement (HMR) dapat menjadi lebih cepat secara signifikan.

## Kompatibilitas Browser

Pembangunan browser modern sekarang menargetkan `safari14` secara default untuk kompatibilitas ES2020 yang lebih luas. Ini berarti bahwa pembangunan modern sekarang dapat menggunakan [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) dan bahwa operator [nullish coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) tidak lagi ditranspilasi. Jika Anda perlu mendukung browser yang lebih tua, Anda dapat menambahkan [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) seperti biasa.

## Mengimpor CSS sebagai String

Pada Vite 3, mengimpor ekspor default dari file `.css` dapat menyebabkan pemuatan ganda CSS.

```ts
import cssString from './global.css'
```

Pemuatan ganda ini dapat terjadi karena file `.css` akan dihasilkan dan kemungkinan string CSS juga akan digunakan oleh kode aplikasi — misalnya, disuntikkan oleh runtime kerangka kerja. Mulai dari Vite 4, ekspor default `.css` [telah ditinggalkan](https://github.com/vitejs/vite/issues/11094). Modifikasi akhiran kueri `?inline` perlu digunakan dalam kasus ini, karena itu tidak akan menghasilkan gaya `.css` yang diimpor.

```ts
import stuff from './global.css?inline'
```

Pelajari lebih lanjut di [Panduan Migrasi](https://v4.vitejs.dev/guide/migration.html).

## Variabel Lingkungan

Vite sekarang menggunakan `dotenv` 16 dan `dotenv-expand` 9 (sebelumnya `dotenv` 14 dan `dotenv-expand` 5). Jika Anda memiliki nilai termasuk `#` atau `` ` ``, Anda perlu membungkusnya dengan tanda kutip.

```diff
-VITE_APP=ab#cd`ef
+VITE_APP="ab#cd`ef"
```

Untuk detail lebih lanjut, lihat [catatan rilis `dotenv`](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md) dan [catatan rilis `dotenv-expand`](https://github.com/motdotla/dotenv-expand/blob/master/CHANGELOG.md).

## Fitur Lainnya

- Pintasan CLI (tekan `h` selama pengembangan untuk melihat semuanya) ([#11228](https://github.com/vitejs/vite/pull/11228))
- Dukungan untuk patch-package saat bundel pra-dependensi ([#10286](https://github.com/vitejs/vite/issues/10286))
- Output log build yang lebih bersih ([#10895](https://github.com/vitejs/vite/issues/10895)) dan beralih ke `kB` untuk menyesuaikan dengan alat pengembangan browser ([#10982](https://github.com/vitejs/vite/issues/10982))
- Pesan kesalahan yang lebih baik selama SSR ([#11156](https://github.com/vitejs/vite/issues/11156))

## Ukuran Paket yang Lebih Kecil

Vite peduli dengan jejaknya, untuk mempercepat instalasi, terutama dalam kasus penggunaan playground untuk dokumentasi dan reproduksi. Dan sekali lagi, mayor ini membawa peningkatan dalam ukuran paket Vite. Ukuran instalasi Vite 4 adalah 23% lebih kecil dibandingkan dengan vite 3.2.5 (14,1 MB vs 18,3 MB).

## Pembaruan pada Inti Vite

[Vite Core](https://github.com/vitejs/vite) dan [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) terus berkembang untuk memberikan pengalaman yang lebih baik bagi para pemelihara dan kolaborator serta memastikan bahwa pengembangan Vite dapat berkembang sesuai dengan pertumbuhan dalam ekosistem.

### Plugin Framework di Luar Inti

[`@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue) dan [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react) telah menjadi bagian dari monorepo inti Vite sejak versi pertama Vite. Ini membantu kami mendapatkan umpan balik yang cepat saat melakukan perubahan karena kami mendapatkan Core dan plugin diuji dan dirilis bersama-sama. Dengan [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) kami dapat mendapatkan umpan balik ini dengan plugin ini dikembangkan di repositori independen, sehingga mulai dari Vite 4, [mereka telah dipindahkan keluar dari monorepo inti Vite](https://github.com/vitejs/vite/pull/11158). Ini memiliki arti penting untuk cerita framework-agnostic Vite dan akan memungkinkan kami untuk membangun tim independen untuk memelihara masing-masing plugin. Jika Anda memiliki bug untuk dilaporkan atau fitur untuk diminta, silakan buat isu di repositori baru ke depannya: [`vitejs/vite-plugin-vue`](https://github.com/vitejs/vite-plugin-vue) dan [`vitejs/vite-plugin-react`](https://github.com/vitejs/vite-plugin-react).

### Peningkatan vite-ecosystem-ci

[vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) memperluas CI Vite dengan menyediakan laporan status on-demand tentang keadaan CI dari [sebagian besar proyek turunan utama](https://github.com/vitejs/vite-ecosystem-ci/tree/main/tests). Kami menjalankan vite-ecosystem-ci tiga kali seminggu terhadap cabang utama Vite dan menerima laporan tepat waktu sebelum memperkenalkan regresi. Vite 4 akan segera kompatibel dengan sebagian besar proyek yang menggunakan Vite, yang telah menyiapkan cabang dengan perubahan yang diperlukan dan akan merilisnya dalam beberapa hari ke depan. Kami juga dapat menjalankan vite-ecosystem-ci on-demand pada PR menggunakan `/ecosystem-ci run` dalam sebuah komentar, memungkinkan kami untuk mengetahui [efek perubahan](https://github.com/vitejs/vite/pull/11269#issuecomment-1343365064) sebelum mencapai cabang utama.

## Penghargaan

Vite 4 tidak akan mungkin tanpa jam kerja yang tak terhitung jumlahnya oleh kontributor Vite, banyak dari mereka pemelihara proyek turunan dan plugin, dan upaya dari [Tim Vite](/team). Kita semua telah bekerja sama untuk meningkatkan DX Vite sekali lagi, untuk setiap kerangka kerja dan aplikasi yang menggunakannya. Kami berterima kasih dapat meningkatkan dasar bersama untuk ekosistem yang begitu bersemangat.

Kami juga berterima kasih kepada individu dan perusahaan yang mensponsori tim Vite, dan perusahaan yang berinvestasi langsung dalam masa depan Vite: [@antfu7](https://twitter.com/antfu7)'s karya pada Vite dan ekosistem adalah bagian dari pekerjaannya di [Nuxt Labs](https://nuxtlabs.com/), [Astro](https://astro.build) menyokong pekerjaan inti Vite dari [@bluwyoo](https://twitter.com/bluwyoo), dan [StackBlitz](https://stackblitz.com/) mempekerjakan [@patak_dev](https://twitter.com/patak_dev) untuk bekerja penuh waktu pada Vite.

## Langkah Selanjutnya

Fokus utama kami akan menjadi penanganan masalah yang baru dibuka untuk menghindari gangguan oleh regresi yang mungkin terjadi. Jika Anda ingin terlibat dan membantu kami meningkatkan Vite, kami sarankan untuk memulai dengan penanganan masalah. Bergabunglah dengan [Discord kami](https://chat.vitejs.dev) dan jangkau di saluran `#contributing`. Perbaiki cerita `#docs` kami, dan `#help` orang lain. Kami perlu terus membangun komunitas yang membantu dan ramah untuk gelombang pengguna berikutnya, karena adopsi Vite terus berkembang.

Masih banyak bidang terbuka untuk terus meningkatkan DX semua orang yang telah memilih Vite untuk memberdayakan kerangka kerja mereka dan mengembangkan aplikasi mereka. Maju terus!
