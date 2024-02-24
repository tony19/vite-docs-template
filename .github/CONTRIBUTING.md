# Panduan Berkontribusi Terjemahan Dokumentasi

Repo ini adalah sebuah template untuk [repo-repo terjemahan dokumen Vite.js](https://github.com/vitejs?q=docs).

## Membuat Repo Terjemahan

1. Klik [*Gunakan template ini*](https://github.com/tony19/vite-docs-template/generate) untuk membuat sebuah repo terjemahan baru di GitHub pribadi Anda.

2. Repo ini menggunakan [`ryo-cho` GitHub Action](https://github.com/vuejs-translations/ryu-cho) untuk menjaga agar tetap selaras dengan perubahan dari [dokumen Vite](https://github.com/vitejs/vite/tree/main/docs). Ini membuat pull request di repo ini yang mengekstrak perubahan dari upstream untuk diterjemahkan ([contoh](https://github.com/tony19/vite-docs-template/pull/4)).

   Edit bagian-bagian berikut di [`/.github/workflows/ryo-cho.yml`](/.github/workflows/ryo-cho.yml):

    * `upstream-repo` - URL Git dari repo terjemahan Anda (URL harus diakhiri dengan `.git`)
    * `upstream-repo-branch` - cabang target di repo terjemahan Anda

   Secara default, `ryo-cho` dikonfigurasi untuk menggunakan bot `github-actions`, yang berfungsi langsung. Namun, Anda dapat menggunakan bot Anda sendiri dengan mengkonfigurasi berikut:

    * `username` - nama pengguna GitHub dari [pengguna mesin](https://docs.github.com/en/developers/overview/managing-deploy-keys#machine-users) (misalnya, `ci-bot`)
    * `email` - email yang terkait dengan nama pengguna GitHub di atas
    * `access-token` - sebuah [token akses personal](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) dari pengguna mesin (disimpan dalam sebuah [rahasia repositori](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository), mengaktifkan `access-token: ${{ secrets.MY_SECRET_TOKEN }}`)

3. Terjemahkan semua string yang terlihat oleh pengguna (kecuali dinyatakan lain) dalam file-file berikut ke dalam bahasa target:

    * [`/docs/.vitepress/config.ts`](/docs/.vitepress/config.ts) (bidang `og*`, `footer.*`, `text`, dan `link`)
    * [`/docs/.vitepress/theme/components/HomeSponsors.vue`](/docs/.vitepress/theme/components/HomeSponsors.vue)
    * [`/docs/.vitepress/theme/composables/sponsor.ts`](https://github.com/tony19/vite-docs-template/blob/acea14e/docs/.vitepress/theme/composables/sponsor.ts#L44) (bidang `tier`)
    * [`/docs/_data/team.js`](/docs/_data/team.js) (bidang `title` dan `desc`)
    * `/docs/**/*.md`
    * [`/CONTRIBUTING.md`](/CONTRIBUTING.md)
    * [`/README.md`](/README.md)
    * `/docs/images/*.svg`

   💡 *Tips:*

    * *Mention ke channel [`#docs`](https://discord.com/channels/804011606160703521/855049073157341234) di [Discord](https://chat.vitejs.dev) atau [Diskusi GitHub](https://github.com/vitejs/vite/discussions/categories/general) untuk orang lain yang dapat membantu dengan terjemahan.*
    * *Kirim pull request di repo Anda untuk pekerjaan ini sehingga rekan-rekan dapat memeriksa terjemahan.*

4. Buat [pull request di repo utama Vite](https://github.com/vitejs/vite/pulls) untuk memperbarui [tautan bahasa di `docs/.vitepress/config.ts`](https://github.com/vitejs/vite/blob/1e078ad1902ae980741d6920fc3a72d182fcf179/docs/.vitepress/config.ts#L55-L62), yang akan menambahkan bahasa baru ke dropdown di beranda Vite. Secara khusus, tambahkan ke `localeLinks.items[]` sebuah objek dengan kunci-kunci berikut:

    - `text` - nama bahasa dalam ejaan aslinya (misalnya, `Español`)
    - `link` - URL ke situs target, terdiri dari kode [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) bahasa sebagai subdomain dari `https://vitejs.dev` (misalnya, `https://es.vitejs.dev`)

    *Contoh untuk Bahasa Perancis:*

    ```js
    localeLinks: {
      items: [
        { text: 'Française', link: 'https://fr.vitejs.dev' },
      ]
    },
    ```

5. Di deskripsi pull request, sertakan URL repo terjemahan Anda. Siapkan untuk [mentransfer repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository) ke organisasi [`vitejs`](https://github.com/vitejs) atas permintaan dari [Tim Vite](https://github.com/orgs/vitejs/people). Transfer secara otomatis menambahkan Anda sebagai kolaborator pada repo. Repo akan diubah namanya menjadi `docs-KODE_BAHASA` (misalnya, `docs-fr`) setelah transfer.

   **Terima kasih atas kontribusinya!** ❤️
