import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 🔽 ADD THIS 'server' BLOCK 🔽
  server: {
    proxy: {
      // Proxying all requests starting with '/api' to your backend server
      '/api': {
        target: 'http://localhost:5000', // Your backend server URL and port
        changeOrigin: true, // Needed for virtual hosting sites
        secure: false, // Set to true if your backend uses HTTPS
      },
      // You may need to add additional proxies for specific routes like user authentication
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
  // 🔼 END OF 'server' BLOCK 🔼
})