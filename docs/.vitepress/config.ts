import { defineConfig, DefaultTheme } from 'vitepress'
import { buildEnd } from './buildEnd.config'

const ogDescription = 'Alat frontend generasi berikutnya'
const ogImage = 'https://vitejs.dev/og-image.png'
const ogTitle = 'Vite'
const ogUrl = 'https://vitejs.dev'

// netlify envs
const deployURL = process.env.DEPLOY_PRIME_URL || ''
const commitRef = process.env.COMMIT_REF?.slice(0, 8) || 'dev'

const deployType = (() => {
  switch (deployURL) {
    case 'https://main--vite-docs-main.netlify.app':
      return 'main'
    case '':
      return 'local'
    default:
      return 'release'
  }
})()
const additionalTitle = ((): string => {
  switch (deployType) {
    case 'main':
      return ' (main branch)'
    case 'local':
      return ' (local)'
    case 'release':
      return ''
  }
})()
const versionLinks = ((): DefaultTheme.NavItemWithLink[] => {
  const oldVersions: DefaultTheme.NavItemWithLink[] = [
    {
      text: 'Dokumentasi Vite 4',
      link: 'https://v4.vitejs.dev',
    },
    {
      text: 'Dokumentasi Vite 3',
      link: 'https://v3.vitejs.dev',
    },
    {
      text: 'Dokumentasi Vite 2',
      link: 'https://v2.vitejs.dev',
    },
  ]

  switch (deployType) {
    case 'main':
    case 'local':
      return [
        {
          text: 'Dokumentasi Vite 5 (rilis)',
          link: 'https://vitejs.dev',
        },
        ...oldVersions,
      ]
    case 'release':
      return oldVersions
  }
})()

export default defineConfig({
  title: `Vite${additionalTitle}`,
  description: 'Next Generation Frontend Tooling',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', href: '/blog.rss' },
    ],
    ['link', { rel: 'me', href: 'https://m.webtoo.ls/@vite' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@vite_js' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'CBDFBSLI',
        'data-spa': 'auto',
        defer: '',
      },
    ],
  ],

  locales: {
    root: { label: 'English' },
    zh: { label: '简体中文', link: 'https://cn.vitejs.dev' },
    ja: { label: '日本語', link: 'https://ja.vitejs.dev' },
    es: { label: 'Español', link: 'https://es.vitejs.dev' },
    pt: { label: 'Português', link: 'https://pt.vitejs.dev' },
    ko: { label: '한국어', link: 'https://ko.vitejs.dev' },
    de: { label: 'Deutsch', link: 'https://de.vitejs.dev' },
    id: { label: 'Indonesia', link: 'https://id.vitejs.dev' },
  },

  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/vitejs/vite/edit/main/docs/:path',
      text: 'Sarankan perubahan pada halaman ini',
    },

    socialLinks: [
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@vite' },
      { icon: 'twitter', link: 'https://twitter.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vitejs.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' },
    ],

    algolia: {
      appId: '7H67QR5P0A',
      apiKey: 'deaab78bcdfe96b599497d25acc6460e',
      indexName: 'vitejs',
      searchParameters: {
        facetFilters: ['tags:en'],
      },
    },

    carbonAds: {
      code: 'CEBIEK3N',
      placement: 'vitejsdev',
    },

    footer: {
      message: `Dirilis di bawah Lisensi MIT. (${commitRef})`,
      copyright: 'Hak Cipta © 2019-sekarang Evan You & Kontributor Vite ',
    },

    nav: [
      { text: 'Panduan', link: '/guide/', activeMatch: '/guide/' },
      { text: 'Konfigurasi', link: '/config/', activeMatch: '/config/' },
      { text: 'Plugin', link: '/plugins/', activeMatch: '/plugins/' },
      {
        text: 'Resources',
        items: [
          { text: 'Tim', link: '/team' },
          { text: 'Blog', link: '/blog' },
          { text: 'Rilis', link: '/releases' },
          {
            items: [
              {
                text: 'Twitter',
                link: 'https://twitter.com/vite_js',
              },
              {
                text: 'Obrolan Discord',
                link: 'https://chat.vitejs.dev',
              },
              {
                text: 'Vite yang luar biasa',
                link: 'https://github.com/vitejs/awesome-vite',
              },
              {
                text: 'ViteConf',
                link: 'https://viteconf.org',
              },
              {
                text: 'Komunitas DEV',
                link: 'https://dev.to/t/vite',
              },
              {
                text: 'kompatibilitas Plugin Rollup',
                link: 'https://vite-rollup-plugins.patak.dev/',
              },
              {
                text: 'Daftar perubahan',
                link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md',
              },
              {
                text: 'Kontribusi',
                link: 'https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md',
              },
            ],
          },
        ],
      },
      {
        text: 'Versi',
        items: versionLinks,
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Panduan',
          items: [
            {
              text: 'Mengapa Vite',
              link: '/guide/why',
            },
            {
              text: 'Memulai',
              link: '/guide/',
            },
            {
              text: 'Fitur',
              link: '/guide/features',
            },
            {
              text: 'CLI',
              link: '/guide/cli',
            },
            {
              text: 'Menggunakan Plugin',
              link: '/guide/using-plugins',
            },
            {
              text: 'Dependensi Pre-Bundling',
              link: '/guide/dep-pre-bundling',
            },
            {
              text: 'Penanganan Aset Statis',
              link: '/guide/assets',
            },
            {
              text: 'Membangun untuk Produksi',
              link: '/guide/build',
            },
            {
              text: 'Mendeploy Situs Statis',
              link: '/guide/static-deploy',
            },
            {
              text: 'Env Variabel and Mode',
              link: '/guide/env-and-mode',
            },
            {
              text: 'Rendering Sisi Server (SSR)',
              link: '/guide/ssr',
            },
            {
              text: 'Integrasi Backend',
              link: '/guide/backend-integration',
            },
            {
              text: 'Perbandingan',
              link: '/guide/comparisons',
            },
            {
              text: 'Pemecahan masalah',
              link: '/guide/troubleshooting',
            },
            {
              text: 'Performa',
              link: '/guide/performance',
            },
            {
              text: 'Filosofi',
              link: '/guide/philosophy',
            },
            {
              text: 'Migrasi dari v4',
              link: '/guide/migration',
            },
          ],
        },
        {
          text: 'APIs',
          items: [
            {
              text: 'API Plugin',
              link: '/guide/api-plugin',
            },
            {
              text: 'HMR API',
              link: '/guide/api-hmr',
            },
            {
              text: 'JavaScript API',
              link: '/guide/api-javascript',
            },
            {
              text: 'Referensi Konfigurasi',
              link: '/config/',
            },
          ],
        },
      ],
      '/config/': [
        {
          text: 'Konfigurasi',
          items: [
            {
              text: 'Mengonfigurasi Vite',
              link: '/config/',
            },
            {
              text: 'Opsi Bersama',
              link: '/config/shared-options',
            },
            {
              text: 'Opsi Server',
              link: '/config/server-options',
            },
            {
              text: 'Opsi Pembuatan',
              link: '/config/build-options',
            },
            {
              text: 'Opsi Pratinjau',
              link: '/config/preview-options',
            },
            {
              text: 'Opsi Pengoptimalan Dep',
              link: '/config/dep-optimization-options',
            },
            {
              text: 'Opsi SSR',
              link: '/config/ssr-options',
            },
            {
              text: 'Opsi Pekerja',
              link: '/config/worker-options',
            },
          ],
        },
      ],
    },

    outline: {
      level: [2, 3],
    },
  },
  buildEnd,
})
