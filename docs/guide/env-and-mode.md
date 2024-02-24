# Variabel Lingkungan dan Mode

## Variabel Lingkungan

Vite mengekspos variabel lingkungan pada objek khusus **`import.meta.env`**. Beberapa variabel bawaan tersedia dalam semua kasus:

- **`import.meta.env.MODE`**: {string} mode [mode](#modes) aplikasi berjalan.

- **`import.meta.env.BASE_URL`**: {string} URL dasar tempat aplikasi disajikan. Ini ditentukan oleh opsi konfigurasi [`base`](/config/shared-options.md#base).

- **`import.meta.env.PROD`**: {boolean} apakah aplikasi berjalan di produksi (menjalankan server dev dengan `NODE_ENV='production'` atau menjalankan aplikasi yang dibangun dengan `NODE_ENV='production'`).

- **`import.meta.env.DEV`**: {boolean} apakah aplikasi berjalan dalam pengembangan (selalu kebalikan dari `import.meta.env.PROD`)

- **`import.meta.env.SSR`**: {boolean} apakah aplikasi berjalan dalam [server](./ssr.md#conditional-logic).

## Berkas `.env`

Vite menggunakan [dotenv](https://github.com/motdotla/dotenv) untuk memuat variabel lingkungan tambahan dari berkas berikut dalam [direktori lingkungan](/config/shared-options.md#envdir) Anda:

```
.env                # dimuat dalam semua kasus
.env.local          # dimuat dalam semua kasus, diabaikan oleh git
.env.[mode]         # hanya dimuat dalam mode tertentu yang ditentukan
.env.[mode].local   # hanya dimuat dalam mode tertentu yang ditentukan, diabaikan oleh git
```

:::tip Prioritas Memuat Env

Sebuah berkas env untuk mode tertentu (misalnya `.env.production`) akan memiliki prioritas yang lebih tinggi daripada yang generik (misalnya `.env`).

Selain itu, variabel lingkungan yang sudah ada ketika Vite dieksekusi memiliki prioritas tertinggi dan tidak akan ditimpa oleh berkas `.env`. Misalnya, ketika menjalankan `VITE_SOME_KEY=123 vite build`.

Berkas `.env` dimuat pada awal Vite. Mulai ulang server setelah melakukan perubahan.
:::

Variabel lingkungan yang dimuat juga diekspos ke kode sumber klien Anda melalui `import.meta.env` sebagai string.

Untuk mencegah kebocoran variabel lingkungan ke klien secara tidak sengaja, hanya variabel yang diawali dengan `VITE_` yang diekspos ke kode yang diproses Vite Anda. misalnya untuk variabel lingkungan berikut:

```
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```

Hanya `VITE_SOME_KEY` yang akan diekspos sebagai `import.meta.env.VITE_SOME_KEY` ke kode sumber klien Anda, tetapi `DB_PASSWORD` tidak.

```js
console.log(import.meta.env.VITE_SOME_KEY) // "123"
console.log(import.meta.env.DB_PASSWORD) // undefined
```

:::tip Pemrosesan Env

Seperti yang ditunjukkan di atas, `VITE_SOME_KEY` adalah angka tetapi mengembalikan string saat diurai. Hal yang sama juga akan terjadi untuk variabel lingkungan boolean. Pastikan untuk mengonversi ke tipe yang diinginkan saat menggunakannya dalam kode Anda.
:::

Juga, Vite menggunakan [dotenv-expand](https://github.com/motdotla/dotenv-expand) untuk memperluas variabel secara otomatis. Untuk mempelajari lebih lanjut tentang sintaksnya, lihat [dokumentasi mereka](https://github.com/motdotla/dotenv-expand#what-rules-does-the-expansion-engine-follow).

Perhatikan bahwa jika Anda ingin menggunakan `$` di dalam nilai lingkungan Anda, Anda harus melarikannya dengan `\`.

```
KEY=123
NEW_KEY1=test$foo   # test
NEW_KEY2=test\$foo  # test$foo
NEW_KEY3=test$KEY   # test123
```

Jika Anda ingin menyesuaikan awalan variabel lingkungan, lihat opsi [envPrefix](/config/shared-options.html#envprefix).

:::warning CATATAN KEAMANAN

- Berkas `.env.*.local` hanya untuk lokal dan dapat berisi variabel sensitif. Anda harus menambahkan `*.local` ke `.gitignore` Anda untuk menghindari dimasukkannya ke git.

- Karena variabel yang diekspos ke kode sumber Vite Anda akan berakhir di bundel klien Anda, variabel `VITE_*` seharusnya _tidak_ mengandung informasi sensitif.
  :::

### IntelliSense untuk TypeScript

Secara default, Vite menyediakan definisi tipe untuk `import.meta.env` di [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts). Meskipun Anda dapat mendefinisikan lebih banyak variabel lingkungan kustom dalam berkas `.env.[mode]`, Anda mungkin ingin mendapatkan IntelliSense TypeScript untuk variabel lingkungan yang ditentukan pengguna yang diawali dengan `VITE_`.

Untuk mencapai hal ini, Anda dapat membuat sebuah berkas `vite-env.d.ts` di direktori `src`, kemudian memperluas `ImportMetaEnv` seperti ini:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // variabel lingkungan lainnya...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

Jika kode Anda bergantung pada tipe dari lingkungan peramban seperti [DOM](https://github.com/microsoft/TypeScript/blob/main/lib/lib.dom.d.ts) dan [WebWorker](https://github.com/microsoft/TypeScript/blob/main/lib/lib.webworker.d.ts), Anda dapat memperbarui bidang [lib](https://www.typescriptlang.org/tsconfig#lib) dalam `tsconfig.json`.

```json
{
  "lib": ["WebWorker"]
}
```

:::warning Impor akan memecah perluasan tipe

Jika perluasan `ImportMetaEnv` tidak berfungsi, pastikan Anda tidak memiliki pernyataan `import` dalam `vite-env.d.ts`. Lihat [dokumentasi TypeScript](https://www.typescriptlang.org/docs/handbook/2/modules.html#how-javascript-modules-are-defined) untuk informasi lebih lanjut.
:::

## Penggantian Env dalam HTML

Vite juga mendukung penggantian variabel lingkungan dalam berkas HTML. Properti apa pun dalam `import.meta.env` dapat digunakan dalam berkas HTML dengan sintaks khusus `%ENV_NAME%`:

```html
<h1>Vite berjalan di mode %MODE%</h1>
<p>Menggunakan data dari %VITE_API_URL%</p>
```

Jika lingkungan tidak ada dalam `import.meta.env`, misalnya `%NON_EXISTENT%`, itu akan diabaikan dan tidak diganti, berbeda dengan `import.meta.env.NON_EXISTENT` dalam JS di mana itu diganti sebagai `undefined`.

Karena Vite digunakan oleh banyak kerangka kerja, secara sengaja tidak memiliki pendapat tentang penggantian kompleks seperti kondisional. Vite dapat diperluas menggunakan [plugin pengguna yang ada](https://github.com/vitejs/awesome-vite#transformers) atau plugin kustom yang mengimplementasikan [`transformIndexHtml` hook](./api-plugin#transformindexhtml).

## Mode

Secara default, server dev (`dev` command) berjalan dalam mode `development` dan perintah `build` berjalan dalam mode `production`.

Ini berarti ketika menjalankan `vite build`, itu akan memuat variabel lingkungan dari `.env.production` jika ada:

```
# .env.production
VITE_APP_TITLE=My App
```

Di aplikasi Anda, Anda dapat merender judul menggunakan `import.meta.env.VITE_APP_TITLE`.

Dalam beberapa kasus, Anda mungkin ingin menjalankan `vite build` dengan mode yang berbeda untuk merender judul yang berbeda. Anda dapat menimpa mode default yang digunakan untuk sebuah perintah dengan melewati opsi flag `--mode`. Misalnya, jika Anda ingin membangun aplikasi Anda untuk mode staging:

```bash
vite build --mode staging
```

Dan membuat berkas `.env.staging`:

```
# .env.staging
VITE_APP_TITLE=My App (staging)
```

Karena `vite build` menjalankan build produksi secara default, Anda juga dapat mengubah ini dan menjalankan build pengembangan dengan menggunakan mode dan konfigurasi berkas `.env` yang berbeda:

```
# .env.testing
NODE_ENV=development
```

## NODE_ENV dan Mode

Penting untuk dicatat bahwa `NODE_ENV` (`process.env.NODE_ENV`) dan mode adalah dua konsep yang berbeda. Berikut adalah bagaimana perintah yang berbeda mempengaruhi `NODE_ENV` dan mode:

| Perintah                                              | NODE_ENV        | Mode            |
| ---------------------------------------------------- | --------------- | --------------- |
| `vite build`                                         | `"production"`  | `"production"`  |
| `vite build --mode development`                      | `"production"`  | `"development"` |
| `NODE_ENV=development vite build`                    | `"development"` | `"production"`  |
| `NODE_ENV=development vite build --mode development` | `"development"` | `"development"` |

Berbagai nilai dari `NODE_ENV` dan mode juga tercermin pada properti `import.meta.env` yang sesuai:

| Perintah                | `import.meta.env.PROD` | `import.meta.env.DEV` |
| ---------------------- | ---------------------- | --------------------- |
| `NODE_ENV=production`  | `true`                 | `false`               |
| `NODE_ENV=development` | `false`                | `true`                |
| `NODE_ENV=other`       | `false`                | `true`                |

| Perintah            | `import.meta.env.MODE` |
| -------------------- | ---------------------- |
| `--mode production`  | `"production"`         |
| `--mode development` | `"development"`        |
| `--mode staging`     | `"staging"`            |

:::tip `NODE_ENV` dalam berkas `.env`

`NODE_ENV=...` dapat diatur dalam perintah, dan juga dalam berkas `.env` Anda. Jika `NODE_ENV` ditentukan dalam berkas `.env.[mode]`, mode dapat digunakan untuk mengontrol nilainya. Namun, baik `NODE_ENV` maupun mode tetap sebagai dua konsep yang berbeda.

Manfaat utama dengan `NODE_ENV=...` dalam perintah adalah memungkinkan Vite mendeteksi nilainya lebih awal. Ini juga memungkinkan Anda untuk membaca `process.env.NODE_ENV` dalam konfigurasi Vite karena Vite hanya dapat memuat berkas lingkungan setelah konfigurasi dievaluasi.
:::
