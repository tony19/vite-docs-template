# Kinerja

Meskipun Vite secara default cepat, masalah kinerja bisa muncul seiring dengan bertumbuhnya kebutuhan proyek. Panduan ini bertujuan untuk membantu Anda mengidentifikasi dan memperbaiki masalah kinerja umum, seperti:

- Memulai server yang lambat
- Memuat halaman yang lambat
- Membangun yang lambat

## Hindari Ekstensi Browser

Beberapa ekstensi browser mungkin mengganggu permintaan dan memperlambat waktu mulai dan muat ulang untuk aplikasi besar, terutama saat menggunakan alat pengembangan browser. Kami merekomendasikan membuat profil khusus untuk pengembangan tanpa ekstensi, atau beralih ke mode incognito, saat menggunakan server pengembangan Vite dalam kasus-kasus ini. Mode incognito juga seharusnya lebih cepat daripada profil reguler tanpa ekstensi.

## Audit Plugin Vite yang Dikonfigurasi

Plugin internal dan resmi Vite dioptimalkan untuk melakukan sedikit pekerjaan mungkin sambil menyediakan kompatibilitas dengan ekosistem yang lebih luas. Misalnya, transformasi kode menggunakan regex di pengembangan, tetapi melakukan parse lengkap di build untuk memastikan kebenaran.

Namun, kinerja plugin komunitas berada di luar kendali Vite, yang dapat memengaruhi pengalaman pengembang. Berikut adalah beberapa hal yang perlu Anda perhatikan saat menggunakan plugin Vite tambahan:

