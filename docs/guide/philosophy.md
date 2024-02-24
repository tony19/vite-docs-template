# Filsafat Proyek

## Inti yang Ringkas dan Dapat Diperluas

Vite tidak bermaksud untuk mencakup setiap kasus pengguna. Vite bertujuan untuk mendukung pola-pola umum dalam membangun aplikasi Web secara langsung, tetapi [inti Vite](https://github.com/vitejs/vite) harus tetap ringkas dengan permukaan API yang kecil untuk menjaga proyek tetap dapat dipelihara dalam jangka panjang. Tujuan ini dapat tercapai berkat [sistem plugin berbasis rollup pada Vite](./api-plugin.md). Fitur-fitur yang dapat diimplementasikan sebagai plugin eksternal umumnya tidak akan ditambahkan ke inti Vite. [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) adalah contoh bagus dari apa yang dapat dicapai di luar inti Vite, dan ada banyak [plugin yang terpelihara dengan baik](https://github.com/vitejs/awesome-vite#plugins) untuk mencakup kebutuhan Anda. Vite bekerja erat dengan proyek Rollup untuk memastikan bahwa plugin dapat digunakan baik dalam proyek biasa-rollup maupun proyek Vite sebanyak mungkin, berusaha untuk mendorong perluasan yang diperlukan ke API Plugin secara hulu jika memungkinkan.

## Mendorong Web Modern

Vite menyediakan fitur-fitur yang bersifat opiniatif yang mendorong penulisan kode modern. Misalnya:

- Kode sumber hanya dapat ditulis dalam ESM, di mana dependensi non-ESM perlu [dipre-bundel sebagai ESM](./dep-pre-bundling) agar dapat berfungsi.
- Pekerja web didorong untuk ditulis dengan sintaks [`new Worker`](./features#web-workers) untuk mengikuti standar modern.
- Modul Node.js tidak dapat digunakan di browser.

Saat menambahkan fitur baru, pola-pola ini diikuti untuk membuat API yang tahan terhadap masa depan, yang mungkin tidak selalu kompatibel dengan alat-alat pembangunan lainnya.

## Pendekatan Pragmatis terhadap Kinerja

Vite telah fokus pada kinerja sejak [awalnya](./why.md). Arsitektur server pengembangan Vite memungkinkan HMR yang tetap cepat saat proyek berkembang. Vite menggunakan alat-alat bawaan seperti [esbuild](https://esbuild.github.io/) dan [SWC](https://github.com/vitejs/vite-plugin-react-swc) untuk menerapkan tugas-tugas intensif tetapi tetap menjaga sebagian besar kode dalam JS untuk menyeimbangkan kecepatan dengan fleksibilitas. Ketika diperlukan, plugin-framework akan masuk ke dalam [Babel](https://babeljs.io/) untuk mengkompilasi kode pengguna. Dan selama waktu pembangunan, Vite saat ini menggunakan [Rollup](https://rollupjs.org/) di mana ukuran bundel dan memiliki akses ke berbagai plugin ekosistem lebih penting daripada kecepatan mentah. Vite akan terus berkembang secara internal, menggunakan pustaka baru saat muncul untuk meningkatkan DX sambil tetap API-nya stabil.

## Membangun Kerangka Kerja di Atas Vite

Meskipun Vite dapat digunakan langsung oleh pengguna, ia bersinar sebagai alat untuk membuat kerangka kerja. Inti Vite tidak terikat dengan kerangka kerja tertentu, tetapi ada plugin-plugin yang disempurnakan untuk setiap kerangka antarmuka pengguna. [API JS](./api-javascript.md) nya memungkinkan pengarang Kerangka Aplikasi untuk menggunakan fitur-fitur Vite untuk membuat pengalaman yang disesuaikan untuk penggunanya. Vite termasuk dukungan untuk [primitif SSR](./ssr.md), biasanya hadir dalam alat-alat tingkat tinggi tetapi mendasar untuk membangun kerangka kerja web modern. Dan plugin Vite melengkapi gambaran dengan menawarkan cara untuk berbagi antara kerangka kerja. Vite juga sangat cocok saat dipasangkan dengan [Kerangka Kerja Backend](./backend-integration.md) seperti [Ruby](https://vite-ruby.netlify.app/) dan [Laravel](https://laravel.com/docs/10.x/vite).

## Ekosistem yang Aktif

Evolusi Vite adalah kerja sama antara pengelola kerangka kerja dan plugin, pengguna, dan tim Vite. Kami mendorong partisipasi aktif dalam pengembangan Inti Vite begitu sebuah proyek mengadopsi Vite. Kami bekerja sama dengan proyek-proyek utama dalam ekosistem untuk meminimalkan regresi pada setiap rilis, dibantu oleh alat seperti [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci). Ini memungkinkan kami menjalankan CI dari proyek-proyek besar menggunakan Vite pada PR terpilih dan memberikan status yang jelas tentang bagaimana Ekosistem akan bereaksi terhadap sebuah rilis. Kami berusaha untuk memperbaiki regresi sebelum mempengaruhi pengguna dan memungkinkan proyek untuk memperbarui ke versi berikutnya segera setelah dirilis. Jika Anda bekerja dengan Vite, kami mengundang Anda untuk bergabung dengan [Discord Vite](https://chat.vitejs.dev) dan terlibat dalam proyek juga.
