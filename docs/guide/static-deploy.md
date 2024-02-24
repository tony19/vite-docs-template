# Mendeploy Situs Statis

Panduan-panduan berikut didasarkan pada beberapa asumsi bersama:

- Anda menggunakan lokasi output build default (`dist`). Lokasi ini [dapat diubah menggunakan `build.outDir`](/config/build-options.md#build-outdir), dan Anda dapat mengekstrapolasi instruksi dari panduan-panduan ini dalam kasus tersebut.
- Anda menggunakan npm. Anda dapat menggunakan perintah setara untuk menjalankan skrip jika Anda menggunakan Yarn atau manajer paket lainnya.
- Vite diinstal sebagai dependensi pengembangan lokal di proyek Anda, dan Anda telah menyiapkan skrip npm berikut:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Penting untuk dicatat bahwa `vite preview` dimaksudkan untuk memperlihatkan build secara lokal dan tidak dimaksudkan sebagai server produksi.

::: tip CATATAN
Panduan-panduan ini menyediakan instruksi untuk melakukan deployment statis situs Vite Anda. Vite juga mendukung Server Side Rendering. SSR merujuk pada kerangka kerja front-end yang mendukung menjalankan aplikasi yang sama di Node.js, merender pra ke HTML, dan akhirnya meresapkan di klien. Lihat [Panduan SSR](./ssr) untuk mempelajari fitur ini. Di sisi lain, jika Anda mencari integrasi dengan kerangka kerja server-side tradisional, lihat [panduan integrasi Backend](./backend-integration) sebagai gantinya.
:::

## Membangun Aplikasi

Anda dapat menjalankan perintah `npm run build` untuk membangun aplikasi.

```bash
$ npm run build
```

Secara default, output build akan ditempatkan di `dist`. Anda dapat mendeploy folder `dist` ini ke salah satu platform yang Anda sukai.

### Menguji Aplikasi Secara Lokal

Setelah Anda membangun aplikasi, Anda dapat mengujinya secara lokal dengan menjalankan perintah `npm run preview`.

```bash
$ npm run build
$ npm run preview
```

Perintah `vite preview` akan mem-boot server web statis lokal yang melayani berkas-berkas dari `dist` di `http://localhost:4173`. Ini adalah cara mudah untuk memeriksa apakah build produksi terlihat baik di lingkungan lokal Anda.

Anda dapat mengonfigurasi port server dengan melewatkan flag `--port` sebagai argumen.

```json
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

Sekarang perintah `preview` akan meluncurkan server di `http://localhost:8080`.

## Halaman GitHub

1. Atur `base` yang benar di `vite.config.js`.

   Jika Anda mendeploy ke `https://<USERNAME>.github.io/`, atau ke domain kustom melalui GitHub Pages (misalnya `www.example.com`), atur `base` menjadi `'/'`. Atau, Anda dapat menghapus `base` dari konfigurasi, karena secara default akan menjadi `'/'`.

   Jika Anda mendeploy ke `https://<USERNAME>.github.io/<REPO>/` (misalnya repositori Anda ada di `https://github.com/<USERNAME>/<REPO>`), maka atur `base` menjadi `'/<REPO>/'`.

2. Buka konfigurasi GitHub Pages Anda di halaman pengaturan repositori dan pilih sumber deployment sebagai "GitHub Actions", ini akan membawa Anda untuk membuat alur kerja yang membangun dan mendeploy proyek Anda, contoh alur kerja yang menginstal dependensi dan membangun menggunakan npm disediakan:

   ```yml
   # Alur kerja sederhana untuk mendeploy konten statis ke GitHub Pages
   name: Deploy konten statis ke Halaman

   on:
     # Berjalan pada dorongan yang ditargetkan ke cabang default
     push:
       branches: ['main']

     # Memungkinkan Anda menjalankan alur kerja ini secara manual dari tab Actions
     workflow_dispatch:

   # Mengatur izin GITHUB_TOKEN untuk mengizinkan deployment ke GitHub Pages
   permissions:
     contents: read
     pages: write
     id-token: write

   # Memungkinkan satu deployment konkuren
   concurrency:
     group: 'pages'
     cancel-in-progress: true

   jobs:
     # Satu pekerjaan deploy tunggal karena kita hanya mendeploy
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4
         - name: Set up Node
           uses: actions/setup-node@v3
           with:
             node-version: 18
             cache: 'npm'
         - name: Install dependencies
           run: npm install
         - name: Build
           run: npm run build
         - name: Setup Pages
           uses: actions/configure-pages@v3
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v2
           with:
             # Upload dist repository
             path: './dist'
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v2
   ```

## Halaman GitLab dan GitLab CI

1. Atur `base` yang benar di `vite.config.js`.

   Jika Anda mendeploy ke `https://<USERNAME atau GROUP>.gitlab.io/`, Anda dapat mengabaikan `base` karena secara default menjadi `'/'`.

   Jika Anda mendeploy ke `https://<USERNAME atau GROUP>.gitlab.io/<REPO>/`, misalnya repositori Anda ada di `https://gitlab.com/<USERNAME>/<REPO>`, maka atur `base` menjadi `'/<REPO>/'`.

2. Buat file bernama `.gitlab-ci.yml` di root proyek Anda dengan konten di bawah ini. Ini akan membangun dan mendeploy situs Anda setiap kali Anda membuat perubahan pada konten Anda:

   ```yaml
   image: node:16.5.0
   pages:
     stage: deploy
     cache:
       key:
         files:
           - package-lock.json
         prefix: npm
       paths:
         - node_modules/
     script:
       - npm install
       - npm run build
       - cp -a dist/. public/
     artifacts:
       paths:
         - public
     rules:
       - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
   ```

## Netlify

1. Pasang [Netlify CLI](https://cli.netlify.com/).
2. Buat situs baru menggunakan `ntl init`.
3. Deploy menggunakan `ntl deploy`.

```bash
# Pasang Netlify CLI
$ npm install -g netlify-cli

# Buat situs baru di Netlify
$ ntl init

# Deploy ke URL pratinjau unik
$ ntl deploy
```

Netlify CLI akan memberikan URL pratinjau untuk Anda inspeksi. Ketika Anda siap untuk masuk ke produksi, gunakan flag `prod`:

```bash
# Deploy situs ke produksi
$ ntl deploy --prod
```

## Vercel

### CLI Vercel

1. Pasang [Vercel CLI](https://vercel.com/cli) dan jalankan `vercel` untuk melakukan deploy.
2. Vercel akan mendeteksi bahwa Anda menggunakan Vite dan akan mengaktifkan pengaturan yang tepat untuk deployment Anda.
3. Aplikasi Anda sudah didaftarkan! (misalnya [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

```bash
$ npm i -g vercel
$ vercel init vite
Vercel CLI
> Sukses! Menginisialisasi contoh "vite" di ~/your-folder.
- Untuk deploy, `cd vite` dan jalankan `vercel`.
```

### Vercel untuk Git

1. Dorong kode Anda ke repositori git Anda (GitHub, GitLab, Bitbucket).
2. [Impor proyek Vite Anda](https://vercel.com/new) ke Vercel.
3. Vercel akan mendeteksi bahwa Anda menggunakan Vite dan akan mengaktifkan pengaturan yang tepat untuk deployment Anda.
4. Aplikasi Anda sudah didaftarkan! (misalnya [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

Setelah proyek Anda diimpor dan didaftarkan, semua dorongan selanjutnya ke cabang akan menghasilkan [Deploy Pratinjau](https://vercel.com/docs/concepts/deployments/environments#preview), dan semua perubahan yang dilakukan pada Cabang Produksi (biasanya "main") akan menghasilkan [Deploy Produksi](https://vercel.com/docs/concepts/deployments/environments#production).

Pelajari lebih lanjut tentang [Integrasi Git Vercel](https://vercel.com/docs/concepts/git).

## Cloudflare Pages

### Cloudflare Pages melalui Wrangler

1. Pasang [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/).
2. Autentikasi Wrangler dengan akun Cloudflare Anda menggunakan `wrangler login`.
3. Jalankan perintah build Anda.
4. Deploy menggunakan `npx wrangler pages deploy dist`.

```bash
# Pasang Wrangler CLI
$ npm install -g wrangler

# Login ke akun Cloudflare dari CLI
$ wrangler login

# Jalankan perintah build Anda
$ npm run build

# Buat deployment baru
$ npx wrangler pages deploy dist
```

Setelah aset Anda diunggah, Wrangler akan memberikan URL pratinjau untuk Anda inspeksi. Ketika Anda masuk ke dashboard Cloudflare Pages, Anda akan melihat proyek baru Anda.

### Cloudflare Pages dengan Git

1. Dorong kode Anda ke repositori git Anda (GitHub, GitLab).
2. Masuk ke dashboard Cloudflare dan pilih akun Anda di **Account Home** > **Pages**.
3. Pilih **Buat Proyek Baru** dan opsi **Connect Git**.
4. Pilih proyek git yang ingin Anda deploy dan klik **Mulai setup**.
5. Pilih preset kerangka kerja yang sesuai dalam pengaturan build tergantung pada kerangka kerja Vite yang Anda pilih.
6. Kemudian simpan dan deploy!
7. Aplikasi Anda sudah didaftarkan! (misalnya `https://<PROJECTNAME>.pages.dev/`)

Setelah proyek Anda diimpor dan didaftarkan, semua dorongan selanjutnya ke cabang akan menghasilkan [Deploy Pratinjau](https://developers.cloudflare.com/pages/platform/preview-deployments/) kecuali ditentukan sebaliknya dalam [kontrol build cabang](https://developers.cloudflare.com/pages/platform/branch-build-controls/). Semua perubahan pada Cabang Produksi (biasanya "main") akan menghasilkan Deployment Produksi.

Anda juga dapat menambahkan domain kustom dan menangani pengaturan build kustom di Pages. Pelajari lebih lanjut tentang [Integrasi Git Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/#manage-your-site).

## Google Firebase

1. Pastikan Anda telah menginstal [firebase-tools](https://www.npmjs.com/package/firebase-tools).

2. Buat `firebase.json` dan `.firebaserc` di root proyek Anda dengan konten berikut:

   `firebase.json`:

   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

   `.firebaserc`:

   ```js
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

3. Setelah menjalankan `npm run build`, deploy dengan menggunakan perintah `firebase deploy`.

## Surge

1. Pertama, pasang [surge](https://www.npmjs.com/package/surge), jika Anda belum melakukannya.

2. Jalankan `npm run build`.

3. Deploy ke surge dengan mengetik `surge dist`.

Anda juga dapat melakukan deploy ke [domain kustom](http://surge.sh/help/adding-a-custom-domain) dengan menambahkan `surge dist yourdomain.com`.

## Azure Static Web Apps

Anda dapat dengan cepat melakukan deploy aplikasi Vite Anda dengan layanan Microsoft Azure [Static Web Apps](https://aka.ms/staticwebapps). Anda membutuhkan:

- Akun Azure dan kunci langganan. Anda dapat membuat [akun Azure gratis di sini](https://azure.microsoft.com/free).
- Kode aplikasi Anda yang didorong ke [GitHub](https://github.com).
- [Ekstensi SWA](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) di [Visual Studio Code](https://code.visualstudio.com).

Pasang ekstensi di VS Code dan buka root aplikasi Anda. Buka ekstensi Static Web Apps, masuk ke Azure, dan klik tanda '+' untuk membuat Static Web App baru. Anda akan diminta untuk menetapkan kunci langganan mana yang akan digunakan.

Ikuti petunjuk yang dimulai oleh ekstensi untuk memberi nama aplikasi Anda, memilih preset kerangka kerja, dan menetapkan root aplikasi (biasanya `/`) dan lokasi file yang dibangun `/dist`. Wizard akan berjalan dan akan membuat tindakan GitHub di repo Anda dalam folder `.github`.

Tindakan akan bekerja untuk mendeploy aplikasi Anda (awasi kemajuannya di tab Actions repo Anda) dan, ketika berhasil diselesaikan, Anda dapat melihat aplikasi Anda di alamat yang disediakan dalam jendela progres ekstensi dengan mengklik tombol 'Browse Website' yang muncul ketika tindakan GitHub telah berjalan.

## Render

Anda dapat mendeploy aplikasi Vite Anda sebagai Situs Statis di [Render](https://render.com/).

1. Buat [akun Render](https://dashboard.render.com/register).

2. Di [Dashboard](https://dashboard.render.com/), klik tombol **New** dan pilih **Static Site**.

3. Hubungkan akun GitHub/GitLab Anda atau gunakan repositori publik.

4. Tentukan nama proyek dan cabang.

   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

5. Klik **Create Static Site**.

   Aplikasi Anda seharusnya didaftarkan di `https://<PROJECTNAME>.onrender.com/`.

Secara default, setiap commit baru yang didorong ke cabang yang ditentukan akan secara otomatis memicu deployment baru. [Auto-Deploy](https://render.com/docs/deploys#toggling-auto-deploy-for-a-service) dapat dikonfigurasi di pengaturan proyek.

Anda juga dapat menambahkan [domain kustom](https://render.com/docs/custom-domains) ke proyek Anda.

## Flightcontrol

Deploy situs statis Anda menggunakan [Flightcontrol](https://www.flightcontrol.dev/?ref=docs-vite), dengan mengikuti [petunjuk ini](https://www.flightcontrol.dev/docs/reference/examples/vite?ref=docs-vite).

## AWS Amplify Hosting

Deploy situs statis Anda menggunakan [AWS Amplify Hosting](https://aws.amazon.com/amplify/hosting/), dengan mengikuti [petunjuk ini](https://docs.amplify.aws/guides/hosting/vite/q/platform/js/).

## Kinsta Static Site Hosting

Anda dapat mendeploy aplikasi Vite Anda sebagai Situs Statis di [Kinsta](https://kinsta.com/static-site-hosting/) dengan mengikuti [petunjuk ini](https://kinsta.com/docs/react-vite-example/).
