# Panduan Berkontribusi Vite

Halo! Kami sangat senang bahwa Anda tertarik untuk berkontribusi pada Vite! Sebelum mengirimkan kontribusi Anda, harap baca panduan berikut. Kami juga menyarankan Anda untuk membaca [Filsafat Proyek](https://vitejs.dev/guide/philosophy) dalam dokumentasi kami.

Anda dapat menggunakan [StackBlitz Codeflow](https://stackblitz.com/codeflow) untuk memperbaiki bug atau mengimplementasikan fitur. Anda akan melihat tombol Codeflow pada isu untuk memulai PR untuk memperbaikinya. Tombol juga akan muncul pada PR untuk meninjau mereka tanpa perlu memeriksa cabang secara lokal. Ketika menggunakan Codeflow, repositori Vite akan di-clone untuk Anda dalam editor online, dengan paket Vite dibangun dalam mode watch siap untuk menguji perubahan Anda. Jika Anda ingin mempelajari lebih lanjut, periksa [dokumentasi Codeflow](https://developer.stackblitz.com/codeflow/what-is-codeflow).

[![Buka di Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https://pr.new/vitejs/vite)

## Persiapan Repositori

Untuk mengembangkan secara lokal, fork repositori Vite dan clone di mesin lokal Anda. Repo Vite adalah monorepo yang menggunakan workspace pnpm. Manajer paket yang digunakan untuk menginstal dan mengaitkan dependensi harus [pnpm](https://pnpm.io/).

Untuk mengembangkan dan menguji paket inti `vite`:

1. Jalankan `pnpm i` di folder root Vite.

2. Jalankan `pnpm run build` di folder root Vite.

3. Jika Anda sedang mengembangkan Vite itu sendiri, Anda dapat pergi ke `packages/vite` dan jalankan `pnpm run dev` untuk secara otomatis membangun ulang Vite setiap kali Anda mengubah kode-nya.

Anda juga dapat menggunakan [Vite.js Docker Dev](https://github.com/nystudio107/vitejs-docker-dev) untuk setup Docker terkotainerisasi untuk pengembangan Vite.js.

> Vite menggunakan pnpm v8. Jika Anda sedang bekerja pada beberapa proyek dengan versi pnpm yang berbeda, disarankan untuk mengaktifkan [Corepack](https://github.com/nodejs/corepack) dengan menjalankan `corepack enable`.

### Mengabaikan commit saat menjalankan `git blame`

Kami memiliki file `.git-blame-ignore-revs` untuk mengabaikan perubahan format.
Untuk membuat file ini digunakan oleh `git blame`, Anda perlu menjalankan perintah berikut.

```sh
git config --local blame.ignoreRevsFile .git-blame-ignore-revs
```

## Debugging

Untuk menggunakan breakpoint dan menjelajahi eksekusi kode, Anda dapat menggunakan fitur ["Run and Debug"](https://code.visualstudio.com/docs/editor/debugging) dari VS Code.

1. Tambahkan pernyataan `debugger` di tempat Anda ingin menghentikan eksekusi kode.

2. Klik ikon "Run and Debug" di bilah aktivitas editor, yang membuka [_tampilan Run and Debug_](https://code.visualstudio.com/docs/editor/debugging#_run-and-debug-view).

3. Klik tombol "JavaScript Debug Terminal" di _tampilan Run and Debug_, yang membuka terminal di VS Code.

4. Dari terminal tersebut, masuk ke `playground/xxx`, dan jalankan `pnpm run dev`.

5. Eksekusi akan berhenti di pernyataan `debugger`, dan Anda dapat menggunakan [toolbar Debug](https://code.visualstudio.com/docs/editor/debugging#_debug-actions) untuk melanjutkan, melangkah, dan me-restart proses...

### Mendepan Kesalahan dalam Uji Vitest Menggunakan Playwright (Chromium)

Beberapa kesalahan disembunyikan karena lapisan abstraksi dan sifat yang di-sandbox oleh Vitest, Playwright, dan Chromium. Untuk melihat apa yang sebenarnya salah dan konten konsol devtools dalam kasus-kasus tersebut, ikuti pengaturan ini:

1. Tambahkan pernyataan `debugger` ke hook `afterAll` di `playground/vitestSetup.ts`. Ini akan menghentikan eksekusi sebelum tes berhenti dan instance browser Playwright keluar.

2. Jalankan tes dengan perintah skrip `debug-serve`, yang akan mengaktifkan debug jarak jauh: `pnpm run debug-serve resolve`.

3. Tunggu devtools inspektor untuk membuka di browser Anda dan debugger untuk terlampir.

4. Di panel sumber di kolom kanan, klik tombol putar untuk melanjutkan eksekusi, dan izinkan tes berjalan, yang akan membuka instance Chromium.

5. Fokus pada instance Chromium, Anda dapat membuka devtools browser dan memeriksa konsol di sana untuk menemukan masalah yang mendasarinya.

6. Untuk menutup semuanya, cukup hentikan proses tes kembali di terminal Anda.

## Pengujian Vite terhadap paket eksternal

Anda mungkin ingin menguji salinan lokal yang dimodifikasi dari Vite Anda terhadap paket lain yang dibangun dengan Vite. Untuk pnpm, setelah membangun Vite, Anda dapat menggunakan [`pnpm.overrides`](https://pnpm.io/package_json#pnpmoverrides) untuk melakukan ini. Perhatikan bahwa `pnpm.overrides` harus ditentukan dalam `package.json` root, dan Anda harus mencantumkan paket sebagai dependensi dalam `package.json` root:

```json
{
  "dependencies": {
    "vite": "^4.0.0"
  },
  "pnpm": {
    "overrides": {
      "vite": "link:../path/to/vite/packages/vite"
    }
  }
}
```

Dan jalankan kembali `pnpm install` untuk mengaitkan paket.

## Menjalankan Pengujian

### Pengujian Integrasi

Setiap paket di bawah `playground/` berisi direktori `__tests__`. Pengujian dijalankan menggunakan [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) dengan integrasi kustom untuk membuat penulisan pengujian sederhana. Setup detailnya ada di dalam `vitest.config.e2e.js` dan file `playground/vitest*`.

Beberapa playground menentukan varian untuk menjalankan aplikasi yang sama menggunakan setup konfigurasi yang berbeda. Secara konvensi, saat menjalankan file spesifikasi tes di folder bersarang di `__tests__`, setup akan mencoba menggunakan file konfigurasi bernama `vite.config-{folderName}.js` di root playground. Anda dapat melihat contoh varian di [playground aset](https://github.com/vitejs/vite/tree/main/playground/assets).

Sebelum menjalankan pengujian, pastikan bahwa [Vite telah dibangun](#repo-setup). Di Windows, Anda mungkin ingin [mengaktifkan Mode Pengembang](https://docs.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development) untuk memecahkan [masalah dengan penciptaan symlink untuk non-admin](https://github.com/vitejs/vite/issues/7390). Selain itu, Anda mungkin ingin [mengatur git `core.symlinks` menjadi `true` untuk memecahkan masalah dengan symlink di git](https://github.com/vitejs/vite/issues/5242).

Setiap pengujian integrasi dapat dijalankan dalam mode server dev atau mode build.

- `pnpm test` secara default menjalankan setiap pengujian integrasi baik dalam mode serve maupun mode build, dan juga pengujian unit.

- `pnpm run test-serve` menjalankan pengujian hanya dalam mode serve.

- `pnpm run test-build` menjalankan pengujian hanya dalam mode build.

- `pnpm run test-serve [match]` atau `pnpm run test-build [match]` menjalankan pengujian dalam paket tertentu yang sesuai dengan filter yang diberikan. misalnya `pnpm run test-serve asset` menjalankan pengujian untuk baik `playground/asset` dan `vite/src/node/__tests__/asset` dalam mode serve.

  Catatan pencocokan paket tidak tersedia untuk skrip `pnpm test`, yang selalu menjalankan semua pengujian.

### Pengujian Unit

Selain pengujian di bawah `playground/` untuk pengujian integrasi, paket mungkin mengandung pengujian unit di bawah direktori `__tests__` mereka. Pengujian unit didukung oleh [Vitest](https://vitest.dev/). Konfigurasi detailnya ada di dalam file `vitest.config.ts`.

- `pnpm run test-unit` menjalankan pengujian unit di bawah setiap paket.

- `pnpm run test-unit [match]` menjalankan pengujian dalam paket tertentu yang sesuai dengan filter yang diberikan.

### Lingkungan Pengujian dan Pembantu

Di dalam pengujian playground, Anda dapat mengimpor objek `page` dari `~utils`, yang merupakan instans Playwright [`Page`](https://playwright.dev/docs/api/class-page) yang sudah menavigasi ke halaman yang disajikan dari playground saat ini. Jadi, menulis pengujian sesederhana ini:

```js
import { page } from '~utils'

test('should work', async () => {
  expect(await page.textContent('.foo')).toMatch('foo')
})
```

Beberapa pembantu pengujian umum (mis. `testDir`, `isBuild`, atau `editFile`) juga tersedia dalam utilitas. Kode sumbernya terletak di `playground/test-utils.ts`.

Catatan: Lingkungan pembangunan pengujian menggunakan [setelan konfigurasi Vite default yang berbeda](https://github.com/vitejs/vite/blob/main/playground/vitestSetup.ts#L102-L122) untuk menghindari transpilasi selama pengujian untuk membuatnya lebih cepat. Ini mungkin menghasilkan hasil yang berbeda dibandingkan dengan pembangunan produksi default.

### Memperluas Paket Pengujian

Untuk menambahkan pengujian baru, Anda harus menemukan playground terkait untuk perbaikan atau fitur (atau membuat yang baru). Sebagai contoh, pengujian pembebanan aset statis diuji dalam [playground aset](https://github.com/vitejs/vite/tree/main/playground/assets). Dalam aplikasi Vite ini, ada pengujian untuk impor `?raw` dengan [bagian yang ditentukan di `index.html` untuk itu](https://github.com/vitejs/vite/blob/main/playground/assets/index.html#L121):

```html
<h2>?raw import</h2>
<code class="raw"></code>
```

Ini akan dimodifikasi [dengan hasil impor file](https://github.com/vitejs/vite/blob/main/playground/assets/index.html#L151):

```js
import rawSvg from './nested/fragment.svg?raw'
text('.raw', rawSvg)
```

... di mana utilitas `text` didefinisikan sebagai:

```js
function text(el, text) {
  document.querySelector(el).textContent = text
}
```

Dalam [pengujian spesifikasi](https://github.com/vitejs/vite/blob/main/playground/assets/__tests__/assets.spec.ts#L180), modifikasi DOM yang tercantum di atas digunakan untuk menguji fitur ini:

```js
test('?raw import', async () => {
  expect(await page.textContent('.raw')).toMatch('SVG')
})
```

## Catatan tentang Dependensi Pengujian

Dalam banyak kasus pengujian, kita perlu memalsukan dependensi menggunakan protokol `link:` dan `file:`. `pnpm` memperlakukan `link:` sebagai symlink dan `file:` sebagai hardlink. Untuk menguji dependensi seolah-olah mereka disalin ke `node_modules`, gunakan protokol `file:`. Jika tidak, gunakan protokol `link:`.

Untuk dependensi palsu, pastikan Anda menambahkan awalan `@vitejs/test-` ke nama paket. Ini akan menghindari masalah yang mungkin seperti peringatan positif palsu.

## Debug Logging

Anda dapat mengatur variabel lingkungan `DEBUG` untuk mengaktifkan log debugging (mis. `DEBUG="vite:resolve"`). Untuk melihat semua log debug, Anda dapat mengatur `DEBUG="vite:*"`, tetapi peringatannya akan cukup berisik. Anda dapat menjalankan `grep -r "createDebugger('vite:" packages/vite/src/` untuk melihat daftar cakupan debug yang tersedia.

## Pedoman Pull Request

- Checkout sebuah cabang topik dari cabang dasar (mis. `main`), dan gabungkan kembali melawan cabang itu.

- Jika menambahkan fitur baru:

  - Tambahkan kasus pengujian yang sesuai.
  - Berikan alasan yang meyakinkan untuk menambahkan fitur ini. Idealnya, Anda harus membuka isu saran terlebih dahulu, dan memiliki persetujuannya sebelum bekerja pada itu.

- Jika memperbaiki bug:

  - Jika Anda memecahkan masalah khusus, tambahkan `(fix #xxxx[,#xxxx])` (#xxxx adalah id isu) di judul PR Anda untuk log rilis yang lebih baik (mis. `fix: update entities encoding/decoding (fix #3899)`).
  - Berikan deskripsi rinci tentang bug di PR. Demo langsung lebih disukai.
  - Tambahkan cakupan pengujian yang sesuai jika memungkinkan.

- Tidak apa-apa memiliki beberapa komit kecil saat Anda bekerja pada PR. GitHub dapat secara otomatis menggabungkannya sebelum digabungkan.

- Pastikan pengujian berhasil!

- Tidak perlu khawatir tentang gaya kode selama Anda telah menginstal dependensi pengembangan. Berkas yang dimodifikasi secara otomatis diformat dengan Prettier saat commit (dengan memanggil [Git Hooks](https://git-scm.com/docs/githooks) melalui [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks)).

- Judul PR harus mengikuti [konvensi pesan commit](./.github/commit-convention.md) sehingga changelog dapat dibuat secara otomatis.

## Panduan Pemeliharaan

> Bagian berikut ini sebagian besar ditujukan untuk pemelihara yang memiliki akses commit, tetapi berguna untuk dipelajari jika Anda bermaksud untuk membuat kontribusi yang tidak sepele ke kode basis.

### Alur Kerja Penanganan Masalah

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./.github/issue-workflow-dark.png">
  <img src="./.github/issue-workflow.png">
</picture>

### Alur Kerja Tinjauan Pull Request

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./.github/pr-workflow-dark.png">
  <img src="./.github/pr-workflow.png">
</picture>

## Catatan tentang Dependensi

Vite bertujuan untuk ringan, dan hal ini termasuk menyadari jumlah dependensi npm dan ukurannya.

Kami menggunakan Rollup untuk membuat bundel sebagian besar dependensi sebelum dipublikasikan! Oleh karena itu, sebagian besar dependensi, bahkan yang digunakan dalam kode sumber runtime, seharusnya ditambahkan di bawah `devDependencies` secara default. Ini juga menciptakan batasan berikut yang perlu kita perhatikan dalam kode basis.

### Penggunaan `require()`

Dalam beberapa kasus, kita sengaja menggunakan `require()` secara lambat untuk meningkatkan kinerja start-up. Namun, perlu diingat bahwa kita tidak dapat menggunakan panggilan `require('somedep')` secara sederhana karena ini diabaikan dalam file ESM, sehingga dependensinya tidak akan disertakan dalam bundel, dan dependensi sebenarnya bahkan tidak akan ada saat dipublikasikan karena mereka berada di `devDependencies`.

Sebagai gantinya, gunakan `(await import('somedep')).default`.

### Pertimbangkan Sebelum Menambahkan Dependensi

Sebagian besar dependensi seharusnya ditambahkan ke `devDependencies` bahkan jika mereka diperlukan saat runtime. Beberapa pengecualian adalah:

- Paket tipe. Contoh: `@types/*`.
- Dependensi yang tidak dapat dibundel dengan benar karena file biner. Contoh: `esbuild`.
- Dependensi yang menyertakan tipe mereka sendiri yang digunakan dalam tipe publik Vite sendiri. Contoh: `rollup`.

Hindari dependensi dengan dependensi transitif besar yang menghasilkan ukuran bengkak dibandingkan dengan fungsionalitas yang disediakannya. Sebagai contoh, `http-proxy` itu sendiri ditambah `@types/http-proxy` memiliki ukuran sedikit lebih dari 1MB, tetapi `http-proxy-middleware` menarik banyak dependensi yang membuatnya sebesar 7MB(!) ketika middleware kustom minimal di atas `http-proxy` hanya memerlukan beberapa baris kode.

### Pastikan Dukungan Tipe

Vite bertujuan untuk sepenuhnya dapat digunakan sebagai dependensi dalam proyek TypeScript (misalnya, harus menyediakan tipe yang sesuai untuk VitePress), dan juga dalam `vite.config.ts`. Ini berarti secara teknis sebuah dependensi yang tipe-tipenya diekspos harus menjadi bagian dari `dependencies` alih-alih `devDependencies`. Namun, ini juga berarti kita tidak akan dapat mem-bundelnya.

Untuk mengatasinya, kami menyisipkan beberapa tipe dependensi ini di `packages/vite/src/types`. Dengan cara ini, kami masih bisa mengekspos tipe tetapi mem-bundel kode sumber dependensi tersebut.

Gunakan `pnpm run build-types-check` untuk memeriksa bahwa tipe yang dibundel tidak bergantung pada tipe di `devDependencies`.

Untuk tipe yang dibagikan antara klien dan node, mereka harus ditambahkan ke `packages/vite/types`. Tipe-tipe ini tidak dibundel dan dipublikasikan apa adanya (meskipun masih dianggap sebagai internal). Tipe dependensi dalam direktori ini (misalnya, `packages/vite/types/chokidar.d.ts`) sudah usang dan harus ditambahkan ke `packages/vite/src/types` sebagai gantinya.

### Pertimbangkan Sebelum Menambahkan Opsi Lain

Kami sudah memiliki banyak opsi konfigurasi, dan seharusnya kita hindari memperbaiki masalah dengan menambahkan opsi baru lagi. Sebelum menambahkan opsi, pertimbangkan apakah masalahnya:

- benar-benar layak untuk diatasi
- dapat diperbaiki dengan default yang lebih cerdas
- memiliki cara kerja yang tersedia menggunakan opsi yang sudah ada
- dapat diatasi dengan plugin sebagai gantinya

## Rilis

Jika Anda memiliki akses untuk menerbitkan, langkah-langkah di bawah menjelaskan cara melakukan rilis untuk sebuah paket. Ada dua tahap untuk langkah rilis: "Rilis" dan "Publikasikan".

"Tahap Rilis" dilakukan secara lokal untuk menghasilkan changelog dan tag git:

1. Pastikan remote git untuk https://github.com/vitejs/vite diatur sebagai `origin`.
2. Di `vite` di proyek root `main` cabang, jalankan `git pull` dan `pnpm i` untuk membuatnya terbaru.
3. Jalankan `pnpm release` dan ikuti petunjuknya untuk melakukan rilis untuk sebuah paket. Ini akan menghasilkan changelog, tag rilis git, dan mendorongnya ke `origin`. Anda dapat menjalankannya dengan menggunakan flag `--dry` untuk mencobanya.
4. Ketika perintah selesai, itu akan memberikan tautan ke https://github.com/vitejs/vite/actions/workflows/publish.yml.
5. Klik tautan untuk mengunjungi halaman tersebut, dan ikuti langkah-langkah selanjutnya di bawah ini.

"Tahap Publikasikan" dilakukan di GitHub Actions untuk menerbitkan paket ke npm:

1. Dalam waktu singkat di halaman workflows, akan muncul workflow baru untuk paket yang dirilis dan menunggu persetujuan untuk dipublikasikan ke npm.
2. Klik pada workflow untuk membuka halamannya.
3. Klik tombol "Review deployments" dalam kotak kuning, sebuah popup akan muncul.
4. Periksa "Release" dan klik "Approve and deploy".
5. Paket akan mulai dipublikasikan ke npm.

## Kontribusi Terjemahan Dokumentasi

Untuk menambahkan bahasa baru ke dokumen Vite, lihat [`vite-docs-template`](https://github.com/tony19/vite-docs-template/blob/main/.github/CONTRIBUTING.md).
