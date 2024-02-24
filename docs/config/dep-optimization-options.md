# Opsi Optimisasi Dependen

- **Terkait:** [Pra-Pelabuhan Dependensi](/guide/dep-pre-bundling)

## optimizeDeps.entries

- **Tipe:** `string | string[]`

Secara default, Vite akan menjelajahi semua file `.html` Anda untuk mendeteksi dependensi yang perlu dipra-pelabuhan (mengabaikan `node_modules`, `build.outDir`, `__tests__`, dan `coverage`). Jika `build.rollupOptions.input` ditentukan, Vite akan menjelajahi titik masuk tersebut sebagai gantinya.

Jika keduanya tidak sesuai dengan kebutuhan Anda, Anda dapat menentukan titik masuk kustom menggunakan opsi ini - nilai harus berupa pola [fast-glob](https://github.com/mrmlnc/fast-glob#basic-syntax) atau array pola yang relatif dari akar proyek Vite. Ini akan menimpa inferensi titik masuk default. Hanya folder `node_modules` dan `build.outDir` yang akan diabaikan secara default ketika `optimizeDeps.entries` didefinisikan secara eksplisit. Jika folder lain perlu diabaikan, Anda dapat menggunakan pola pengabaian sebagai bagian dari daftar entri, ditandai dengan `!` awal.

## optimizeDeps.exclude

- **Tipe:** `string[]`

Dependensi yang dikecualikan dari pra-pelabuhan.

::: Peringatan CommonJS
Dependensi CommonJS sebaiknya tidak dikecualikan dari optimisasi. Jika sebuah dependensi ESM dikecualikan dari optimisasi, tetapi memiliki dependensi CommonJS bersarang, dependensi CommonJS tersebut harus ditambahkan ke `optimizeDeps.include`. Contoh:

```js
export default defineConfig({
  optimizeDeps: {
    include: ['esm-dep > cjs-dep'],
  },
})
```

:::

## optimizeDeps.include

- **Tipe:** `string[]`

Secara default, paket yang dihubungkan (linked) yang tidak berada di dalam `node_modules` tidak dipra-pelabuhan. Gunakan opsi ini untuk memaksa sebuah paket yang dihubungkan untuk dipra-pelabuhan.

**Eksperimental:** Jika Anda menggunakan sebuah perpustakaan dengan banyak impor bersarang, Anda juga dapat menentukan sebuah pola glob trailing untuk memra-pelabuhan semua impor bersarang sekaligus. Ini akan menghindari pra-pelabuhan yang terus-menerus setiap kali sebuah impor bersarang baru digunakan. Contoh:

```js
export default defineConfig({
  optimizeDeps: {
    include: ['my-lib/components/**/*.vue'],
  },
})
```

## optimizeDeps.esbuildOptions

- **Tipe:** [`EsbuildBuildOptions`](https://esbuild.github.io/api/#simple-options)

Opsi untuk dilewatkan ke esbuild selama pemindaian dan optimisasi dependensi.

Beberapa opsi dihilangkan karena mengubahnya tidak akan kompatibel dengan optimisasi dependensi Vite.

- `external` juga dihilangkan, gunakan opsi `optimizeDeps.exclude` Vite
- `plugins` digabungkan dengan plugin dependensi Vite

## optimizeDeps.force

- **Tipe:** `boolean`

Setel ke `true` untuk memaksa pra-pelabuhan dependensi, mengabaikan dependensi yang telah dioptimalkan sebelumnya yang disimpan dalam cache.

## optimizeDeps.holdUntilCrawlEnd

- **Eksperimental**
- **Tipe:** `boolean`
- **Default:** `true`

Ketika diaktifkan, ini akan menahan hasil dependensi yang dioptimalkan pertama kali sampai semua impor statis dijelajahi saat cold start. Ini menghindari perlunya muat ulang halaman penuh ketika dependensi baru ditemukan dan mereka memicu pembuatan chunk umum baru. Jika semua dependensi ditemukan oleh pemindai ditambah yang didefinisikan secara eksplisit dalam `include`, lebih baik menonaktifkan opsi ini untuk membiarkan browser memproses lebih banyak permintaan secara paralel.

## optimizeDeps.disabled

- **Dihapus**
- **Eksperimental:** [Berikan Umpan Balik](https://github.com/vitejs/vite/discussions/13839)
- **Tipe:** `boolean | 'build' | 'dev'`
- **Default:** `'build'`

Opsi ini sudah tidak digunakan lagi. Mulai dari Vite 5.1, pra-pelabuhan dependensi selama pembangunan telah dihapus. Mengatur `optimizeDeps.disabled` ke `true` atau `'dev'` menonaktifkan pengoptimal, dan dikonfigurasi ke `false` atau `'build'` meninggalkan pengoptimal selama pengembangan diaktifkan.

Untuk menonaktifkan pengoptimal sepenuhnya, gunakan `optimizeDeps.noDiscovery: true` untuk melarang penemuan otomatis dependensi dan biarkan `optimizeDeps.include` tidak didefinisikan atau kosong.

::: Peringatan
Mengoptimalkan dependensi selama waktu pembangunan adalah fitur **eksperimental**. Proyek yang mencoba strategi ini juga menghapus `@rollup/plugin-commonjs` menggunakan `build.commonjsOptions: { include: [] }`. Jika Anda melakukannya, Anda akan mendapatkan peringatan untuk mengaktifkannya kembali untuk mendukung paket CJS saja saat melakukan bundling.
:::

## optimizeDeps.needsInterop

- **Eksperimental**
- **Tipe:** `string[]`

Memaksa interop ESM saat mengimpor dependensi ini. Vite mampu mendeteksi dengan benar kapan suatu dependensi membutuhkan interop, sehingga opsi ini umumnya tidak diperlukan. Namun, kombinasi berbeda dari dependensi dapat menyebabkan beberapa dependensinya dipra-pelabuhan dengan cara yang berbeda. Menambahkan paket-paket ini ke `needsInterop` dapat mempercepat cold start dengan menghindari muat ulang halaman penuh. Anda akan menerima peringatan jika ini terjadi untuk salah satu dependensi Anda, dengan saran untuk menambahkan nama paket ke dalam array ini dalam konfigurasi Anda.