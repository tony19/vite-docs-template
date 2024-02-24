# Opsi Pekerja

Opsi terkait dengan Web Workers.

## worker.format

- **Tipe:** `'es' | 'iife'`
- **Default:** `'iife'`

Format output untuk bundel pekerja.

## worker.plugins

- **Tipe:** [`() => (Plugin | Plugin[])[]`](./shared-options#plugins)

Plugin Vite yang berlaku untuk bundel pekerja. Perhatikan bahwa [config.plugins](./shared-options#plugins) hanya berlaku untuk pekerja di dev, seharusnya dikonfigurasi di sini sebagai gantinya untuk build.
Fungsi harus mengembalikan instance plugin baru karena mereka digunakan dalam pembangunan pekerja rollup yang paralel. Dengan demikian, memodifikasi opsi `config.worker` di hook `config` akan diabaikan.

## worker.rollupOptions

- **Tipe:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

Opsi Rollup untuk membangun bundel pekerja.