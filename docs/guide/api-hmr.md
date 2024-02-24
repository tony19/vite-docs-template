# API HMR

:::tip Catatan
Ini adalah API HMR klien. Untuk menangani pembaruan HMR di plugin, lihat [handleHotUpdate](./api-plugin#handlehotupdate).

API HMR manual ini terutama ditujukan untuk penulis kerangka kerja dan alat. Sebagai pengguna akhir, HMR kemungkinan sudah ditangani untuk Anda dalam template awal yang spesifik untuk kerangka kerja.
:::

Vite mengekspos API HMR manualnya melalui objek khusus `import.meta.hot`:

```ts
interface ImportMeta {
  readonly hot?: ViteHotContext
}

type ModuleNamespace = Record<string, any> & {
  [Symbol.toStringTag]: 'Module'
}

interface ViteHotContext {
  readonly data: any

  accept(): void
  accept(cb: (mod: ModuleNamespace | undefined) => void): void
  accept(dep: string, cb: (mod: ModuleNamespace | undefined) => void): void
  accept(
    deps: readonly string[],
    cb: (mods: Array<ModuleNamespace | undefined>) => void,
  ): void

  dispose(cb: (data: any) => void): void
  prune(cb: (data: any) => void): void
  invalidate(message?: string): void

  // `InferCustomEventPayload` provides types for built-in Vite events
  on<T extends string>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  off<T extends string>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  send<T extends string>(event: T, data?: InferCustomEventPayload<T>): void
}
```

## Pengamanan Kondisional yang Diperlukan

Pertama-tama, pastikan untuk melindungi semua penggunaan API HMR dengan blok kondisional sehingga kode dapat dihilangkan dari pohon dalam produksi:

```js
if (import.meta.hot) {
  // Kode HMR
}
```

## IntelliSense untuk TypeScript

Vite menyediakan definisi tipe untuk `import.meta.hot` di [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts). Anda dapat membuat `env.d.ts` di direktori `src` agar TypeScript mengambil definisi tipe:

```ts
/// <reference types="vite/client" />
```

## `hot.accept(cb)`

Untuk modul menerima diri sendiri, gunakan `import.meta.hot.accept` dengan callback yang menerima modul yang diperbarui:

```js
export const count = 1

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      // newModule adalah undefined ketika SyntaxError terjadi
      console.log('updated: count sekarang ', newModule.count)
    }
  })
}
```

Sebuah modul yang "menerima" pembaruan panas dianggap sebagai **batas HMR**.

HMR Vite sebenarnya tidak menukar modul yang diimpor secara asli: jika suatu modul batas HMR mengekspor ulang impor dari dep, maka itu bertanggung jawab untuk memperbarui impor ulang itu (dan ekspor ini harus menggunakan `let`). Selain itu, pengimpor ke atas dari modul batas tidak akan diberi tahu tentang perubahan. Implementasi HMR yang disederhanakan ini cukup untuk sebagian besar kasus pengembangan, sambil memungkinkan kita untuk melewati pekerjaan mahal dalam menghasilkan modul proxy.

Vite mengharuskan panggilan ke fungsi ini muncul sebagai `import.meta.hot.accept(` (peka terhadap spasi) dalam kode sumber agar modul menerima pembaruan. Ini adalah persyaratan analisis statis yang dilakukan Vite untuk mengaktifkan dukungan HMR untuk suatu modul.

## `hot.accept(deps, cb)`

Sebuah modul juga dapat menerima pembaruan dari dependensi langsung tanpa memuat ulang dirinya sendiri:

```js
import { foo } from './foo.js'

foo()

if (import.meta.hot) {
  import.meta.hot.accept('./foo.js', (newFoo) => {
    // callback menerima modul './foo.js' yang diperbarui
    newFoo?.foo()
  })

  // Juga dapat menerima array modul dep:
  import.meta.hot.accept(
    ['./foo.js', './bar.js'],
    ([newFooModule, newBarModule]) => {
      // Callback menerima array di mana hanya modul yang diperbarui
      // non-null. Jika pembaruan tidak berhasil (misalnya, kesalahan sintaksis),
      // array kosong
    },
  )
}
```

## `hot.dispose(cb)`

Sebuah modul yang menerima dirinya sendiri atau modul yang diharapkan untuk diterima oleh modul lain dapat menggunakan `hot.dispose` untuk membersihkan efek samping yang persisten yang dibuat oleh salinan terbarunya:

```js
function setupSideEffect() {}

setupSideEffect()

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // membersihkan efek samping
  })
}
```

## `hot.prune(cb)`

Daftarkan sebuah callback yang akan dipanggil ketika modul tersebut tidak lagi diimpor di halaman. Dibandingkan dengan `hot.dispose`, ini dapat digunakan jika kode sumber membersihkan efek samping sendiri pada pembaruan dan Anda hanya perlu membersihkan ketika modul tersebut dihapus dari halaman. Saat ini, Vite menggunakan ini untuk impor `.css`.

```js
function setupOrReuseSideEffect() {}

setupOrReuseSideEffect()

if (import.meta.hot) {
  import.meta.hot.prune((data) => {
    // membersihkan efek samping
  })
}
```

## `hot.data`

Objek `import.meta.hot.data` persisten di berbagai instansi modul yang sama yang diperbarui. Ini dapat digunakan untuk meneruskan informasi dari versi sebelumnya modul ke versi berikutnya.

Perhatikan bahwa penugasan ulang `data` sendiri tidak didukung. Sebaliknya, Anda harus mengubah properti dari objek `data` sehingga informasi yang ditambahkan dari penangan lainnya dipertahankan.

```js
// ok
import.meta.hot.data.someValue = 'hello'

// tidak didukung
import.meta.hot.data = { someValue: 'hello' }
```

## `hot.decline()`

Saat ini, ini tidak berfungsi dan ada untuk kompatibilitas mundur. Ini bisa berubah di masa depan jika ada penggunaan baru. Untuk menunjukkan bahwa modul tidak dapat diperbarui secara otomatis, gunakan `hot.invalidate()`.

## `hot.invalidate(message?: string)`

Sebuah modul yang menerima dirinya sendiri mungkin menyadari selama runtime bahwa ia tidak dapat menangani pembaruan HMR, sehingga pembaruan perlu dipropagasi secara paksa ke importir. Dengan memanggil `import.meta.hot.invalidate()`, server HMR akan menghapuskan importir dari pemanggil, seolah-olah pemanggil tidak menerima dirinya sendiri. Ini akan mencatat pesan baik di konsol browser maupun di terminal. Anda dapat melewatkan pesan untuk memberikan beberapa konteks tentang mengapa invalidasi terjadi.

Perhatikan bahwa Anda harus selalu memanggil `import.meta.hot.accept` bahkan jika Anda berencana untuk segera memanggil `invalidate`, jika tidak klien HMR tidak akan mendengarkan perubahan di modul yang menerima dirinya sendiri. Untuk mengkomunikasikan niat Anda dengan jelas, kami merekomendasikan memanggil `invalidate` dalam callback `accept` seperti ini:

```js
import.meta.hot.accept((module) => {
  // Anda dapat menggunakan instan modul baru untuk memutuskan apakah akan menginvalidasi.
  if (tidakDapatMenanganiPembaruan(module)) {
    import.meta.hot.invalidate()
  }
})
```

## `hot.on(event, cb)`

Dengarkan sebuah event HMR.

Event HMR berikut secara otomatis dipancarkan oleh Vite:

- `'vite:beforeUpdate'` ketika pembaruan akan diterapkan (mis., sebuah modul akan diganti)
- `'vite:afterUpdate'` ketika pembaruan baru saja diterapkan (mis., sebuah modul telah diganti)
- `'vite:beforeFullReload'` ketika muat ulang penuh akan terjadi
- `'vite:beforePrune'` ketika modul yang tidak lagi dibutuhkan akan dipangkas
- `'vite:invalidate'` ketika sebuah modul dihapuskan dengan `import.meta.hot.invalidate()`
- `'vite:error'` ketika terjadi kesalahan (mis., kesalahan sintaks)
- `'vite:ws:disconnect'` ketika koneksi WebSocket terputus
- `'vite:ws:connect'` ketika koneksi WebSocket terhubung kembali

Event HMR kustom juga dapat dikirimkan dari plugin. Lihat [handleHotUpdate](./api-plugin#handlehotupdate) untuk lebih detail.

## `hot.off(event, cb)`

Hapus callback dari pendengar event

## `hot.send(event, data)`

Kirim event kustom kembali ke server pengembangan Vite.

Jika dipanggil sebelum terhubung, data akan di-buffer dan dikirim sekali koneksi terhubung.

Lihat [Komunikasi Klien-Server](/guide/api-plugin.html#client-server-communication) untuk lebih detail.