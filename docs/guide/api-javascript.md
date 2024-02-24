# API JavaScript

API JavaScript Vite sepenuhnya berjenis data, dan disarankan untuk menggunakan TypeScript atau mengaktifkan pengecekan tipe JS di VS Code untuk memaksimalkan intellisense dan validasi.

## `createServer`

**Tanda Tangan Tipe:**

```ts
async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>
```

**Contoh Penggunaan:**

```js
import { fileURLToPath } from 'url'
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  const server = await createServer({
    // opsi konfigurasi pengguna yang valid, ditambah `mode` dan `configFile`
    configFile: false,
    root: __dirname,
    server: {
      port: 1337,
    },
  })
  await server.listen()

  server.printUrls()
  server.bindCLIShortcuts({ print: true })
})()
```

::: tip CATATAN
Saat menggunakan `createServer` dan `build` dalam proses Node.js yang sama, kedua fungsi mengandalkan `process.env.NODE_ENV` untuk bekerja dengan benar, yang juga tergantung pada opsi konfigurasi `mode`. Untuk mencegah perilaku yang bertentangan, atur `process.env.NODE_ENV` atau `mode` dari kedua API ke `development`. Jika tidak, Anda dapat menjalankan proses anak untuk menjalankan API secara terpisah.
:::

::: tip CATATAN
Saat menggunakan [mode middleware](/config/server-options.html#server-middlewaremode) yang digabungkan dengan [konfigurasi proxy untuk WebSocket](/config/server-options.html#server-proxy), server http induk harus disediakan di `middlewareMode` untuk mengikat proxy dengan benar.

<details>
<summary>Contoh</summary>

```ts
import http from 'http'
import { createServer } from 'vite'

const parentServer = http.createServer() // atau express, koa, dll.

const vite = await createServer({
  server: {
    // Aktifkan mode middleware
    middlewareMode: {
      // Sediakan server http induk untuk proxy WebSocket
      server: parentServer,
    },
  },
  proxy: {
    '/ws': {
      target: 'ws://localhost:3000',
      // Meneruskan WebSocket
      ws: true,
    },
  },
})

parentServer.use(vite.middlewares)
```

</details>
:::

## `InlineConfig`

Interface `InlineConfig` memperluas `UserConfig` dengan properti tambahan:

- `configFile`: tentukan file konfigurasi yang akan digunakan. Jika tidak diatur, Vite akan mencoba secara otomatis menyelesaikannya dari root proyek. Atur ke `false` untuk menonaktifkan penyelesaian otomatis.
- `envFile`: Atur ke `false` untuk menonaktifkan file `.env`.

## `ResolvedConfig`

Interface `ResolvedConfig` memiliki semua properti yang sama dengan `UserConfig`, kecuali sebagian besar propertinya sudah diselesaikan dan tidak `undefined`. Ini juga berisi utilitas seperti:

- `config.assetsInclude`: Sebuah fungsi untuk memeriksa apakah suatu `id` dianggap sebagai aset.
- `config.logger`: Objek logger internal Vite.

## `ViteDevServer`

```ts
interface ViteDevServer {
  /**
   * Objek konfigurasi Vite yang sudah diselesaikan.
   */
  config: ResolvedConfig
  /**
   * Instance aplikasi Connect
   * - Dapat digunakan untuk menambahkan middleware kustom ke server pengembangan.
   * - Juga dapat digunakan sebagai fungsi handler dari server http kustom
   *   atau sebagai middleware dalam kerangka kerja Node.js gaya Connect mana pun.
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * Instance server http Node asli.
   * Akan null dalam mode middleware.
   */
  httpServer: http.Server | null
  /**
   * Instance peninjau Chokidar. Jika `config.server.watch` diatur ke `null`,
   * mengembalikan event emitter noop.
   * https://github.com/paulmillr/chokidar#api
   */
  watcher: FSWatcher
  /**
   * Server web socket dengan metode `send(payload)`.
   */
  ws: WebSocketServer
  /**
   * Wadah plugin Rollup yang dapat menjalankan hook plugin pada file tertentu.
   */
  pluginContainer: PluginContainer
  /**
   * Grafik modul yang melacak hubungan impor, pemetaan url ke file
   * dan status hmr.
   */
  moduleGraph: ModuleGraph
  /**
   * URL yang sudah diselesaikan yang dicetak Vite di CLI. null dalam mode middleware atau
   * sebelum `server.listen` dipanggil.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Menyelesaikan, memuat, dan mengubah URL secara terprogram, dan dapatkan hasilnya
   * tanpa melewati pipeline permintaan http.
   */
  transformRequest(
    url: string,
    options?: TransformOptions,
  ): Promise<TransformResult | null>
  /**
   * Terapkan transformasi HTML bawaan Vite dan transformasi HTML plugin apa pun.
   */
  transformIndexHtml(url: string, html: string): Promise<string>
  /**
   * Memuat URL tertentu sebagai modul yang diinstansiasi untuk SSR.
   */
  ssrLoadModule(
    url: string,
    options?: { fixStacktrace?: boolean },
  ): Promise<Record<string, any>>
  /**
   * Perbaiki tumpukan kesalahan ssr.
   */
  ssrFixStacktrace(e: Error): void
  /**
   * Pemicu HMR untuk modul dalam grafik modul. Anda dapat menggunakan `server.moduleGraph`
   * API untuk mengambil modul yang akan dimuat ulang. Jika `hmr` adalah false, ini adalah operasi tanpa efek.
   */
  reloadModule(module: ModuleNode): Promise<void>
  /**
   * Mulai server.
   */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
  /**
   * Mulai ulang server.
   *
   * @param forceOptimize - memaksa pengoptimal untuk membuat bundle ulang, sama seperti flag CLI --force
   */
  restart(forceOptimize?: boolean): Promise<void>
  /**
   * Hentikan server.
   */
  close(): Promise<void>
  /**
   * Ikat pintasan CLI
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<ViteDevServer>): void
}
```

## `build`

**Tanda Tangan Tipe:**

```ts
async function build(
  inlineConfig?: InlineConfig,
): Promise<RollupOutput | RollupOutput[]>
```

**Contoh Penggunaan:**

```js
import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  await build({
    root: path.resolve(__dirname, './project'),
    base: '/foo/',
    build: {
      rollupOptions: {
        // ...
      },
    },
  })
})()
```

## `preview`

**Tanda Tangan Tipe:**

```ts
async function preview(inlineConfig?: InlineConfig): Promise<PreviewServer>
```

**Contoh Penggunaan:**

```js
import { preview } from 'vite'
;(async () => {
  const previewServer = await preview({
    // semua opsi konfigurasi pengguna yang valid, ditambah `mode` dan `configFile`
    preview: {
      port: 8080,
      open: true,
    },
  })

  previewServer.printUrls()
  previewServer.bindCLIShortcuts({ print: true })
})()
```

## `PreviewServer`

```ts
interface PreviewServer {
  /**
   * Objek konfigurasi vite yang sudah diselesaikan
   */
  config: ResolvedConfig
  /**
   * Instance aplikasi Connect.
   * - Dapat digunakan untuk menambahkan middleware kustom ke server pratinjau.
   * - Juga dapat digunakan sebagai fungsi penangan dari server http kustom
   *   atau sebagai middleware dalam kerangka kerja Node.js gaya Connect apa pun
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * instance server http Node asli
   */
  httpServer: http.Server
  /**
   * URL yang sudah diselesaikan yang dicetak Vite di CLI.
   * null sebelum server mendengarkan.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Cetak URL server
   */
  printUrls(): void
  /**
   * Ikat pintasan CLI
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<PreviewServer>): void
}
```

## `resolveConfig`

**Tanda Tangan Tipe:**

```ts
async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development',
  defaultNodeEnv = 'development',
  isPreview = false,
): Promise<ResolvedConfig>
```

Nilai `command` adalah `serve` dalam pengembangan dan pratinjau, dan `build` dalam pembangunan.

## `mergeConfig`

**Tanda Tangan Tipe:**

```ts
function mergeConfig(
  defaults: Record<string, any>,
  overrides: Record<string, any>,
  isRoot = true,
): Record<string, any>
```

Gabungkan secara mendalam dua konfigurasi Vite. `isRoot` mewakili tingkat dalam konfigurasi Vite yang sedang digabungkan. Misalnya, atur `false` jika Anda menggabungkan dua opsi `build`.

::: tip CATATAN
`mergeConfig` hanya menerima konfigurasi dalam bentuk objek. Jika Anda memiliki konfigurasi dalam bentuk panggilan kembali, Anda harus memanggilnya sebelum melewatkan ke `mergeConfig`.

Anda dapat menggunakan helper `defineConfig` untuk menggabungkan konfigurasi dalam bentuk panggilan kembali dengan konfigurasi lain:

```ts
export default defineConfig((configEnv) =>
  mergeConfig(configAsCallback(configEnv), configAsObject),
)
```

:::

## `searchForWorkspaceRoot`

**Tanda Tangan Tipe:**

```ts
function searchForWorkspaceRoot(
  current: string,
  root = searchForPackageRoot(current),
): string
```

**Terkait:** [server.fs.allow](/config/server-options.md#server-fs-allow)

Cari root dari workspace yang potensial jika memenuhi syarat berikut, jika tidak, akan kembali ke `root`:

- berisi bidang `workspaces` di `package.json`
- berisi salah satu dari file berikut
  - `lerna.json`
  - `pnpm-workspace.yaml`

## `loadEnv`

**Tanda Tangan Tipe:**

```ts
function loadEnv(
  mode: string,
  envDir: string,
  prefixes: string | string[] = 'VITE_',
): Record<string, string>
```

**Terkait:** [`.env` Files](./env-and-mode.md#env-files)

Muat file `.env` dalam `envDir`. Secara default, hanya variabel lingkungan yang diawali dengan `VITE_` yang dimuat, kecuali `prefixes` diubah.

## `normalizePath`

**Tanda Tangan Tipe:**

```ts
function normalizePath(id: string): string
```

**Terkait:** [Normalisasi Path](./api-plugin.md#path-normalization)

Normalisasi path untuk berinteraksi antara plugin Vite.

## `transformWithEsbuild`

**Tanda Tangan Tipe:**

```ts
async function transformWithEsbuild(
  code: string,
  filename: string,
  options?: EsbuildTransformOptions,
  inMap?: object,
): Promise<ESBuildTransformResult>
```

Mentransformasi JavaScript atau TypeScript dengan esbuild. Berguna untuk plugin yang lebih memilih transformasi esbuild internal Vite.

## `loadConfigFromFile`

**Tanda Tangan Tipe:**

```ts
async function loadConfigFromFile(
  configEnv: ConfigEnv,
  configFile?: string,
  configRoot: string = process.cwd(),
  logLevel?: LogLevel,
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null>
```

Muat file konfigurasi Vite secara manual dengan esbuild.