import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // host:true = 同时监听 IPv4 0.0.0.0 和 IPv6 [::] 双栈，
      // 避免浏览器优先解析 IPv6 的 localhost (::1) 而 vite 仅绑 IPv4 导致直接被拒
      host: true,
      port: 3000,
      strictPort: true,
      cors: true,
      // 关闭 Vite Host 安全校验：IDE 预览窗代理转发时 Host header 可能是任意值，避免 403
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
