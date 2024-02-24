# Rilis

Rilis Vite mengikuti [Semantic Versioning](https://semver.org/). Anda dapat melihat versi stabil terbaru dari Vite di [halaman paket npm Vite](https://www.npmjs.com/package/vite).

Changelog lengkap dari rilis-rilis sebelumnya tersedia [di GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md).

## Siklus Rilis

Vite tidak memiliki siklus rilis yang tetap.

- Rilis **Patch** dirilis sesuai kebutuhan.
- Rilis **Minor** selalu mengandung fitur-fitur baru dan juga dirilis sesuai kebutuhan. Rilis Minor selalu melalui fase pra-rilis beta.
- Rilis **Major** umumnya sejalan dengan [jadwal EOL Node.js](https://endoflife.date/nodejs), dan akan diumumkan sebelumnya. Rilis ini akan melalui fase diskusi awal, serta fase pra-rilis alpha dan beta.

Vite Major sebelumnya akan terus menerima perbaikan penting dan patch keamanan. Setelah itu, rilis hanya akan mendapatkan pembaruan jika ada kekhawatiran keamanan. Kami merekomendasikan untuk secara rutin memperbarui Vite. Periksa [Panduan Migrasi](https://vitejs.dev/guide/migration.html) saat Anda memperbarui ke setiap Major.

Tim Vite bermitra dengan proyek-proyek utama dalam ekosistem untuk menguji versi Vite baru sebelum mereka dirilis melalui [proyek vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci). Sebagian besar proyek yang menggunakan Vite seharusnya dapat dengan cepat menawarkan dukungan atau bermigrasi ke versi baru segera setelah mereka dirilis.

## Kasus Khusus Semantic Versioning

### Definisi TypeScript

Kami dapat mengirimkan perubahan yang tidak kompatibel dengan definisi TypeScript antara versi minor. Hal ini disebabkan oleh:

- Kadang-kadang TypeScript sendiri mengirimkan perubahan yang tidak kompatibel antara versi minor, dan kami mungkin harus menyesuaikan jenis untuk mendukung versi TypeScript yang lebih baru.
- Kadang-kadang kami mungkin perlu mengadopsi fitur-fitur yang hanya tersedia di versi TypeScript yang lebih baru, meningkatkan versi minimum yang diperlukan dari TypeScript.
- Jika Anda menggunakan TypeScript, Anda dapat menggunakan rentang semver yang mengunci versi minor saat ini dan memperbarui secara manual ketika versi minor Vite yang baru dirilis.

### esbuild

[esbuild](https://esbuild.github.io/) masih sebelum versi 1.0.0 dan kadang-kadang memiliki perubahan yang merusak yang mungkin perlu kami sertakan untuk mendapatkan akses ke fitur-fitur terbaru dan peningkatan kinerja. Kami mungkin meningkatkan versi esbuild dalam suatu Minor Vite.

### Versi Node.js non-LTS

Versi Node.js non-LTS (bilangan ganjil) tidak diuji sebagai bagian dari CI Vite, tetapi seharusnya masih berfungsi sebelum [EOL](https://endoflife.date/nodejs) mereka.

## Prarilis​

Rilis Minor umumnya melalui sejumlah beta releases yang tidak tetap. Rilis Major akan melalui fase alpha dan fase beta.

Prarilis memungkinkan pengguna awal dan pemelihara dari Ekosistem untuk melakukan integrasi dan pengujian stabilitas, dan memberikan umpan balik. Jangan menggunakan prarilis dalam produksi. Semua prarilis dianggap tidak stabil dan mungkin mengirimkan perubahan yang merusak di antara mereka. Selalu kunci ke versi yang tepat saat menggunakan prarilis.

## Penghapusan​

Secara berkala kami menghapus fitur-fitur yang telah digantikan oleh alternatif yang lebih baik dalam Rilis Minor. Fitur yang sudah usang akan terus berfungsi dengan jenis atau pesan peringatan yang dicatat. Mereka akan dihapus dalam rilis mayor berikutnya setelah memasuki status usang. [Panduan Migrasi](https://vitejs.dev/guide/migration.html) untuk setiap mayor akan mencantumkan penghapusan ini dan mendokumentasikan jalur peningkatannya.

## Fitur Eksperimental​

Beberapa fitur ditandai sebagai eksperimental saat dirilis dalam versi stabil Vite. Fitur eksperimental memungkinkan kami untuk mengumpulkan pengalaman dunia nyata untuk mempengaruhi desain akhir mereka. Tujuannya adalah membiarkan pengguna memberikan umpan balik dengan mengujinya di produksi. Fitur eksperimental itu sendiri dianggap tidak stabil, dan harus digunakan dengan cara yang terkendali. Fitur-fitur ini dapat berubah antara Minor, sehingga pengguna harus mengunci versi Vite mereka ketika mereka bergantung pada mereka.
