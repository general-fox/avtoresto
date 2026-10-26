import {readFile,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const app=await readFile('dist/app.js','utf8');
const {routes,base}=JSON.parse(await readFile('dist/build-info.json','utf8'));
const root=path.resolve('dist');
const checkedAssets=new Set();
const cssFiles=new Set();
async function checkAsset(url,owner){
  if(url.origin!=='http://local.test')return;
  assert(!base||url.pathname.startsWith(base+'/'),owner+': asset is missing the site base: '+url.pathname);
  const relative=decodeURIComponent(url.pathname.slice(base.length)).replace(/^\/+/, '');
  const file=path.resolve(root,relative);
  assert(file.startsWith(root+path.sep),owner+': asset escapes the site directory');
  if(checkedAssets.has(file))return;
  const info=await stat(file);
  assert(info.isFile()&&info.size>0,owner+': missing or empty asset: '+relative);
  checkedAssets.add(file);
  if(path.extname(file)==='.css')cssFiles.add(file);
}
for(const route of [...routes,'/404.html']){
  const file=route==='/404.html'?'dist/404.html':'dist'+(route==='/'?'':route)+'/index.html';
  const html=await readFile(file,'utf8');
  assert(html.includes('lang="ru"'),file+': Russian document language missing');
  assert(html.includes(`name="site-base" content="${base}"`),file+': base path mismatch');
  assert(html.includes(`src="${base}/app.js"`),file+': script URL mismatch');
  for(const stylesheet of ['styles.css','refinement.css'])assert(html.includes(`href="${base}/${stylesheet}"`),file+': stylesheet URL missing: '+stylesheet);
  assert(html.indexOf(`href="${base}/styles.css"`)<html.indexOf(`href="${base}/refinement.css"`),file+': refinement styles must load after base styles');
  for(const tag of html.matchAll(/<(?:script|link)\b[^>]*>/gi)){
    const asset=tag[0].match(/\b(?:src|href)=["']([^"']+)["']/i);
    if(asset)await checkAsset(new URL(asset[1],`http://local.test${base}/`),file);
  }
}
for(const file of cssFiles){
  const css=await readFile(file,'utf8');
  const stylesheetUrl=new URL(base+'/'+path.relative(root,file).split(path.sep).join('/'),'http://local.test');
  for(const asset of css.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/gi)){
    if(asset[1].startsWith('#'))continue;
    await checkAsset(new URL(asset[1],stylesheetUrl),file);
  }
}
assert(!/991|850[- ]?36|figma\.com\/api\/mcp\/asset/.test(app),'Old contact or temporary asset URL found in app');
assert(app.includes('https://t.me/posadmin_request_bot'),'Telegram contact missing');
const referenced=[...new Set([...app.matchAll(/['"]([a-zA-Z0-9-]+\.(?:png|svg|webp|jpg))['"]/g)].map(m=>m[1]))];
for(const asset of referenced)assert((await stat('dist/assets/'+asset)).size>0,'Missing asset: '+asset);
assert((await readFile('dist/styles.css','utf8')).includes('prefers-reduced-motion'),'Reduced-motion support missing');
assert((await readFile('dist/404.html','utf8')).includes('Страница не найдена'),'404 page missing');
console.log(`PASS: ${routes.length} routes, ${referenced.length} referenced images, ${checkedAssets.size} linked assets including styles and fonts, base path, Telegram target, old-number removal, 404 and motion preference.`);
