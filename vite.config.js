import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' 
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    open: true
  }
})
//226297600572-0749f3otaibtnkl45aga4g6fnrqebhtl.apps.googleusercontent.com
//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