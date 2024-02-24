# Troubleshooting

Lihat [panduan pemecahan masalah Rollup](https://rollupjs.org/troubleshooting/) untuk informasi lebih lanjut juga.

Jika saran di sini tidak berhasil, coba posting pertanyaan di [Diskusi GitHub](https://github.com/vitejs/vite/discussions) atau di saluran `#help` dari [Vite Land Discord](https://chat.vitejs.dev).

## CJS

### Vite CJS Node API sudah tidak didukung

Build CJS dari API Node Vite sudah tidak didukung dan akan dihapus dalam Vite 6. Lihat [diskusi GitHub](https://github.com/vitejs/vite/discussions/13928) untuk konteks lebih lanjut. Anda harus memperbarui file atau kerangka kerja Anda untuk mengimpor build ESM dari Vite sebagai gantinya.

Dalam proyek Vite dasar, pastikan:

1. Konten file `vite.config.js` menggunakan sintaks ESM.
2. File `package.json` terdekat memiliki `"type": "module"`, atau gunakan ekstensi `.mjs`/`.mts`, misalnya `vite.config.mjs` atau `vite.config.mts`.

Untuk proyek lain, ada beberapa pendekatan umum:

- **Konfigurasi ESM sebagai default, menggunakan CJS jika diperlukan:** Tambahkan `"type": "module"` dalam `package.json` proyek. Semua file `*.js` sekarang diinterpretasikan sebagai ESM dan perlu menggunakan sintaks ESM. Anda dapat mengubah nama file dengan ekstensi `.cjs` untuk tetap menggunakan CJS.
- **Menjaga CJS sebagai default, menggunakan ESM jika diperlukan:** Jika `package.json` proyek tidak memiliki `"type": "module"`, semua file `*.js` diinterpretasikan sebagai CJS. Anda dapat mengubah nama file dengan ekstensi `.mjs` untuk menggunakan ESM sebagai gantinya.
- **Mengimpor Vite secara dinamis:** Jika Anda perlu tetap menggunakan CJS, Anda dapat mengimpor Vite secara dinamis menggunakan `import('vite')` sebagai gantinya. Ini memerlukan kode Anda ditulis dalam konteks `async`, tetapi seharusnya masih dapat dikelola karena API Vite sebagian besar bersifat asinkron.

Jika Anda tidak yakin dari mana peringatan ini berasal, Anda dapat menjalankan skrip Anda dengan flag `VITE_CJS_TRACE=true` untuk mencatat jejak stack:

```bash
VITE_CJS_TRACE=true vite dev
```

Jika Anda ingin mengabaikan peringatan sementara, Anda dapat menjalankan skrip Anda dengan flag `VITE_CJS_IGNORE_WARNING=true`:

```bash
VITE_CJS_IGNORE_WARNING=true vite dev
```

Perhatikan bahwa file konfigurasi postcss belum mendukung ESM + TypeScript (`.mts` atau `.ts` dalam `"type": "module"`) belum. Jika Anda memiliki konfigurasi postcss dengan `.ts` dan menambahkan `"type": "module"` ke `package.json`, Anda juga perlu mengubah nama konfigurasi postcss untuk menggunakan `.cts`.

## CLI

### `Error: Cannot find module 'C:\foo\bar&baz\vite\bin\vite.js'`

Jalur ke folder proyek Anda mungkin mencakup `&`, yang tidak berfungsi dengan `npm` di Windows ([npm/cmd-shim#45](https://github.com/npm/cmd-shim/issues/45)).

Anda perlu melakukan salah satu dari:

- Beralih ke manajer paket lain (misalnya `pnpm`, `yarn`)
- Hapus `&` dari jalur ke proyek Anda

## Konfigurasi

### Paket ini hanya ESM

Ketika mengimpor paket hanya ESM dengan `require`, kesalahan berikut terjadi.

> Gagal memecahkan "foo". Paket ini hanya ESM tetapi mencoba untuk dimuat dengan `require`.

> "foo" dipecahkan menjadi file ESM. File ESM tidak dapat dimuat dengan `require`.

File ESM tidak dapat dimuat dengan [`require`](<https://nodejs.org/docs/latest-v18.x/api/esm.html#require:~:text=Using%20require%20to%20load%20an%20ES%20module%20is%20not%20supported%20because%20ES%20modules%20have%20asynchronous%20execution.%20Instead%2C%20use%20import()%20to%20load%20an%20ES%20module%20from%20a%20CommonJS%20module.>).

Kami merekom

endasikan untuk mengonversi konfigurasi Anda menjadi ESM dengan cara:

- menambahkan `"type": "module"` ke `package.json` terdekat
- mengubah nama `vite.config.js`/`vite.config.ts` menjadi `vite.config.mjs`/`vite.config.mts`

## Server Pengembangan

### Permintaan Terhenti Selamanya

Jika Anda menggunakan Linux, batasan deskriptor file dan batasan inotify mungkin menyebabkan masalah. Karena Vite tidak membundle sebagian besar file, browser dapat meminta banyak file yang memerlukan banyak deskriptor file, melebihi batas.

Untuk memecahkan masalah ini:

- Tingkatkan batasan deskriptor file dengan `ulimit`

  ```shell
  # Periksa batasan saat ini
  $ ulimit -Sn
  # Ubah batasan (sementara)
  $ ulimit -Sn 10000 # Anda mungkin perlu mengubah batas keras juga
  # Mulai ulang browser Anda
  ```

- Tingkatkan batasan terkait inotify berikut dengan `sysctl`

  ```shell
  # Periksa batasan saat ini
  $ sysctl fs.inotify
  # Ubah batasan (sementara)
  $ sudo sysctl fs.inotify.max_queued_events=16384
  $ sudo sysctl fs.inotify.max_user_instances=8192
  $ sudo sysctl fs.inotify.max_user_watches=524288
  ```

Jika langkah-langkah di atas tidak berhasil, Anda dapat mencoba menambahkan `DefaultLimitNOFILE=65536` sebagai konfigurasi yang tidak di-komentari ke file-file berikut:

- /etc/systemd/system.conf
- /etc/systemd/user.conf

Untuk Ubuntu Linux, Anda mungkin perlu menambahkan baris `* - nofile 65536` ke file `/etc/security/limits.conf` daripada memperbarui file konfigurasi systemd.

Perhatikan bahwa pengaturan ini persisten tetapi **memerlukan restart**.

### Permintaan Jaringan Berhenti Memuat

Saat menggunakan sertifikat SSL yang ditandai sendiri, Chrome mengabaikan semua arahan caching dan memuat ulang konten. Vite bergantung pada arahan caching ini.

Untuk memecahkan masalah tersebut, gunakan sertifikat SSL yang terpercaya.

Lihat: [Masalah Cache](https://helpx.adobe.com/mt/experience-manager/kb/cache-problems-on-chrome-with-SSL-certificate-errors.html), [Masalah Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=110649#c8)

#### macOS

Anda dapat menginstal sertifikat yang terpercaya melalui CLI dengan perintah ini:

```
security add-trusted-cert -d -r trustRoot -k ~/Library/Keychains/login.keychain-db your-cert.cer
```

Atau, dengan mengimpor ke aplikasi Keychain Access dan memperbarui kepercayaan sertifikat Anda menjadi "Selalu Percaya."

### 431 Permintaan Header Terlalu Besar

Ketika server / server WebSocket menerima header HTTP yang besar, permintaan akan dibuang dan peringatan berikut akan ditampilkan.

> Server merespons dengan kode status 431. Lihat https://vitejs.dev/guide/troubleshooting.html#_431-request-header-fields-too-large.

Ini karena Node.js membatasi ukuran header permintaan untuk meredam [CVE-2018-12121](https://www.cve.org/CVERecord?id=CVE-2018-12121).

Untuk menghindari ini, coba kurangi ukuran header permintaan Anda. Misalnya, jika cookie panjang, hapus itu. Atau Anda dapat menggunakan [`--max-http-header-size`](https://nodejs.org/api/cli.html#--max-http-header-sizesize) untuk mengubah ukuran header maksimum.

## HMR

### Vite Mendeteksi Perubahan Berkas tetapi HMR Tidak Berfungsi

Mungkin Anda mengimpor sebuah berkas dengan huruf kapital yang berbeda. Misalnya, `src/foo.js` ada dan `src/bar.js` berisi:

```js
import './Foo.js' // seharusnya './foo.js'
```

Issue terkait: [#964](https://github.com/vitejs/vite/issues/964)

### Vite Tidak Mendeteksi Perubahan Berkas

Jika Anda menjalankan Vite dengan WSL2, Vite tidak dapat memantau perubahan berkas dalam beberapa kondisi. Lihat opsi [`server.watch`](/config/server-options.md#server-watch).

### Terjadi Pemuatan Ulang Penuh Alih-alih HMR

Jika HMR tidak ditangani oleh Vite atau plugin, pemuatan ulang penuh akan terjadi karena itu adalah satu-satunya cara untuk menyegarkan status.

Jika HMR ditangani tetapi berada dalam dependensi sirkular, pemuatan ulang penuh juga akan terjadi untuk memulihkan urutan eksekusi. Untuk memecahkan masalah ini, coba pecahkan loop. Anda dapat menjalankan `vite --debug hmr` untuk mencatat jalur dependensi sirkular jika perubahan berkas memicunya.

## Build

### Berkas yang Dibangun Tidak Berfungsi karena Kesalahan CORS

Jika keluaran berkas HTML dibuka dengan protokol `file`, skrip tidak akan berjalan dengan kesalahan berikut.

> Access to script at 'file:///foo/bar.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted.

> Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///foo/bar.js. (Reason: CORS request not http).

Lihat [Reason: CORS request not HTTP - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp) untuk informasi lebih lanjut mengenai mengapa ini terjadi.

Anda perlu mengakses berkas dengan protokol `http`. Cara termudah untuk mencapainya adalah dengan menjalankan `npx vite preview`.

## Dependensi yang Dioptimalkan

### Dependensi pra-bundel usang saat menghubungkan ke paket lokal

Kunci hash yang digunakan untuk membatalkan dependensi yang dioptimalkan tergantung pada konten kunci paket, patch yang diterapkan pada dependensi, dan opsi dalam file konfigurasi Vite yang memengaruhi pengikatan modul node. Ini berarti bahwa Vite akan mendeteksi ketika sebuah dependensi digantikan menggunakan fitur seperti [npm overrides](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides), dan akan mem-bundle kembali dependensi Anda pada mulai server berikutnya. Vite tidak akan membatalkan dependensi saat Anda menggunakan fitur seperti [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link). Jika Anda menghubungkan atau memutuskan hubungan dengan sebuah dependensi, Anda perlu memaksa re-optimisasi pada mulai server berikutnya dengan menggunakan `vite --force`. Kami sarankan untuk menggunakan overrides, yang sekarang didukung oleh setiap manajer paket (lihat juga [npm overrides](https://pnpm.io/package_json#pnpmoverrides) dan [yarn resolutions](https://yarnpkg.com/configuration/manifest/#resolutions)).

## Engkel Lebih Lambat

Jika Anda mengalami bottleneck kinerja aplikasi yang mengakibatkan waktu muat yang lambat, Anda dapat memulai inspektor Node.js bawaan dengan server pengembangan Vite atau saat membangun aplikasi Anda untuk membuat profil CPU:

::: code-group

```bash [server pengembangan]
vite --profile --open
```

```bash [membangun]
vite build --profile
```

:::

::: tip Server Pengembangan Vite
Setelah aplikasi Anda dibuka di browser, tunggu hingga selesai memuatnya, kemudian kembali ke terminal dan tekan tombol `p` (akan menghentikan inspektur Node.js) lalu tekan tombol `q` untuk menghentikan server pengembangan.
:::

Inspektur Node.js akan menghasilkan `vite-profile-0.cpuprofile` di folder root, buka https://www.speedscope.app/, dan unggah profil CPU menggunakan tombol `BROWSE` untuk memeriksa hasilnya.

Anda dapat menginstal [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect), yang memungkinkan Anda memeriksa status intermediat dari plugin Vite dan juga dapat membantu Anda mengidentifikasi plugin atau middlewares mana yang menjadi bottleneck dalam aplikasi Anda. Plugin ini dapat digunakan dalam mode pengembangan dan pembangunan. Periksa file readme untuk informasi lebih lanjut.

## Lainnya

### Modul Di-eksternalisasi untuk Kompatibilitas Browser

Ketika Anda menggunakan modul Node.js di browser, Vite akan menghasilkan peringatan berikut.

> Modul "fs" telah di-eksternalisasi untuk kompatibilitas browser. Tidak dapat mengakses "fs.readFile" dalam kode klien.

Hal ini karena Vite tidak secara otomatis mempolyfill modul Node.js.

Kami menyarankan untuk menghindari modul Node.js untuk kode browser untuk mengurangi ukuran bundel, meskipun Anda dapat menambahkan polyfill secara manual. Jika modul diimpor dari pustaka pihak ketiga (yang dimaksudkan untuk digunakan di browser), disarankan untuk melaporkan masalah ini ke pustaka yang bersangkutan.

### Terjadi Kesalahan Syntax / Tipe

Vite tidak dapat menangani dan tidak mendukung kode yang hanya berjalan pada mode non-strict (mode longgar). Hal ini karena Vite menggunakan ESM dan selalu [mode ketat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) di dalam ESM.

Sebagai contoh, Anda mungkin melihat kesalahan berikut.

> [ERROR] Pernyataan With tidak dapat digunakan dengan format keluaran "esm" karena mode ketat

> TypeError: Tidak dapat membuat properti 'foo' pada boolean 'false'

Jika kode ini digunakan di dalam dependensi, Anda bisa menggunakan [`patch-package`](https://github.com/ds300/patch-package) (atau [`yarn patch`](https://yarnpkg.com/cli/patch) atau [`pnpm patch`](https://pnpm.io/cli/patch)) sebagai sarana penghindaran.

### Ekstensi Browser

Beberapa ekstensi browser (seperti pemblokir iklan) mungkin mencegah klien Vite mengirim permintaan ke server pengembangan Vite. Anda mungkin melihat layar putih tanpa kesalahan yang tercatat dalam kasus ini. Cobalah menonaktifkan ekstensi jika Anda mengalami masalah ini.

### Tautan silang drive di Windows

Jika ada tautan silang drive dalam proyek Anda di Windows, Vite mungkin tidak akan berfungsi.

Contoh tautan silang drive adalah:

- sebuah drive virtual yang dihubungkan ke folder dengan perintah `subst`
- sebuah symlink/junction ke drive yang berbeda dengan perintah `mklink` (mis., Cache global Yarn)

Issue terkait: [#10802](https://github.com/vitejs/vite/issues/10802)
