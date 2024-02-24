# Opsi Pratinjau

## preview.host

- **Tipe:** `string | boolean`
- **Default:** [`server.host`](./server-options#server-host)

Tentukan alamat IP mana yang harus didengarkan oleh server.
Atur ini menjadi `0.0.0.0` atau `true` untuk mendengarkan semua alamat, termasuk alamat LAN dan publik.

Ini dapat diatur melalui CLI menggunakan `--host 0.0.0.0` atau `--host`.

::: tip CATATAN

Ada kasus di mana server lain mungkin akan merespons daripada Vite.
Lihat [`server.host`](./server-options#server-host) untuk lebih jelasnya.

:::

## preview.port

- **Tipe:** `number`
- **Default:** `4173`

Tentukan port server. Perhatikan jika port sudah digunakan, Vite secara otomatis akan mencoba port berikutnya yang tersedia sehingga ini mungkin bukan port aktual tempat server berakhir mendengarkan.

**Contoh:**

```js
export default defineConfig({
  server: {
    port: 3030,
  },
  preview: {
    port: 8080,
  },
})
```

## preview.strictPort

- **Tipe:** `boolean`
- **Default:** [`server.strictPort`](./server-options#server-strictport)

Setel ke `true` untuk keluar jika port sudah digunakan, daripada secara otomatis mencoba port berikutnya yang tersedia.

## preview.https

- **Tipe:** `boolean | https.ServerOptions`
- **Default:** [`server.https`](./server-options#server-https)

Aktifkan TLS + HTTP/2. Perhatikan ini downgrade menjadi hanya TLS ketika opsi [`server.proxy`](./server-options#server-proxy) juga digunakan.

Nilainya juga bisa berupa objek opsi yang dilewatkan ke `https.createServer()`.

## preview.open

- **Tipe:** `boolean | string`
- **Default:** [`server.open`](./server-options#server-open)

Secara otomatis membuka aplikasi di browser saat server mulai. Ketika nilainya adalah sebuah string, itu akan digunakan sebagai pathname URL. Jika Anda ingin membuka server di browser tertentu yang Anda sukai, Anda dapat mengatur env `process.env.BROWSER` (misalnya `firefox`). Anda juga dapat mengatur `process.env.BROWSER_ARGS` untuk meneruskan argumen tambahan (misalnya `--incognito`).

`BROWSER` dan `BROWSER_ARGS` juga merupakan variabel lingkungan khusus yang dapat Anda atur di file `.env` untuk mengkonfigurasinya. Lihat [pakaiannya `open`](https://github.com/sindresorhus/open#app) untuk detail lebih lanjut.

## preview.proxy

- **Tipe:** `Record<string, string | ProxyOptions>`
- **Default:** [`server.proxy`](./server-options#server-proxy)

Konfigurasikan aturan proxy kustom untuk server pratinjau. Mengharapkan objek dari pasangan `{ key: options }`. Jika kunci dimulai dengan `^`, itu akan diinterpretasikan sebagai `RegExp`. Opsi `configure` dapat digunakan untuk mengakses instance proxy.

Menggunakan [`http-proxy`](https://github.com/http-party/node-http-proxy). Opsi lengkap [di sini](https://github.com/http-party/node-http-proxy#options).

## preview.cors

- **Tipe:** `boolean | CorsOptions`
- **Default:** [`server.cors`](./server-options#server-cors)

Konfigurasikan CORS untuk server pratinjau. Ini diaktifkan secara default dan mengizinkan origin apa pun. Berikan sebuah [objek opsi](https://github.com/expressjs/cors#configuration-options) untuk menyesuaikan perilaku atau `false` untuk menonaktifkan.

## preview.headers

- **Tipe:** `OutgoingHttpHeaders`

Tentukan header respons server.
