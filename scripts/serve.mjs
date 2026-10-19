import http from 'node:http';
import { readFile, stat, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname, relative, isAbsolute, sep } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', process.env.SITE_DIR || (process.argv.includes('--preview')?'.local/preview':process.argv.includes('--dist')?'dist':'.'));
const port = Number(process.env.PORT || 4186);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.xml':'application/xml; charset=utf-8','.md':'text/plain; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8'};
export function publicPath(raw) {
  let path; try { path = decodeURIComponent(raw.split('?')[0]); } catch { return null; }
  if (path === '/') path = '/index.html';
  if (path.includes('\\') || path.split('/').some(s => s.startsWith('.') || s === '..')) return null;
  if (path.startsWith('/data/') && !/^\/data\/(?:articles|tools)\.json$/.test(path)) return null;
  if (!/^\/(?:index\.html|tools\.html|robots\.txt|sitemap\.xml|release\.json|README\.md|LICENSE|CONTENT_POLICY\.md|CONTRIBUTING\.md)$/.test(path) && !/^\/(?:assets|data|docs|articles)\/[^\0]+$/.test(path)) return null;
  return path.slice(1);
}
export function createServer(directory=root) {
  return http.createServer(async (req,res) => {
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405,{'Allow':'GET, HEAD'}).end(); return; }
    const path = publicPath(req.url || '/');
    if (!path) { res.writeHead(404).end('未找到'); return; }
    try {
      const base=await realpath(directory),filename=await realpath(resolve(base,path)),rel=relative(base,filename);
      if (rel==='..' || rel.startsWith('..'+sep) || isAbsolute(rel)) throw new Error('Outside public directory');
      if (!(await stat(filename)).isFile()) throw new Error('Not a file');
      const bytes = await readFile(filename);
      res.writeHead(200,{'Content-Type':mime[extname(filename)] || 'text/plain; charset=utf-8','Content-Length':bytes.length,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'});
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch { res.writeHead(404).end('未找到'); }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createServer();
  server.on('error',error => { console.error(error.code === 'EADDRINUSE' ? `端口 ${port} 已占用，请使用 PORT=其他端口 npm run dev` : error.message); process.exitCode=1; });
  server.listen(port,'127.0.0.1',()=>console.log(`Awesome X Growth 本地预览：http://127.0.0.1:${port}`));
}
