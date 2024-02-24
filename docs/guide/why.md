# Mengapa Vite

## Permasalahan

Sebelum modul ES tersedia di browser, para pengembang tidak memiliki mekanisme asli untuk menulis JavaScript secara modular. Inilah sebabnya kita semua akrab dengan konsep "bundling": menggunakan alat yang menjelajah, memproses, dan menggabungkan modul sumber kita menjadi file yang dapat dijalankan di browser.

Seiring berjalannya waktu, kita telah melihat adanya alat seperti [webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org), dan [Parcel](https://parceljs.org/), yang sangat meningkatkan pengalaman pengembangan bagi pengembang frontend.

Namun, seiring kita membangun aplikasi yang semakin ambisius, jumlah JavaScript yang kita tangani juga meningkat secara dramatis. Tidak jarang untuk proyek skala besar mengandung ribuan modul. Kita mulai mengalami bottleneck kinerja untuk peralatan berbasis JavaScript: seringkali membutuhkan waktu yang tidak wajar lama (kadang-kadang hingga beberapa menit!) untuk memulai server pengembangan, dan bahkan dengan Hot Module Replacement (HMR), perubahan file dapat memakan waktu beberapa detik untuk tercermin di browser. Siklus umpan balik yang lambat ini dapat sangat memengaruhi produktivitas dan kebahagiaan para pengembang.

Vite bertujuan untuk mengatasi masalah ini dengan memanfaatkan kemajuan baru dalam ekosistem: ketersediaan modul ES asli di browser, dan munculnya alat JavaScript yang ditulis dalam bahasa kompilasi ke bahasa asli.

### Memulai Server yang Lambat

Saat memulai server pengembangan dari awal (cold-start), sebuah setup pembangunan berbasis bundler harus secara cepat merayapi dan membangun seluruh aplikasi Anda sebelum dapat disajikan.

Vite meningkatkan waktu memulai server pengembangan dengan pertama-tama membagi modul-modul dalam aplikasi menjadi dua kategori: **dependencies** dan **source code**.

- **Dependencies** sebagian besar adalah JavaScript biasa yang jarang berubah selama pengembangan. Beberapa dependencies besar (misalnya, perpustakaan komponen dengan ratusan modul) juga cukup mahal untuk diproses. Dependencies juga dapat dikirim dalam berbagai format modul (misalnya, ESM atau CommonJS).

  Vite [mempersiapkan dependencies sebelum bundling](./dep-pre-bundling) menggunakan [esbuild](https://esbuild.github.io/). esbuild ditulis dalam Go dan mempersiapkan dependencies 10-100x lebih cepat daripada bundler berbasis JavaScript.

- **Source code** seringkali berisi JavaScript yang tidak biasa yang perlu ditransformasi (misalnya, JSX, CSS, atau komponen Vue/Svelte), dan akan diedit sangat sering. Selain itu, tidak semua source code perlu dimuat pada saat yang sama (misalnya, dengan pemisahan kode berbasis rute).

  Vite melayani source code melalui [ESM bawaan](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). Ini pada dasarnya membiarkan browser mengambil bagian dari pekerjaan seorang bundler: Vite hanya perlu mentransformasi dan melayani source code sesuai permintaan, saat browser memintanya. Kode di balik impor dinamis bersyarat hanya diproses jika benar-benar digunakan pada layar saat ini.

<script setup>
import bundlerSvg from '../images/bundler.svg?raw'
import esmSvg from '../images/esm.svg?raw'
</script>
<svg-image :svg="bundlerSvg" />
<svg-image :svg="esmSvg" />

### Pembaruan yang Lambat

Ketika sebuah file diedit dalam sebuah setup pembangunan berbasis bundler, itu tidak efisien untuk membangun ulang seluruh bundel dengan alasan yang jelas: kecepatan pembaruan akan menurun secara linear seiring dengan ukuran aplikasi.

Pada beberapa bundler, server pengembangan menjalankan pembundelan di memori sehingga hanya perlu membatalkan bagian dari grafik modulnya ketika sebuah file berubah, tetapi masih perlu membangun kembali seluruh bundel dan me-reload halaman web. Membangun kembali bundel bisa mahal, dan me-reload halaman menghapus keadaan aplikasi saat ini. Inilah mengapa beberapa bundler mendukung Hot Module Replacement (HMR): memungkinkan sebuah modul untuk "hot replace" dirinya sendiri tanpa mempengaruhi bagian lain dari halaman. Ini secara signifikan meningkatkan DX - namun, dalam praktik kami telah menemukan bahwa kecepatan pembaruan HMR juga menurun secara signifikan seiring dengan pertumbuhan ukuran aplikasi.

Pada Vite, HMR dilakukan melalui native ESM. Ketika sebuah file diedit, Vite hanya perlu membatalkan dengan tepat rantai antara modul yang diedit dan batas HMR terdekatnya (sebagian besar waktu hanya modul itu sendiri), membuat pembaruan HMR tetap cepat secara konsisten tanpa memandang ukuran aplikasi Anda.

Vite juga memanfaatkan header HTTP untuk mempercepat reload halaman penuh (sekali lagi, membiarkan browser melakukan lebih banyak pekerjaan untuk kita): permintaan modul source code dibuat kondisional melalui `304 Not Modified`, dan permintaan modul dependensi di-cache dengan kuat melalui `Cache-Control: max-age=31536000,immutable` sehingga mereka tidak mengakses server lagi setelah di-cache.

Setelah Anda mengalami seberapa cepat Vite ini, kami sangat ragu Anda akan bersedia kembali menggunakan pengembangan yang dibundel.

## Mengapa Melakukan Bundel untuk Produksi

Meskipun native ESM sekarang didukung secara luas, mengirim ESM yang tidak dibundel di produksi masih tidak efisien (bahkan dengan HTTP/2) karena perjalanan jaringan tambahan yang disebabkan oleh impor bertingkat. Untuk mendapatkan kinerja pemuatan yang optimal di produksi, masih lebih baik untuk membundel kode Anda dengan tree-shaking, lazy-loading, dan common chunk splitting (untuk caching yang lebih baik).

Memastikan keluaran optimal dan konsistensi perilaku antara server pengembangan dan build produksi bukanlah hal yang mudah. Inilah mengapa Vite dikemas dengan [perintah build yang telah dikonfigurasi sebelumnya](./build) yang telah menyertakan banyak [optimisasi kinerja](./features#build-optimizations) secara langsung.

## Mengapa Tidak Membundle dengan esbuild?

API plugin saat ini Vite tidak kompatibel dengan penggunaan `esbuild` sebagai bundler. Terlepas dari `esbuild` yang lebih cepat, adopsi Vite terhadap API plugin dan infrastruktur fleksibel Rollup secara signifikan berkontribusi pada kesuksesannya dalam ekosistem. Untuk saat ini, kami percaya bahwa Rollup menawarkan pertukaran kinerja-vs-fleksibilitas yang lebih baik.

Rollup juga telah bekerja pada peningkatan kinerja, [beralih parser ke SWC di v4](https://github.com/rollup/rollup/pull/5073). Dan ada upaya berkelanjutan untuk membangun ulang Rollup dengan Rust yang disebut Rolldown. Begitu Rolldown siap, ia bisa menggantikan baik Rollup maupun esbuild di Vite, meningkatkan kinerja build secara signifikan dan menghilangkan inkonsistensi antara pengembangan dan build. Anda dapat menonton [kunci utama ViteConf 2023 Evan You untuk lebih jelasnya](https://youtu.be/hrdwQHoAp0M).

## Bagaimana Vite Berbeda dari X?

Anda dapat melihat bagian [Perbandingan](./comparisons) untuk lebih detail tentang bagaimana Vite berbeda dari alat serupa lainnya.
