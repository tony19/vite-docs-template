---
title: Vite 4.3 Telah Dirilis!
author:
  name: The Vite Team
date: 2023-04-20
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 4.3
  - - meta
    - property: og:image
      content: https://vitejs.dev/og-image-announcing-vite4-3.png
  - - meta
    - property: og:url
      content: https://vitejs.dev/blog/announcing-vite4-3
  - - meta
    - property: og:description
      content: Vite 4.3 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 4.3 Telah Dirilis!

_20 April 2023_

![Gambar Sampul Pengumuman Vite 4.3](/og-image-announcing-vite4-3.png)

Tautan Cepat:

- Dokumentasi: [Bahasa Inggris](/), [简体中文](https://cn.vitejs.dev/), [日本語](https://ja.vitejs.dev/), [Español](https://es.vitejs.dev/), [Português](https://pt.vitejs.dev/)
- [Catatan Perubahan Vite 4.3](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#430-2023-04-20)

## Penyempurnaan Kinerja

Pada versi kecil ini, kami berfokus pada peningkatan kinerja server pengembangan. Logika penyelesaian telah disederhanakan, meningkatkan jalur panas dan menerapkan caching yang lebih cerdas untuk menemukan `package.json`, file konfigurasi TS, dan URL yang diselesaikan secara umum.

Anda dapat membaca penjelasan rinci tentang pekerjaan kinerja yang dilakukan dalam pos blog ini oleh salah satu Kontributor Vite: [Bagaimana kami membuat Vite 4.3 lebih cepat 🚀](https://sun0day.github.io/blog/vite/why-vite4_3-is-faster.html).

Sprint ini menghasilkan peningkatan kecepatan di seluruh papan dibandingkan dengan Vite 4.2.

Berikut adalah peningkatan kinerja yang diukur oleh [sapphi-red/performance-compare](https://github.com/sapphi-red/performance-compare), yang menguji sebuah aplikasi dengan 1000 Komponen React waktu startup server pengembangan dingin dan hangat serta waktu HMR untuk komponen root dan daun:

| **Vite (babel)**   |  Vite 4.2 | Vite 4.3 | Peningkatan |
| :----------------- | --------: | -------: | ----------: |
| **startup dingin** | 17249.0ms | 5132.4ms |      -70.2% |
| **startup hangat** |  6027.8ms | 4536.1ms |      -24.7% |
| **HMR Root**       |    46.8ms |   26.7ms |      -42.9% |
| **HMR Daun**       |    27.0ms |   12.9ms |      -52.2% |

| **Vite (swc)**     |  Vite 4.2 | Vite 4.3 | Peningkatan |
| :----------------- | --------: | -------: | ----------: |
| **startup dingin** | 13552.5ms | 3201.0ms |      -76.4% |
| **startup hangat** |  4625.5ms | 2834.4ms |      -38.7% |
| **HMR Root**       |    30.5ms |   24.0ms |      -21.3% |
| **HMR Daun**       |    16.9ms |   10.0ms |      -40.8% |

![Perbandingan waktu startup Vite 4.3 vs 4.2](/vite4-3-startup-time.png)

![Perbandingan waktu HMR Vite 4.3 vs 4.2](/vite4-3-hmr-time.png)

Anda dapat membaca informasi lebih lanjut tentang benchmark [di sini](https://gist.github.com/sapphi-red/25be97327ee64a3c1dce793444afdf6e). Spesifikasi dan Versi untuk pengujian kinerja ini:

- CPU: Ryzen 9 5900X, Memori: DDR4-3600 32GB, SSD: WD Blue SN550 NVME SSD
- Windows 10 Pro 21H2 19044.2846
- Node.js 18.16.0
- Versi Vite dan Plugin React
  - Vite 4.2 (babel): Vite 4.2.1 + plugin-react 3.1.0
  - Vite 4.3 (babel): Vite 4.3.0 + plugin-react 4.0.0-beta.1
  - Vite 4.2 (swc): Vite 4.2.1 + plugin-react-swc 3.2.0
  - Vite 4.3 (swc): Vite 4.3.0 + plugin-react-swc 3.3.0

Pengguna awal juga melaporkan adanya peningkatan waktu awal pengembangan sebesar 1.5x-2x pada aplikasi nyata saat menguji beta Vite 4.3. Kami sangat ingin mengetahui hasilnya untuk aplikasi Anda.

## Profiling

Kami akan terus bekerja pada kinerja Vite. Kami sedang mengerjakan [Alat Benchmark resmi](https://github.com/vitejs/vite-benchmark) untuk Vite yang memungkinkan kami mendapatkan metrik kinerja untuk setiap Pull Request.

Dan [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) kini memiliki lebih banyak fitur terkait kinerja untuk membantu Anda mengidentifikasi plugin atau middleware mana yang menjadi bottleneck untuk aplikasi Anda.

Menggunakan `vite --profile` (dan kemudian menekan `p`) setelah halaman dimuat akan menyimpan profil CPU dari awal server pengembangan. Anda dapat membukanya di aplikasi seperti [speedscope](https://www.speedscope.app/) untuk mengidentifikasi masalah kinerja. Dan Anda dapat membagikan temuan Anda dengan Tim Vite dalam [Diskusi](https://github.com/vitejs/vite/discussions) atau di [Discord Vite](https://chat.vitejs.dev).

## Langkah Selanjutnya

Kami memutuskan untuk melakukan satu Pembaruan Mayor Vite tahun ini sejalan dengan [EOL Node.js 16](https://endoflife.date/nodejs) pada bulan September, dengan menghentikan dukungan untuk Node.js 14 dan 16 di dalamnya. Jika Anda ingin terlibat, kami telah memulai [Diskusi Vite 5](https://github.com/vitejs/vite/discussions/12466) untuk mengumpulkan umpan balik awal.
