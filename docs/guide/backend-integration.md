# Integrasi Backend

:::tip Catatan
Jika Anda ingin melayani HTML menggunakan backend tradisional (misalnya, Rails, Laravel) tetapi menggunakan Vite untuk melayani aset, periksa integrasi yang sudah ada yang tercantum di [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends).

Jika Anda membutuhkan integrasi kustom, Anda dapat mengikuti langkah-langkah dalam panduan ini untuk mengonfigurasinya secara manual.
:::

1. Dalam konfigurasi Vite Anda, konfigurasikan entri dan aktifkan manifest pembangunan:

   ```js
   // vite.config.js
   export default defineConfig({
     build: {
       // menghasilkan .vite/manifest.json di outDir
       manifest: true,
       rollupOptions: {
         // mengganti entri .html default
         input: '/path/to/main.js',
       },
     },
   })
   ```

   Jika Anda belum menonaktifkan [polyfill module preload](/config/build-options.md#build-polyfillmodulepreload), Anda juga perlu mengimpor polyfill tersebut di entri Anda

   ```js
   // tambahkan di awal entri aplikasi Anda
   import 'vite/modulepreload-polyfill'
   ```

2. Untuk pengembangan, masukkan yang berikut ini dalam template HTML server Anda (ganti `http://localhost:5173` dengan URL lokal di mana Vite berjalan):

   ```html
   <!-- jika pengembangan -->
   <script type="module" src="http://localhost:5173/@vite/client"></script>
   <script type="module" src="http://localhost:5173/main.js"></script>
   ```

   Untuk melayani aset dengan benar, Anda memiliki dua pilihan:

   - Pastikan server dikonfigurasi untuk memroksi permintaan aset statis ke server Vite
   - Tetapkan [`server.origin`](/config/server-options.md#server-origin) sehingga URL aset yang dihasilkan akan diselesaikan menggunakan URL server backend daripada path relatif

   Hal ini diperlukan agar aset seperti gambar dapat dimuat dengan benar.

   Perhatikan jika Anda menggunakan React dengan `@vitejs/plugin-react`, Anda juga perlu menambahkan ini sebelum skrip-skrip di atas, karena plugin tidak dapat memodifikasi HTML yang Anda layani (ganti `http://localhost:5173` dengan URL lokal di mana Vite berjalan):

   ```html
   <script type="module">
     import RefreshRuntime from 'http://localhost:5173/@react-refresh'
     RefreshRuntime.injectIntoGlobalHook(window)
     window.$RefreshReg$ = () => {}
     window.$RefreshSig$ = () => (type) => type
     window.__vite_plugin_react_preamble_installed__ = true
   </script>
   ```

3. Untuk produksi: setelah menjalankan `vite build`, file `.vite/manifest.json` akan dihasilkan bersama dengan file aset lainnya. Contoh file manifest seperti ini:

   ```json
   {
     "main.js": {
       "file": "assets/main.4889e940.js",
       "src": "main.js",
       "isEntry": true,
       "dynamicImports": ["views/foo.js"],
       "css": ["assets/main.b82dbe22.css"],
       "assets": ["assets/asset.0ab0f9cd.png"]
     },
     "views/foo.js": {
       "file": "assets/foo.869aea0d.js",
       "src": "views/foo.js",
       "isDynamicEntry": true,
       "imports": ["_shared.83069a53.js"]
     },
     "_shared.83069a53.js": {
       "file": "assets/shared.83069a53.js"
     }
   }
   ```

   - Manifest memiliki struktur `Record<name, chunk>`
   - Untuk chunk entri atau dinamis, kunci adalah path src relatif dari root proyek.
   - Untuk chunk non-entri, kunci adalah nama dasar file yang dihasilkan dengan diawali `_`.
   - Chunks akan berisi informasi tentang impor statis dan dinamisnya (keduanya adalah kunci yang memetakan ke chunk yang sesuai dalam manifest), dan juga file CSS dan asetnya (jika ada).

   Anda dapat menggunakan file ini untuk merender tautan atau direktif preload dengan nama file yang di-hash (perhatikan: sintaksis di sini hanya untuk penjelasan, gantikan dengan bahasa templating server Anda):

   ```html
   <!-- jika produksi -->
   <link rel="stylesheet" href="/assets/{{ manifest['main.js'].css }}" />
   <script type="module" src="/assets/{{ manifest['main.js'].file }}"></script>
   ```
   