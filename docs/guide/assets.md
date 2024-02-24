# Penanganan Aset Statis

- Terkait: [Path Dasar Publik](./build#public-base-path)
- Terkait: [Opsi konfigurasi `assetsInclude`](/config/shared-options.md#assetsinclude)

## Mengimpor Aset sebagai URL

Mengimpor aset statis akan mengembalikan URL publik yang telah diselesaikan saat disajikan:

```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

Sebagai contoh, `imgUrl` akan menjadi `/img.png` selama pengembangan, dan menjadi `/assets/img.2d8efhg.png` dalam pembangunan produksi.

Perilaku ini mirip dengan `file-loader` webpack. Perbedaannya adalah impor dapat menggunakan path publik absolut (berdasarkan root proyek selama pengembangan) atau path relatif.

- `url()` dalam CSS ditangani dengan cara yang sama.

- Jika menggunakan plugin Vue, referensi aset dalam template SFC Vue secara otomatis diubah menjadi impor.

- Jenis file gambar, media, dan font umum dideteksi secara otomatis sebagai aset. Anda dapat memperluas daftar internal menggunakan opsi [`assetsInclude`](/config/shared-options.md#assetsinclude).

- Aset yang direferensikan disertakan sebagai bagian dari grafik aset pembangunan, akan mendapatkan nama file yang di-hash, dan dapat diproses oleh plugin untuk optimasi.

- Aset yang lebih kecil dalam byte dari opsi [`assetsInlineLimit`](/config/build-options.md#build-assetsinlinelimit) akan di-inline sebagai URL data base64.

- Penanda Git LFS secara otomatis dikecualikan dari inlining karena mereka tidak berisi konten dari file yang mereka wakili. Untuk melakukan inlining, pastikan untuk mengunduh konten file melalui Git LFS sebelum membangun.

- Secara default, TypeScript tidak mengenali impor aset statis sebagai modul yang valid. Untuk memperbaiki ini, sertakan [`vite/client`](./features#client-types).

### Impor URL Eksplisit

Aset yang tidak termasuk dalam daftar internal atau dalam `assetsInclude`, dapat diimpor secara eksplisit sebagai URL menggunakan sufiks `?url`. Ini berguna, misalnya, untuk mengimpor [Houdini Paint Worklets](https://houdini.how/usage).

```js
import workletURL from 'extra-scalloped-border/worklet.js?url'
CSS.paintWorklet.addModule(workletURL)
```

### Mengimpor Aset sebagai String

Aset dapat diimpor sebagai string menggunakan sufiks `?raw`.

```js
import shaderString from './shader.glsl?raw'
```

### Mengimpor Skrip sebagai Pekerja

Skrip dapat diimpor sebagai pekerja web dengan sufiks `?worker` atau `?sharedworker`.

```js
// Chunks terpisah dalam pembangunan produksi
import Worker from './shader.js?worker'
const worker = new Worker()
```

```js
// sharedworker
import SharedWorker from './shader.js?sharedworker'
const sharedWorker = new SharedWorker()
```

```js
// Di-inline sebagai string base64
import InlineWorker from './shader.js?worker&inline'
```

Periksa [bagian Pekerja Web](./features.md#web-workers) untuk detail lebih lanjut.

## Direktori `public`

Jika Anda memiliki aset yang:

- Tidak pernah dirujuk dalam kode sumber (misalnya, `robots.txt`)
- Harus mempertahankan nama file yang sama persis (tanpa peng-hashingan)
- ...atau Anda hanya tidak ingin harus mengimpor sebuah aset terlebih dahulu hanya untuk mendapatkan URL-nya

Maka Anda dapat menempatkan aset tersebut dalam direktori khusus bernama `public` di bawah root proyek Anda. Aset dalam direktori ini akan disajikan pada path root `/` selama pengembangan, dan disalin ke root dari direktori dist sebagaimana adanya.

Direktori tersebut secara default berada di `<root>/public`, tetapi dapat dikonfigurasi melalui opsi [`publicDir`](/config/shared-options.md#publicdir).

Perhatikan bahwa:

- Anda harus selalu merujuk aset dalam `public` menggunakan path absolut root - misalnya, `public/icon.png` harus dirujuk dalam kode sumber sebagai `/icon.png`.
- Aset dalam `public` tidak dapat diimpor dari JavaScript.

## new URL(url, import.meta.url)

[import.meta.url](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta) adalah fitur native ESM yang mengekspos URL modul saat ini. Dengan menggabungkannya dengan konstruktor [URL native](https://developer.mozilla.org/en-US/docs/Web/API/URL), kita dapat memperoleh URL lengkap dan terselaraskan dari suatu aset statis menggunakan path relatif dari sebuah modul JavaScript:

```js
const imgUrl = new URL('./img.png', import.meta.url).href

document.getElementById('hero-img').src = imgUrl
```

Ini berfungsi secara native di browser modern - bahkan, Vite tidak perlu memproses kode ini sama sekali selama pengembangan!

Pola ini juga mendukung URL dinamis melalui literal template:

```js
function getImageUrl(name) {
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

Selama pembangunan produksi, Vite akan melakukan transformasi yang diperlukan sehingga URL masih menunjuk ke lokasi yang benar bahkan setelah penggabungan dan peng-hashingan aset. Namun, string URL harus statis agar dapat dianalisis, jika tidak kode akan dibiarkan apa adanya, yang dapat menyebabkan kesalahan saat runtime jika `build.target` tidak mendukung `import.meta.url`.

```js
// Vite tidak akan mengubah ini
const imgUrl = new URL(imagePath, import.meta.url).href
```

::: peringatan Tidak Berfungsi dengan SSR
Pola ini tidak berfungsi jika Anda menggunakan Vite untuk Server-Side Rendering, karena `import.meta.url` memiliki semantik yang berbeda di browser vs. Node.js. Bundle server juga tidak dapat menentukan URL host klien sebelumnya.
:::
