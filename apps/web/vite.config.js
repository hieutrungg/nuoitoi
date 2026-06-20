import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Content-Security-Policy: chỉ chèn vào bản build (production), không áp dev
// để tránh chặn inline script của Vite/React-Refresh khi chạy `npm run dev`.
// Whitelist đúng những nguồn app thực sự cần: Google Fonts + QR server + WS.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Tailwind/Framer/Recharts dùng inline style
  'font-src https://fonts.gstatic.com',
  "img-src 'self' data: https://img.vietqr.io",
  "connect-src 'self' ws: wss:", // chừa sẵn cho WebSocket realtime
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'", // chống clickjacking (nhúng iframe)
  "object-src 'none'",
].join('; ');

function cspPlugin() {
  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '</title>',
        `</title>\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), cspPlugin()],
  server: { port: 5173 },
});