1. Ketergantungan besar yang hanya digunakan dalam beberapa kasus seharusnya diimpor secara dinamis untuk mengurangi waktu mulai Node.js. Contoh refaktorisasi: [vite-plugin-react#212](https://github.com/vitejs/vite-plugin-react/pull/212) dan [vite-plugin-pwa#224](https://github.com/vite-pwa/vite-plugin-pwa/pull/244).

2. Hook `buildStart`, `config`, dan `configResolved` seharusnya tidak menjalankan operasi yang panjang dan ekstensif. Hook ini menunggu selama startup server pengembangan, yang menunda kapan Anda dapat mengakses situs di browser.

3. Hook `resolveId`, `load`, dan `transform` dapat menyebabkan beberapa file memuat lebih lambat dari yang lain. Meskipun terkadang tidak dapat dihindari, masih layak untuk memeriksa area yang mungkin dapat dioptimalkan. Misalnya, memeriksa apakah `code` berisi kata kunci tertentu, atau apakah `id` cocok dengan ekstensi tertentu, sebelum melakukan transformasi lengkap.

   Semakin lama proses transformasi file berlangsung, semakin signifikan waterfall permintaan yang akan terjadi saat memuat situs di browser.

   Anda dapat memeriksa durasi yang diperlukan untuk mentransformasi sebuah file menggunakan `DEBUG="vite:plugin-transform" vite` atau [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect). Perhatikan bahwa karena operasi asinkron cenderung memberikan estimasi waktu yang tidak akurat, Anda harus memperlakukan angka tersebut sebagai perkiraan kasar, tetapi masih dapat mengungkapkan operasi yang lebih mahal.

::: tip Profil
Anda dapat menjalankan `vite --profile`, mengunjungi situs, dan menekan `p + enter` di terminal Anda untuk merekam `.cpuprofile`. Alat seperti [speedscope](https://www.speedscope.app) kemudian dapat digunakan untuk memeriksa profil dan mengidentifikasi bottleneck. Anda juga dapat [membagikan profil](https://chat.vitejs.dev) dengan tim Vite untuk membantu kami mengidentifikasi masalah kinerja.
:::

## Kurangi Operasi Resolve

Resolusi jalur impor dapat menjadi operasi yang mahal ketika sering mengalami kasus terburuk. Sebagai contoh, Vite mendukung "menebak" jalur impor dengan opsi [`resolve.extensions`](/config/shared-options.md#resolve-extensions), yang defaultnya adalah `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`.

Ketika Anda mencoba mengimpor `./Component.jsx` dengan `import './Component'`, Vite akan menjalankan langkah-langkah berikut untuk meresolusinya:

1. Periksa apakah `./Component` ada, tidak.
2. Periksa apakah `./Component.mjs` ada, tidak.
3. Periksa apakah `./Component.js` ada, tidak.
4. Periksa apakah `./Component.mts` ada, tidak.
5. Periksa apakah `./Component.ts` ada, tidak.
6. Periksa apakah `./Component.jsx` ada, iya!

Seperti yang ditunjukkan, total 6 pemeriksaan sistem file diperlukan untuk meresolusi jalur impor. Semakin banyak impor implisit yang Anda miliki, semakin banyak waktu yang dibutuhkan untuk meresolusi jalur-jalur tersebut.

Oleh karena itu, biasanya lebih baik untuk eksplisit dalam jalur impor Anda, misalnya `import './Component.jsx'`. Anda juga dapat menyempitkan daftar untuk `resolve.extensions` untuk mengurangi pemeriksaan sistem file secara umum, tetapi Anda harus memastikan bahwa ini berfungsi untuk file-file di `node_modules` juga.

Jika Anda adalah penulis plugin, pastikan hanya memanggil [`this.resolve`](https://rollupjs.org/plugin-development/#this-resolve) saat diperlukan untuk mengurangi jumlah pemeriksaan di atas.

::: tip TypeScript
Jika Anda menggunakan TypeScript, aktifkan `"moduleResolution": "bundler"` dan `"allowImportingTsExtensions": true` dalam `compilerOptions` `tsconfig.json` Anda untuk menggunakan ekstensi `.ts` dan `.tsx` langsung dalam kode Anda.
:::

## Hindari Berkas Barrel

Berkas barrel adalah berkas yang mengekspor kembali API dari berkas lain dalam direktori yang sama. Sebagai contoh:

```js
// src/utils/index.js
export * from './color.js'
export * from './dom.js'
export * from './slash.js'
```

Ketika Anda hanya mengimpor satu API individu, misalnya `import { slash } from './utils'`, semua berkas dalam berkas barrel itu perlu diambil dan diubah karena mereka mungkin berisi API `slash` dan juga mungkin berisi efek samping yang dijalankan saat inisialisasi. Ini berarti Anda memuat lebih banyak berkas daripada yang diperlukan pada muatan halaman awal, yang mengakibatkan muatan halaman yang lebih lambat.

Jika memungkinkan, sebaiknya hindari berkas barrel dan impor API individunya secara langsung, misalnya `import { slash } from './utils/slash.js'`. Anda dapat membaca [issue #8237](https://github.com/vitejs/vite/issues/8237) untuk informasi lebih lanjut.

## Hangatkan Berkas yang Sering Digunakan

Server pengembangan Vite hanya mentransformasi berkas sesuai permintaan dari browser, yang memungkinkannya untuk memulai dengan cepat dan hanya menerapkan transformasi untuk berkas yang digunakan. Server juga dapat melakukan pre-transformasi berkas jika mengantisipasi bahwa beberapa berkas akan diminta segera. Namun, request waterfalls masih bisa terjadi jika beberapa berkas memakan waktu lebih lama untuk ditransformasi daripada yang lain. Sebagai contoh:

Diberikan grafik impor di mana berkas kiri mengimpor berkas kanan:

```
main.js -> BigComponent.vue -> big-utils.js -> large-data.json
```

Hubungan impor hanya dapat diketahui setelah berkas ditransformasi. Jika `BigComponent.vue` membutuhkan waktu untuk ditransformasi, `big-utils.js` harus menunggu giliran, dan seterusnya. Ini menyebabkan adanya waterfall internal bahkan dengan pre-transformasi yang sudah dibangun.

Vite memungkinkan Anda untuk "menghangatkan" (warm up) berkas yang Anda tahu sering digunakan, misalnya `big-utils.js`, menggunakan opsi [`server.warmup`](/config/server-options.md#server-warmup). Dengan cara ini, `big-utils.js` akan siap dan di-cache untuk disajikan segera saat diminta.

Anda dapat menemukan berkas yang sering digunakan dengan menjalankan `DEBUG="vite:transform" vite` dan memeriksa log:

```bash
vite:transform 28.72ms /@vite/client +1ms
vite:transform 62.95ms /src/components/BigComponent.vue +1ms
vite:transform 102.54ms /src/utils/big-utils.js +1ms
```

```js
export default defineConfig({
  server: {
    warmup: {
      clientFiles: [
        './src/components/BigComponent.vue',
        './src/utils/big-utils.js',
      ],
    },
  },
})
```

Perhatikan bahwa Anda hanya seharusnya "menghangatkan" (warm up) berkas yang sering digunakan untuk tidak memberatkan server pengembangan Vite saat startup. Periksa opsi [`server.warmup`](/config/server-options.md#server-warmup) untuk informasi lebih lanjut.

Menggunakan [`--open` atau `server.open`](/config/server-options.html#server-open) juga memberikan peningkatan kinerja, karena Vite akan secara otomatis "menghangatkan" (warm up) titik masuk aplikasi Anda atau URL yang diberikan untuk dibuka.

## Gunakan Alat yang Lebih Sederhana atau Native

Menjaga Vite tetap cepat dengan kode basis yang berkembang adalah tentang mengurangi jumlah pekerjaan untuk berkas sumber (JS/TS/CSS).

Contoh melakukan pekerjaan yang lebih sedikit:

- Gunakan CSS daripada Sass/Less/Stylus jika memungkinkan (penyusunan dapat ditangani oleh PostCSS)
- Jangan mengubah SVG menjadi komponen kerangka UI (React, Vue, dll). Impor mereka sebagai string atau URL saja.
- Ketika menggunakan `@vitejs/plugin-react`, hindari konfigurasi opsi Babel, sehingga proses transformasi dilewati selama pembangunan (hanya esbuild yang akan digunakan).

Contoh menggunakan alat bawaan:

Menggunakan alat bawaan sering kali membawa ukuran instalasi yang lebih besar dan karena itu tidak menjadi default saat memulai proyek Vite baru. Tetapi mungkin sepadan dengan biaya untuk aplikasi yang lebih besar.

- Coba dukungan eksperimental untuk [LightningCSS](https://github.com/vitejs/vite/discussions/13835)
- Gunakan [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react-swc) sebagai pengganti `@vitejs/plugin-react`.
