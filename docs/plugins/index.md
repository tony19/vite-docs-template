# Plugins

:::tip CATATAN
Vite bertujuan untuk memberikan dukungan langsung untuk pola pengembangan web umum. Sebelum mencari plugin Vite atau Rollup yang kompatibel, periksa [Panduan Fitur](../guide/features.md). Banyak kasus di mana sebuah plugin dibutuhkan dalam proyek Rollup sudah tercover dalam Vite.
:::

Lihat [Menggunakan Plugin](../guide/using-plugins) untuk informasi tentang cara menggunakan plugin.

## Plugin Resmi

### [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

- Menyediakan dukungan Komponen Berkas Tunggal Vue 3.

### [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)

- Menyediakan dukungan JSX Vue 3 (melalui [transformasi Babel yang didedikasikan](https://github.com/vuejs/jsx-next)).

### [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)

- Menyediakan dukungan Komponen Berkas Tunggal Vue 2.

### [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)

- Menggunakan esbuild dan Babel, mencapai HMR yang cepat dengan jejak paket kecil dan fleksibilitas untuk dapat menggunakan pipeline transformasi Babel. Tanpa plugin Babel tambahan, hanya esbuild yang digunakan selama pembangunan.

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)

- Menggantikan Babel dengan SWC selama pengembangan. Selama pembangunan, SWC+esbuild digunakan saat menggunakan plugin, dan hanya esbuild jika tidak. Untuk proyek besar yang tidak memerlukan ekstensi React non-standar, pemulihan awal dan Hot Module Replacement (HMR) dapat menjadi lebih cepat secara signifikan.

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

- Menyediakan dukungan untuk browser legacy untuk pembangunan produksi.

## Plugin Komunitas

Lihat [awesome-vite](https://github.com/vitejs/awesome-vite#plugins) - Anda juga dapat mengirim PR untuk mencantumkan plugin Anda di sana.

## Plugin Rollup

[Plugin Vite](../guide/api-plugin) adalah perluasan antarmuka plugin Rollup. Lihat bagian [Kompatibilitas Plugin Rollup](../guide/api-plugin#rollup-plugin-compatibility) untuk informasi lebih lanjut.
