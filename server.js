// 零依赖静态 HTTP 服务器：
// - 双栈监听 IPv4 + IPv6（listen on '::'，大多数 Linux 自动启用 IPv4-mapped-IPv6）
// - 完整 MIME 表
// - SPA 应用 fallback 到 /index.html
// - 直接 serve ./dist 目录（npm run build 的产物）
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, 'dist');
const PORT = Number(process.env.PORT ?? 3000);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.map':  'application/json; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8',
};

function send(res, status, body, extraHeaders = {}) {
  const headers = {
    'Cache-Control': status === 200 && extraHeaders['Content-Type']?.includes('text/html')
      ? 'no-cache'
      : (status === 200 ? 'public, max-age=3600' : 'no-store'),
    ...extraHeaders,
  };
  if (body != null && !('Content-Length' in headers)) {
    headers['Content-Length'] = Buffer.byteLength(body);
  }
  res.writeHead(status, headers);
  res.end(body);
}

function serveFile(res, filePath) {
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // SPA fallback: 非文件路径 → 返回 /index.html
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (e2, data) => {
        if (e2) return send(res, 500, 'Internal Error', {'Content-Type': 'text/plain; charset=utf-8'});
        send(res, 200, data, {'Content-Type': 'text/html; charset=utf-8'});
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] ?? 'application/octet-stream';
    const stream = fs.createReadStream(filePath);
    const headers = {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Cache-Control': contentType.startsWith('text/html') ? 'no-cache' : 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    };
    res.writeHead(200, headers);
    stream.on('error', () => send(res, 500, 'Read Error'));
    stream.pipe(res);
  });
}

const server = http.createServer((req, res) => {
  // 允许任意 Host + Origin，避免 IDE 预览代理/浏览器跨域拦截
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') { send(res, 204, ''); return; }
  if (req.method !== 'GET' && req.method !== 'HEAD') { send(res, 405, 'Method Not Allowed'); return; }

  const rawPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let safePath = path.normalize(rawPath).replace(/^(\.\.(\/|\\|$))+/, '');
  if (safePath === '/' || safePath === '') safePath = '/index.html';
  const filePath = path.join(DIST_DIR, safePath);

  // 防止目录穿越
  if (!filePath.startsWith(DIST_DIR)) { send(res, 403, 'Forbidden'); return; }
  serveFile(res, filePath);
});

// '::' = IPv6 wildcard，Linux 默认启用 IPV6_V6ONLY=0 时会同时接受 IPv4（映射为 ::ffff:x.x.x.x）
// 即双栈同时监听 IPv4 + IPv6 的 3000 端口
server.listen(PORT, '::', () => {
  const p = server.address().port;
  const family = server.address().family;
  console.log(`\n  静态服务器已就绪（零依赖 Node http）`);
  console.log(`  ➜  监听地址:  :: (family=${family}, 同时接受 IPv4+IPv6)`);
  console.log(`  ➜  Local:    http://localhost:${p}/`);
  console.log(`  ➜  IPv4:     http://127.0.0.1:${p}/`);
  console.log(`  ➜  IPv6:     http://[::1]:${p}/`);
  console.log(`  ➜  根目录:   ${DIST_DIR}\n`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`❌ 端口 ${PORT} 被占用，请先关闭已有的服务：ss -tlnp | grep ${PORT}`);
    process.exit(1);
  }
  throw e;
});
