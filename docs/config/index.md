---
title: Mengkonfigurasi Vite
---

# Mengkonfigurasi Vite

Ketika menjalankan `vite` dari baris perintah, Vite secara otomatis akan mencoba untuk memecahkan file konfigurasi yang bernama `vite.config.js` di dalam [root proyek](/guide/#index-html-and-project-root) (ekstensi JS dan TS lainnya juga didukung).

File konfigurasi paling dasar terlihat seperti ini:

```js
// vite.config.js
export default {
  // opsi konfigurasi
}
```

Perhatikan bahwa Vite mendukung penggunaan sintaksis modul ES dalam file konfigurasi bahkan jika proyek tidak menggunakan ESM asli Node, misalnya `type: "module"` di `package.json`. Dalam kasus ini, file konfigurasi diproses sebelum dimuat.

Anda juga dapat secara eksplisit menentukan file konfigurasi yang akan digunakan dengan opsi CLI `--config` (dipecahkan relatif terhadap `cwd`):

```bash
vite --config my-config.js
```

## Intellisense Konfigurasi

Karena Vite dilengkapi dengan typings TypeScript, Anda dapat memanfaatkan intellisense IDE Anda dengan petunjuk tipe jsdoc:

```js
/** @type {import('vite').UserConfig} */
export default {
  // ...
}
```

Sebagai alternatif, Anda dapat menggunakan helper `defineConfig` yang seharusnya memberikan intellisense tanpa perlu menggunakan anotasi jsdoc:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite juga mendukung langsung file konfigurasi TS. Anda dapat menggunakan `vite.config.ts` dengan helper `defineConfig` juga.

## Konfigurasi Kondisional

Jika konfigurasi perlu secara kondisional menentukan opsi berdasarkan perintah (`serve` atau `build`), [mode](/guide/env-and-mode) yang digunakan, apakah itu pembuatan SSR (`isSsrBuild`), atau sedang melakukan pratinjau pembuatan (`isPreview`), maka bisa mengekspor sebuah fungsi sebagai gantinya:

```js
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      // konfigurasi khusus dev
    };
  } else {
    // command === 'build'
    return {
      // konfigurasi khusus build
    };
  }
});
```

Penting untuk dicatat bahwa dalam API Vite, nilai `command` adalah `serve` saat pengembangan (dalam cli `vite`, `vite dev`, dan `vite serve` adalah alias), dan `build` saat membangun untuk produksi (`vite build`).

`isSsrBuild` dan `isPreview` adalah bendera opsional tambahan untuk membedakan jenis perintah `build` dan `serve` masing-masing. Beberapa alat yang memuat konfigurasi Vite mungkin tidak mendukung bendera ini dan akan melewatkan `undefined` sebagai gantinya. Oleh karena itu, disarankan untuk menggunakan perbandingan eksplisit terhadap `true` dan `false`.

## Konfigurasi Async

Jika konfigurasi perlu memanggil fungsi async, maka dapat mengekspor sebuah fungsi async sebagai gantinya. Dan fungsi async ini juga dapat dilewatkan melalui `defineConfig` untuk mendukung intellisense yang lebih baik:

```js
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction();
  return {
    // konfigurasi Vite
  };
});
```

## Menggunakan Variabel Lingkungan dalam Konfigurasi

Variabel Lingkungan dapat diperoleh dari `process.env` seperti biasa.

Perhatikan bahwa Vite tidak memuat file `.env` secara default karena file yang akan dimuat hanya dapat ditentukan setelah mengevaluasi konfigurasi Vite, misalnya, opsi `root` dan `envDir` memengaruhi perilaku pemuatan. Namun, Anda dapat menggunakan helper `loadEnv` yang diekspor untuk memuat file `.env` tertentu jika diperlukan.

```js
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  // Memuat file env berdasarkan `mode` di direktori kerja saat ini.
  // Atur parameter ketiga ke '' untuk memuat semua env tanpa memperhatikan awalan `VITE_`.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // konfigurasi Vite
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  };
});
```