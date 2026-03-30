/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    !process.env.VITEST && TanStackRouterVite(),
    react(),
  ],
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.tanstack'],
  },
})
