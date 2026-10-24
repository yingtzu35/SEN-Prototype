import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('.', import.meta.url));
http.createServer(async (req,res) => {
  const path = new URL(req.url,'http://localhost').pathname;
  const allowed = {'/':'index.html','/app.js':'app.js','/style.css':'style.css','/model.js':'model.js'};
  if (!allowed[path]) {res.writeHead(404); return res.end('Not found');}
  try { const data=await readFile(root+allowed[path]); res.setHeader('Content-Type',path.endsWith('.js')?'text/javascript; charset=utf-8':path.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8'); res.end(data); }
  catch {res.writeHead(500);res.end('Unable to load application');}
}).listen(process.env.PORT || 3000,'0.0.0.0');
