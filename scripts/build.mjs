import {readFile,writeFile,mkdir} from 'node:fs/promises';
const rawBase=process.env.BASE_PATH||'';
const base=rawBase.replace(/\/+$/,'');
if(!/^(?:\/[A-Za-z0-9._-]+)*$/.test(base)||base.split('/').some(segment=>segment==='.'||segment==='..'))throw new Error('BASE_PATH must be an absolute URL path without empty or dot segments');
const template=await readFile('src/index.html','utf8');
const routes={
  '':'Avtoresto — автоматизация HoReCa на iiko',
  equipment:'Оборудование и готовые комплекты — Avtoresto',
  'equipment/coffee':'Комплект для кофейни — Avtoresto',
  'equipment/cafe':'Комплект для кафе и фастфуда — Avtoresto',
  'equipment/restaurant':'Комплект для ресторана — Avtoresto',
  support:'Техническая поддержка — Avtoresto',
  'support/start':'Поддержка на старте — Avtoresto',
  'support/business':'Поддержка кафе — Avtoresto',
  'support/full':'Поддержка ресторана — Avtoresto',
  iiko:'Автоматизация с iiko — Avtoresto',
  about:'О компании и контакты — Avtoresto',
  privacy:'Конфиденциальность — Avtoresto',
};
const htmlFor=title=>template.replace(/<title>[^<]*<\/title>/,`<title>${title}</title>`).replace('content="__BASE_PATH__"',`content="${base}"`).replace(/\b(href|src)="\/(?!\/)/g,`$1="${base}/`);
for(const [route,title] of Object.entries(routes)){const dir='dist'+(route?'/'+route:'');await mkdir(dir,{recursive:true});await writeFile(dir+'/index.html',htmlFor(title));}
await writeFile('dist/404.html',htmlFor('Страница не найдена — Avtoresto'));
await writeFile('dist/.nojekyll','');
await writeFile('dist/build-info.json',JSON.stringify({base,routes:Object.keys(routes).map(r=>'/'+r)},null,2));
console.log(`Built ${Object.keys(routes).length} pages + 404. Base path: ${base||'/'}`);
