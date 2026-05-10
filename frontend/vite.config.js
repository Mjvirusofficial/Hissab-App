import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // Isse local development me bhi PWA chalega
      },
      manifest: {
        name: 'D-Hisaab - Smart Expense Tracker',
        short_name: 'D-Hisaab',
        description: 'Track your expenses effortlessly with D-Hisaab. Simple, secure, and fast expense tracking app.',
        theme_color: '#6366f1',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'Logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'Logo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'Logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
