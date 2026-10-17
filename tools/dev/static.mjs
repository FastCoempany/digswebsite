// Minimal static file server for the built Storybook (used by the story-matrix tests).
// usage: node tools/dev/static.mjs <dir> <port>
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {execSync} from 'node:child_process';

const [dir = 'storybook-static', port = '6007'] = process.argv.slice(2);
const root = path.resolve(dir);
if (!fs.existsSync(path.join(root, 'index.json'))) {
  console.log(`[static] ${dir} missing, building Storybook…`);
  execSync('npx storybook build -o storybook-static --quiet', {stdio: 'inherit'});
}
const types = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.map': 'application/json', '.ico': 'image/x-icon', '.txt': 'text/plain'};
http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let file = path.join(root, url === '/' ? 'index.html' : url);
    if (!file.startsWith(root)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) return res.writeHead(404).end('not found');
    res.writeHead(200, {'Content-Type': types[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache'});
    fs.createReadStream(file).pipe(res);
  })
  .listen(Number(port), () => console.log(`[static] serving ${dir} on http://localhost:${port}`));
