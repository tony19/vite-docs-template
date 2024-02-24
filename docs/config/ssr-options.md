# Opsi SSR

## ssr.external

- **Tipe:** `string[] | true`
- **Terkait:** [Eksternal SSR](/guide/ssr#ssr-externals)

Eksternalisasikan dependensi yang diberikan dan dependensi transitif mereka untuk SSR. Secara default, semua dependensi dieksternalisasikan kecuali dependensi terhubung (untuk HMR). Jika Anda lebih memilih untuk mengeksternalisasikan dependensi terhubung, Anda dapat melewatkan namanya ke opsi ini.

Jika `true`, semua dependensi termasuk dependensi terhubung dieksternalisasikan.

Perhatikan bahwa dependensi yang secara eksplisit terdaftar (menggunakan tipe `string[]`) akan selalu memiliki prioritas jika mereka juga terdaftar di `ssr.noExternal` (menggunakan jenis apa pun).

## ssr.noExternal

- **Tipe:** `string | RegExp | (string | RegExp)[] | true`
- **Terkait:** [Eksternal SSR](/guide/ssr#ssr-externals)

Mencegah dependensi yang terdaftar dari dieksternalisasikan untuk SSR, yang akan dibundel dalam build. Secara default, hanya dependensi terhubung yang tidak dieksternalisasikan (untuk HMR). Jika Anda lebih memilih untuk mengeksternalisasikan dependensi terhubung, Anda dapat melewatkan namanya ke opsi `ssr.external`.

Jika `true`, tidak ada dependensi yang dieksternalisasikan. Namun, dependensi yang secara eksplisit terdaftar di `ssr.external` (menggunakan tipe `string[]`) dapat memiliki prioritas dan tetap dieksternalisasikan.

Perhatikan bahwa jika baik `ssr.noExternal: true` dan `ssr.external: true` dikonfigurasi, `ssr.noExternal` memiliki prioritas dan tidak ada dependensi yang dieksternalisasikan.

## ssr.target

- **Tipe:** `'node' | 'webworker'`
- **Default:** `node`

Target pembangunan untuk server SSR.

## ssr.resolve.conditions

- **Tipe:** `string[]`
- **Terkait:** [Kondisi Pemecahan](./shared-options.md#resolve-conditions)

Secara default ke [`resolve.conditions`](./shared-options.md#resolve-conditions) root.

Kondisi ini digunakan dalam pipeline plugin, dan hanya memengaruhi dependensi yang tidak dieksternalisasikan selama pembangunan SSR. Gunakan `ssr.resolve.externalConditions` untuk mempengaruhi impor yang dieksternalisasikan.

## ssr.resolve.externalConditions

- **Tipe:** `string[]`
- **Default:** `[]`

Kondisi yang digunakan selama impor ssr (termasuk `ssrLoadModule`) dari dependensi yang dieksternalisasikan.