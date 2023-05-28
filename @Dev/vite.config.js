import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/

export default defineConfig({
  build:{
    lib: {
      entry: resolve(__dirname, 'main.js'),
      name: 'Sir',
      // the proper extensions will be added
      fileName: 'sir',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
          g:'g'
        }
      }
    },
    outDir:"../JS/sir"
  },
  plugins: [vue()],
})
