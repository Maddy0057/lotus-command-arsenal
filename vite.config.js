import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/lotus-command-arsenal/',
  plugins: [react()],
})
