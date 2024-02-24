# Perbandingan

## WMR

[WMR](https://github.com/preactjs/wmr) oleh tim Preact menyediakan serangkaian fitur yang mirip, dan dukungan Vite 2.0 untuk antarmuka plugin Rollup terinspirasi olehnya.

WMR terutama dirancang untuk proyek [Preact](https://preactjs.com/), dan menawarkan fitur yang lebih terintegrasi seperti pra-pembuatan. Dalam hal cakupan, ini lebih dekat dengan meta-framework Preact, dengan penekanan yang sama pada ukuran yang ringkas seperti Preact itu sendiri. Jika Anda menggunakan Preact, WMR kemungkinan akan menawarkan pengalaman yang lebih disesuaikan.

## @web/dev-server

[@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) (sebelumnya `es-dev-server`) adalah proyek yang bagus dan pengaturan server berbasis Koa Vite 1.0 terinspirasi olehnya.

`@web/dev-server` sedikit lebih rendah dalam hal cakupan. Ini tidak menyediakan integrasi framework resmi, dan membutuhkan penyiapan konfigurasi Rollup secara manual untuk pembangunan produksi.

Secara keseluruhan, Vite adalah alat yang lebih berpendapat / berlevel tinggi yang bertujuan untuk menyediakan alur kerja yang lebih siap pakai. Meskipun demikian, proyek payung `@web` mengandung banyak alat lain yang sangat bagus yang mungkin juga bermanfaat bagi pengguna Vite.

## Snowpack

[Snowpack](https://www.snowpack.dev/) juga merupakan server pengembangan ESM tanpa bundel, sangat mirip dalam cakupannya dengan Vite. Proyek tersebut tidak lagi dipelihara. Tim Snowpack sekarang bekerja pada [Astro](https://astro.build/), pembangun situs statis yang didukung oleh Vite. Tim Astro sekarang merupakan pemain aktif dalam ekosistem, dan mereka membantu meningkatkan Vite.

Selain perbedaan detail implementasi, kedua proyek tersebut berbagi banyak dalam hal keuntungan teknis dibandingkan dengan alat tradisional. Pengikatan dependensi Vite juga terinspirasi oleh Snowpack v1 (sekarang [`esinstall`](https://github.com/snowpackjs/snowpack/tree/main/esinstall)). Beberapa perbedaan utama antara kedua proyek tersebut tercantum dalam [Panduan Perbandingan v2](https://v2.vitejs.dev/guide/comparisons).
