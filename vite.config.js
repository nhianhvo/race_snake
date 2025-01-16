import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Lắng nghe tất cả địa chỉ network
    port: 5173  // Port mặc định của Vite
  }
})
