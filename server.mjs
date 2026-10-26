import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const {base=''}=JSON.parse(await readFile(path.join(root,'build-info.json'),'utf8'));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.otf':'font/otf','.json':'application/json','.txt':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
  try {
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'}).end();return;}
    const url=new URL(req.url,'http://localhost');
    let pathname;
    try{pathname=decodeURIComponent(url.pathname);}catch{res.writeHead(400).end('Некорректный адрес');return;}
    if(base&&(pathname==='/'||pathname===base)){res.writeHead(302,{'Location':base+'/'+url.search}).end();return;}
    if(base&&!pathname.startsWith(base+'/')){res.writeHead(404).end('Страница не найдена');return;}
    const sitePath=pathname.slice(base.length);
    let target=path.resolve(root,'.'+sitePath);
    if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    let status=200;
    try{
      if((await stat(target)).isDirectory()){
        if(!pathname.endsWith('/')){res.writeHead(308,{'Location':url.pathname+'/'+url.search}).end();return;}
        target=path.join(target,'index.html');
      }
      await stat(target);
    }
    catch{if(path.extname(sitePath)){res.writeHead(404).end();return;}target=path.join(root,'404.html');status=404;}
    const content=await readFile(target);
    res.writeHead(status,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD'?undefined:content);
  } catch {res.writeHead(500).end('Ошибка сервера');}
});
const port=Number(process.env.PORT??4173);
if(!Number.isInteger(port)||port<0||port>65535)throw new Error('PORT must be an integer between 0 and 65535');
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${server.address().port}${base}/`));
