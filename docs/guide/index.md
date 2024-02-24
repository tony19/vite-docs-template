# Memulai

<audio id="vite-audio">
  <source src="/vite.mp3" type="audio/mpeg">
</audio>

## Gambaran

Vite (kata bahasa Prancis yang berarti "cepat", dieja `/vit/`<button style="border:none;padding:3px;border-radius:4px;vertical-align:bottom" id="play-vite-audio" onclick="document.getElementById('vite-audio').play();"><svg style="height:2em;width:2em"><use href="/voice.svg#voice" /></svg></button>, seperti "veet") adalah sebuah alat pembangunan yang bertujuan untuk menyediakan pengalaman pengembangan yang lebih cepat dan ringan untuk proyek web modern. Ini terdiri dari dua bagian utama:

- Sebuah server pengembangan yang menyediakan [pengaya fitur lengkap](./features) di atas [modul ES asli](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), misalnya penggantian modul panas (Hot Module Replacement/HMR) yang sangat cepat [HMR (Hot Module Replacement)](./features#hot-module-replacement).

- Sebuah perintah pembangunan yang mengikat kode Anda dengan [Rollup](https://rollupjs.org), yang telah dikonfigurasi sebelumnya untuk menghasilkan aset statis yang sangat dioptimalkan untuk produksi.

Vite memiliki opini dan datang dengan default yang masuk akal dari kotak. Baca tentang apa yang mungkin dalam [Panduan Fitur](./features). Dukungan untuk kerangka kerja atau integrasi dengan alat lain memungkinkan melalui [Plugin](./using-plugins). Bagian [Seksi Konfigurasi](../config/) menjelaskan cara menyesuaikan Vite dengan proyek Anda jika diperlukan.

Vite juga sangat dapat diperluas melalui [API Plugin](./api-plugin) dan [API JavaScript](./api-javascript) dengan dukungan pengetikan penuh.

Anda dapat mempelajari lebih lanjut tentang alasan di balik proyek ini di bagian [Mengapa Vite](./why).

## Dukungan Browser

Selama pengembangan, Vite mengatur [`esnext` sebagai target transformasi](https://esbuild.github.io/api/#target), karena kami mengasumsikan bahwa browser modern digunakan dan mendukung semua fitur JavaScript dan CSS terbaru. Hal ini mencegah penurunan sintaks, membiarkan Vite melayani modul sesuai mungkin dengan kode sumber asli.

Untuk pembangunan produksi, secara default Vite menargetkan browser yang mendukung [Modul ES Asli](https://caniuse.com/es6-module), [impor dinamis ESM asli](https://caniuse.com/es6-module-dynamic-import), dan [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta). Browser warisan dapat didukung melalui plugin resmi [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy). Lihat bagian [Membangun untuk Produksi](./build) untuk lebih banyak detail.

## Mencoba Vite secara Online

Anda dapat mencoba Vite secara online di [StackBlitz](https://vite.new/). Ini menjalankan pengaturan pembangunan berbasis Vite langsung di browser, sehingga hampir identik dengan pengaturan lokal tetapi tidak memerlukan instalasi apa pun di mesin Anda. Anda dapat navigasi ke `vite.new/{template}` untuk memilih kerangka kerja apa yang ingin digunakan.

Preset template yang didukung adalah:

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://vite.new/vanilla) | [vanilla-ts](https://vite.new/vanilla-ts) |
|     [vue](https://vite.new/vue)     |     [vue-ts](https://vite.new/vue-ts)     |
|   [react](https://vite.new/react)   |   [react-ts](https://vite.new/react-ts)   |
|  [preact](https://vite.new/preact)  |  [preact-ts](https://vite.new/preact-ts)  |
|     [lit](https://vite.new/lit)     |     [lit-ts](https://vite.new/lit-ts)     |
|  [svelte](https://vite.new/svelte)  |  [svelte-ts](https://vite.new/svelte-ts)  |
|   [solid](https://vite.new/solid)   |   [solid-ts](https://vite.new/solid-ts)   |
|    [qwik](https://vite.new/qwik)    |    [qwik-ts](https://vite.new/qwik-ts)    |

## Memulai Proyek Vite Pertama Anda

::: tip Catatan Kompatibilitas
Vite memerlukan versi [Node.js](https://nodejs.org/en/) 18+. 20+. Namun, beberapa template memerlukan versi Node.js yang lebih tinggi untuk dapat berfungsi, harap tingkatkan versinya jika manajer paket Anda memberikan peringatan tentang hal tersebut.
:::

::: code-group

```bash [NPM]
$ npm create vite@latest
```

```bash [Yarn]
$ yarn create vite
```

```bash [PNPM]
$ pnpm create vite
```

```bash [Bun]
$ bun create vite
```

:::

Kemudian ikuti petunjuknya!

Anda juga dapat langsung menentukan nama proyek dan template yang ingin Anda gunakan melalui opsi baris perintah tambahan. Misalnya, untuk memulai proyek Vite + Vue, jalankan:

```bash
# npm 7+, tambahan double-dash diperlukan:
npm create vite@latest my-vue-app -- --template vue

# yarn
yarn create vite my-vue-app --template vue

# pnpm
pnpm create vite my-vue-app --template vue

# bun
bun create vite my-vue-app --template vue
```

Lihat [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) untuk lebih banyak detail tentang setiap template yang didukung: `vanilla`, `vanilla-ts`, `vue`, `vue-ts`, `react`, `react-ts`, `react-swc`, `react-swc-ts`, `preact`, `preact-ts`, `lit`, `lit-ts`, `svelte`, `svelte-ts`, `solid`, `solid-ts`, `qwik`, `qwik-ts`.

## Template Komunitas

create-vite adalah alat untuk dengan cepat memulai proyek dari template dasar untuk kerangka kerja populer. Periksa Awesome Vite untuk [template yang dipelihara komunitas](https://github.com/vitejs/awesome-vite#templates) yang mencakup alat lain atau menargetkan kerangka kerja yang berbeda.

Untuk template di `https://github.com/user/project`, Anda dapat mencobanya secara online menggunakan `https://github.stackblitz.com/user/project` (menambahkan `.stackblitz` setelah `github` pada URL proyek).

Anda juga dapat menggunakan alat seperti [degit](https://github.com/Rich-Harris/degit) untuk memulai proyek Anda dengan salah satu template. Mengasumsikan proyek berada di GitHub dan menggunakan `main` sebagai cabang default, Anda dapat membuat salinan lokal menggunakan:

```bash
npx degit user/project#main my-project
cd my-project

npm install
npm run dev
```

## `index.html` dan Root Proyek

Salah satu hal yang mungkin Anda perhatikan adalah dalam proyek Vite, `index.html` berada di pusat perhatian bukan tersembunyi di dalam `public`. Ini sengaja dilakukan: selama pengembangan Vite adalah server, dan `index.html` adalah titik masuk ke aplikasi Anda.

Vite memperlakukan `index.html` sebagai kode sumber dan bagian dari grafik modul. Ini menyelesaikan `<script type="module" src="...">` yang merujuk ke kode sumber JavaScript Anda. Bahkan inline `<script type="module">` dan CSS yang dirujuk melalui `<link href>` juga menikmati fitur khusus Vite. Selain itu, URL di dalam `index.html` secara otomatis disesuaikan sehingga tidak perlu menggunakan placeholder khusus `%PUBLIC_URL%`.

Mirip dengan server http statis, Vite memiliki konsep "direktori root" dari mana file Anda disajikan. Anda akan melihatnya dirujuk sebagai `<root>` di seluruh dokumen lainnya. URL absolut dalam kode sumber Anda akan diselesaikan menggunakan root proyek sebagai dasar, sehingga Anda dapat menulis kode seolah-olah Anda sedang bekerja dengan server file statis normal (kecuali lebih kuat!). Vite juga mampu menangani dependensi yang menyelesaikan lokasi sistem file di luar root, yang membuatnya dapat digunakan bahkan dalam setup berbasis monorepo.

Vite juga mendukung [aplikasi multi-halaman](./build#multi-page-app) dengan beberapa titik masuk `.html`.

#### Menentukan Root Alternatif

Menjalankan `vite` memulai server pengembangan menggunakan direktori kerja saat ini sebagai root. Anda dapat menentukan root alternatif dengan `vite serve some/sub/dir`.
Perhatikan bahwa Vite juga akan menyelesaikan [file konfigurasi (yaitu `vite.config.js`)](/config/#configuring-vite) di dalam root proyek, jadi Anda perlu memindahkannya jika root berubah.

## Antarmuka Baris Perintah

Dalam proyek di mana Vite diinstal, Anda dapat menggunakan biner `vite` dalam skrip npm Anda, atau menjalankannya langsung dengan `npx vite`. Berikut ini adalah skrip npm default dalam proyek Vite yang dibuat:

<!-- prettier-ignore -->
```json
{
  "scripts": {
    "dev": "vite", // memulai server pengembangan, alias: `vite dev`, `vite serve`
    "build": "vite build", // membangun untuk produksi
    "preview": "vite preview" // pratinjau lokal pembangunan produksi
  }
}
```

Anda dapat menentukan opsi CLI tambahan seperti `--port` atau `--open`. Untuk daftar lengkap opsi CLI, jalankan `npx vite --help` di proyek Anda.

Pelajari lebih lanjut tentang [Antarmuka Baris Perintah](./cli.md)

## Menggunakan Komit yang Belum Dirilis

Jika Anda tidak sabar untuk menguji fitur terbaru sebelum rilis baru, Anda perlu mengklon repo [vite](https://github.com/vitejs/vite) ke mesin lokal Anda dan kemudian membangun dan menghubungkannya sendiri ([pnpm](https://pnpm.io/) diperlukan):

```bash
git clone https://github.com/vitejs/vite.git
cd vite
pnpm install
cd packages/vite
pnpm run build
pnpm link --global # gunakan manajer paket pilihan Anda untuk langkah ini
```

Kemudian pergi ke proyek berbasis Vite Anda dan jalankan `pnpm link --global vite` (atau manajer paket yang Anda gunakan untuk menghubungkan `vite` secara global). Sekarang mulai ulang server pengembangan untuk menggunakan fitur terbaru!

## Komunitas

Jika Anda memiliki pertanyaan atau membutuhkan bantuan, jangkau komunitas di [Discord](https://chat.vitejs.dev) dan [Diskusi GitHub](https://github.com/vitejs/vite/discussions).
