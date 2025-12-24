import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 깃허브 저장소 이름이 'hanja'이므로 아래와 같이 설정합니다.
  base: '/hanja/',
})