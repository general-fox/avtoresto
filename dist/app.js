const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const BASE = document.querySelector('meta[name="site-base"]')?.content || '';
const ASSET = BASE + '/assets/';
const TELEGRAM = 'https://t.me/posadmin_request_bot';
const icon = (name, cls = '') => {
  const paths = {
    arrow: '<path d="M4 12h15M13 5l7 7-7 7"/>',
    diagonal: '<path d="M6 18 18 6M6 6h12v12"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    cup: '<path d="M4 7h12v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5ZM16 8h2a3 3 0 1 1 0 6h-2M7 3v1M12 3v1"/>',
    restaurant: '<path d="M5 3v6a3 3 0 0 0 6 0V3M8 3v18M18 3c-3 3-3 8 0 9v9M18 3v9"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    screen: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4M7 8h4M7 12h9"/>',
    headset: '<path d="M4 14V11a8 8 0 0 1 16 0v3M4 12H3v6h4v-6ZM20 12h1v6h-4v-6ZM20 18c0 3-4 3-7 3"/>',
    pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
    telegram: '<path d="m21 3-4 18-6-5-3 3 1-6L21 3 3 10l6 3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    box: '<path d="m3 7 9-4 9 4v10l-9 4-9-4ZM3 7l9 4 9-4M12 11v10M7 5l10 4"/>',
    shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
    copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v12h5"/>',
    chart: '<path d="M3 3v18h18M7 15l4-5 4 3 5-7"/>',
  };
  return `<svg class="icon ${cls}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
};
const brand = () => '<span class="brand">avto.res<span class="brand-t">t</span>o</span>';
const iiko = '<span class="iiko">iiko</span>';
const image = (file, alt, cls = '', eager = false) => `<img class="${cls}" src="${ASSET}${file}" alt="${alt}" loading="${eager ? 'eager' : 'lazy'}" decoding="async">`;
const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const action = (label, context = 'Консультация', cls = 'button-primary') => `<button class="button ${cls}" data-request="${escapeHTML(context)}">${label}${icon('diagonal')}</button>`;
const link = (label, href, cls = 'button-outline') => `<a class="button ${cls}" href="${href}" data-link>${label}${icon('arrow')}</a>`;
const checkList = items => `<ul class="check-list">${items.map(t => `<li>${icon('check')}<span>${t}</span></li>`).join('')}</ul>`;
const equipment = [
  {id:'coffee',name:'Кофейня',label:'Для кофеен и небольших точек',image:'e53c0.png',tag:'Компактный старт',icon:'cup',desc:'Компактная касса, печать чеков и учёт продаж.',items:['POS-терминал','Чековый принтер','Денежный ящик','Настройка iiko и обучение'],details:['Подберём терминал под нагрузку и рабочее место бариста.','Подключим печать чеков и периферийное оборудование.','Настроим меню, модификаторы и права сотрудников.','Поможем освоиться после запуска.']},
  {id:'cafe',name:'Кафе и фастфуд',label:'Для кафе, веранд и фастфуда',image:'7970b.png',tag:'Больше возможностей',icon:'grid',desc:'Приём заказов, связь с кухней и работа навынос.',items:['POS-терминал','Фискальный регистратор','Принтер пречеков и сканер','Настройка iiko и обучение'],details:['Настроим кассовую зону и сценарии быстрого обслуживания.','Соединим кассу с кухней и печатью заказов.','Поможем организовать работу зала и заказов навынос.','Обучим команду перед первой сменой.']},
  {id:'restaurant',name:'Ресторан',label:'Для ресторанов с полным сервисом',image:'71f22.png',tag:'Единая система',icon:'restaurant',desc:'Рабочие места для зала, кухни и управления.',items:['Кассовое рабочее место','Принтеры на кухню','Сканер и денежный ящик','Внедрение и обучение команды'],details:['Спроектируем рабочие места под ваш зал и кухню.','Настроим передачу заказов по цехам и сервисную печать.','Поможем организовать складской и управленческий учёт.','Подключим сопровождение для ежедневной работы.']},
];
const support = [
  {id:'start',name:'На старте',format:'Кофейня, столовая, небольшая точка',desc:'Поддержка кассы, оборудования и команды в ежедневной работе.'},
  {id:'business',name:'В рабочем ритме',format:'Кафе, веранда, фастфуд',desc:'Сопровождение процессов, когда заказов становится больше.'},
  {id:'full',name:'Всё под контролем',format:'Ресторан и несколько точек',desc:'Комплексный подход к работе зала, кухни и учёта.'},
];
const breadcrumbs = items => `<nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="/" data-link>Главная</a>${items.map(([text,url])=>`<span aria-hidden="true">/</span>${url?`<a href="${url}" data-link>${text}</a>`:`<span aria-current="page">${text}</span>`}`).join('')}</nav>`;
const sectionIntro = (eyebrow,title,description='') => `<div class="section-heading"><div><div class="eyebrow">${eyebrow}</div><h2>${title}</h2></div>${description?`<p>${description}</p>`:''}</div>`;
const pageIntro = (eyebrow,title,desc) => `<div class="page-intro"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${desc}</p></div>`;
const contactBanner = () => `<section class="consultation-section"><div><span class="eyebrow">СЛЕДУЮЩИЙ ШАГ</span><h2>Расскажите о задаче.<br><span>Предложим решение.</span></h2><p>Согласуем состав, стоимость и сроки до начала работ.</p></div>${action('Обсудить проект','Индивидуальное решение','button-dark')}</section>`;
function equipmentCard(p) {return `<article class="product-card"><a href="/equipment/${p.id}" data-link class="product-image" aria-label="Комплект: ${p.name}"><span class="tag">${p.tag}</span>${image(p.image,'Комплект оборудования: '+p.name)}<span class="circle-arrow">${icon('diagonal')}</span></a><div class="product-content"><h3><a href="/equipment/${p.id}" data-link>${p.name}</a></h3><p>${p.desc}</p><div class="product-bottom"><span>Под вашу задачу</span><a href="/equipment/${p.id}" data-link>Подробнее ${icon('arrow')}</a></div></div></article>`;}
function figmaBrand() {
  return `<span class="figma-wordmark" aria-hidden="true"><span class="figma-wordmark-text"><span class="word-avt">avt</span><span class="word-o">o</span>.<span class="word-re">re</span>s</span><img class="figma-wordmark-t" src="${ASSET}74a57.svg" alt=""><span class="figma-wordmark-end">o</span></span>`;
}
function renderHeader(path) {
  const active=path.split('/')[1];
  $('#header').innerHTML=`<div class="figma-header"><a href="/" data-link class="figma-brand-link" aria-label="Avtoresto — главная">${figmaBrand()}</a><div class="figma-header-content"><div class="figma-header-meta"><span class="figma-address">Новороссийск, улица Видова&nbsp; 4</span><a class="figma-telegram" href="${TELEGRAM}" target="_blank" rel="noopener noreferrer"><span>@posadmin_request_bot</span><span class="figma-social"><img src="${ASSET}62bf9.png" alt="Telegram" class="figma-social-icon"><img src="${ASSET}ab45c.svg" alt="" class="figma-social-tint"></span></a></div><nav class="main-nav figma-nav" id="main-nav" aria-label="Основная навигация">${[['equipment','Оборудование'],['iiko','iiko'],['support','Поддержка'],['about','О нас']].map(([url,text])=>`<a href="/${url}" data-link class="${url==='iiko'?'figma-iiko-link':''}" ${active===url?'aria-current="page"':''}>${text}</a>`).join('')}</nav></div><button class="menu-toggle" aria-controls="main-nav" aria-expanded="false" aria-label="Открыть меню">${icon('menu')}</button></div>`;
}
function renderFooter() {
  if(document.body.classList.contains('is-figma-home')){$('#footer').innerHTML='';return;}
  $('#footer').innerHTML=`<div class="container"><div class="footer-main"><a href="/" data-link class="brand-link">${brand()}</a><nav aria-label="Дополнительная навигация"><a href="/equipment" data-link>Оборудование</a><a href="/iiko" data-link>iiko</a><a href="/support" data-link>Поддержка</a><a href="/about" data-link>О нас</a></nav><a class="footer-telegram" href="${TELEGRAM}" target="_blank" rel="noopener noreferrer">Telegram ${icon('diagonal')}</a></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Avtoresto</span><span>Автоматизация HoReCa · Партнёр iiko</span><a href="/privacy" data-link>Конфиденциальность</a></div></div>`;
}
function home() {
  const logos=[['b50a2.png','Stars Coffee','logo-stars'],['8b6a9.png','Red Box','logo-redbox'],['b6e61.png','Domino Pizza','logo-domino'],['5d595.png','AVA','logo-ava'],['f0e14.png','5642 Высота','logo-vysota'],['6b3ce.png','Магадан','logo-magadan']];
  return `<div class="figma-home">
    <section class="figma-offers" aria-label="Решения Avtoresto">
      <a href="/equipment" data-link class="figma-offer figma-offer-equipment">
        <h1>Готовые<br>комплекты<br><span>для</span><br>Вашего бизнеса</h1>
        <img class="figma-offer-arrow" src="${ASSET}cef34.svg" alt="">
        <ul class="figma-benefits"><li>быстрый запуск</li><li>две недели сопровождения</li><li><strong>месяц подписки на <em>iiko</em></strong></li><li>один год гарантии на оборудование</li></ul>
      </a>
      <a href="/support" data-link class="figma-offer figma-offer-support">
        <h2>Комплексное<br>обслуживание<br><span>от</span><br>Официального дилера</h2>
        <img class="figma-offer-arrow" src="${ASSET}ce620.svg" alt="">
        <ul class="figma-benefits"><li>24 часа 7 дней в неделю</li><li>удобный способ взаимодействия</li><li><strong>гибкие варианты обслуживания</strong></li><li>быстрое решение вопросов</li></ul>
      </a>
    </section>
    <div class="figma-content-slots" aria-hidden="true"><div></div><div></div><div></div><div></div></div>
    <section class="figma-partners" aria-label="Логотипы" aria-roledescription="карусель"><div class="figma-logo-track">${logos.map(([src,alt,cls])=>`<div class="figma-logo-tile"><img src="${ASSET}${src}" alt="${alt}" class="${cls}" loading="eager"></div>`).join('')}</div><button class="figma-next-logos" data-next-logos aria-label="Следующие логотипы"><img src="${ASSET}aab41.svg" alt=""></button></section>
  </div>`;
}

function equipmentPage() {return `<div class="container">${breadcrumbs([['Готовые комплекты']])}${pageIntro('ОБОРУДОВАНИЕ И ЗАПУСК','Оборудование<br>для вашего формата.','Подберём комплект для вашего заведения, настроим iiko и поможем команде начать работу.')}<div class="filter-bar" role="group" aria-label="Формат заведения">${[['all','Все форматы'],['coffee','Кофейня'],['cafe','Кафе и фастфуд'],['restaurant','Ресторан']].map(([id,label])=>`<button class="filter-chip ${id==='all'?'active':''}" data-filter="${id}" aria-pressed="${id==='all'}">${label}</button>`).join('')}</div><div class="product-grid equipment-results">${equipment.map(equipmentCard).join('')}</div><div class="included-strip">${[['shield','Подбор совместимого оборудования'],['screen','Настройка системы'],['headset','Обучение и сопровождение']].map(([i,t])=>`<span>${icon(i)}${t}</span>`).join('')}</div><section class="section faq-section">${sectionIntro('ЧАСТЫЕ ВОПРОСЫ','Перед запуском.')}<div class="faq-list">${[['Можно использовать наше оборудование?','Да. Сначала проверим характеристики, состояние и совместимость с выбранной конфигурацией. После проверки предложим, что оставить, а что заменить.'],['Что входит в стоимость?','Состав оборудования, лицензии, внедрение и сопровождение согласовываем отдельно в предложении. Так вы заранее понимаете, за что платите.'],['Вы обучаете сотрудников?','Да, покажем команде основные сценарии работы: от открытия смены до приёма заказа и закрытия кассы.'],['Как организованы оплата и доставка?','Условия оплаты, доставки и установки согласуем после подбора комплекта. Напишите нам в Telegram — подготовим предложение под ваш адрес и сроки.']].map(([q,a])=>`<details><summary>${q}${icon('chevron')}</summary><p>${a}</p></details>`).join('')}</div></section>${contactBanner()}</div>`;}
function equipmentDetail(id) {const p=equipment.find(x=>x.id===id);if(!p)return notFound();return `<div class="container">${breadcrumbs([['Готовые комплекты','/equipment'],[p.name]])}<section class="detail-hero"><div class="detail-product-image"><span class="tag">${p.tag}</span>${image(p.image,'Оборудование: '+p.name,'',true)}<button class="image-expand" data-enlarge="${p.image}" aria-label="Увеличить изображение">${icon('diagonal')}</button></div><div class="detail-copy"><div class="eyebrow">ГОТОВОЕ РЕШЕНИЕ / ${p.label.toUpperCase()}</div><h1>${p.name}</h1><p class="lead">${p.desc}</p>${checkList(p.items)}<div class="quote-price"><strong>Рассчитаем под ваш проект</strong><span>Стоимость зависит от состава и конфигурации.</span></div>${action('Получить предложение','Комплект: '+p.name)}<div class="detail-note">Вместе подберём оборудование и согласуем условия запуска.</div></div></section><section class="section">${sectionIntro('ПРОДУМАНО ДО ДЕТАЛЕЙ','Что сделаем для запуска.')}<div class="detail-features">${p.details.map((t,n)=>`<article><span>0${n+1}</span><p>${t}</p></article>`).join('')}</div></section><section class="section compact-section">${sectionIntro('ДРУГИЕ ФОРМАТЫ','Для других форматов.')}<div class="product-grid two-products">${equipment.filter(x=>x.id!==id).map(equipmentCard).join('')}</div></section>${contactBanner()}</div>`;}
function supportPage() {return `<div class="container">${breadcrumbs([['Поддержка']])}${pageIntro('ТЕХНИЧЕСКАЯ ПОДДЕРЖКА 24/7','Поддержка.<br>Когда она нужна.','Поможем с iiko и оборудованием. Подберём состав сопровождения под ваше заведение.')}<div class="support-grid">${support.map((p,n)=>`<article class="support-plan ${n===1?'featured-plan':''}">${n===1?'<span class="plan-label">ДЛЯ РАСТУЩЕГО БИЗНЕСА</span>':''}<div class="support-plan-number">0${n+1}<span>ПОДДЕРЖКА</span></div><div class="support-plan-body"><span class="overline">${p.format}</span><h2>${p.name}</h2><p>${p.desc}</p><a class="button ${n===1?'button-dark':'button-outline'}" href="/support/${p.id}" data-link>Подробнее ${icon('arrow')}</a></div></article>`).join('')}</div><section class="section support-promise"><div><div class="eyebrow">КОМАНДА, НА КОТОРУЮ МОЖНО ОПЕРЕТЬСЯ</div><h2>Технические вопросы —<br>наша забота.</h2></div><div>${checkList(['Удобное общение в Telegram','Взаимодействие с залом, кухней и бухгалтерией','Помощь с оборудованием и программным обеспечением','Сопровождение после запуска'])}</div></section>${contactBanner()}</div>`;}
function supportDetail(id) {const p=support.find(x=>x.id===id);if(!p)return notFound();return `<div class="container">${breadcrumbs([['Поддержка','/support'],[p.name]])}<section class="detail-hero support-detail"><div class="support-detail-image"><div class="support-typography"><span>НА СВЯЗИ</span><strong>24/7</strong><p>Техническая поддержка<br>вашего заведения</p></div></div><div class="detail-copy"><div class="eyebrow">СОПРОВОЖДЕНИЕ / ${p.format.toUpperCase()}</div><h1>${p.name}</h1><p class="lead">${p.desc}</p>${checkList(['Поддержка работы системы автоматизации','Помощь с неисправностями оборудования и ПО','Обучение сотрудников правилам работы'])}<div class="quote-price"><strong>Ваш план сопровождения</strong><span>Согласуем задачи, условия и период оплаты.</span></div>${action('Подключить поддержку','Поддержка: '+p.name)}</div></section><section class="section">${sectionIntro('ВАЖНО ДЛЯ БИЗНЕСА','Что входит в работу.')}<div class="steps three-steps"><article><span class="step-number">01</span><h3>Одна команда</h3><p>Помогаем сотрудникам зала, кухни, администрации и бухгалтерии работать с общей системой.</p></article><article><span class="step-number">02</span><h3>Понятное общение</h3><p>Объясняем решения и помогаем команде уверенно пользоваться оборудованием.</p></article><article><span class="step-number">03</span><h3>Гибкий подход</h3><p>Подбираем состав сопровождения по масштабу заведения и вашим рабочим процессам.</p></article></div></section>${contactBanner()}</div>`;}
function iikoPage() {return `<div class="container">${breadcrumbs([['Система iiko']])}<section class="iiko-page-hero"><div><div class="partner-pill"><span class="status-dot"></span> AVTORESTO — ПАРТНЁР ${iiko}</div><h1>Весь ресторан.<br><span>В одной системе.</span></h1><p>Касса, кухня, склад, команда и финансы — iiko помогает объединить процессы. Мы подберём конфигурацию и настроим её под ваше заведение.</p>${action('Подобрать iiko','Подбор iiko')}</div><div class="iiko-art"><span class="iiko-big">iiko<span>®</span></span><div class="iiko-art-caption">В центре — ваш бизнес.</div><div class="art-orbit"></div><div class="art-orbit second"></div></div></section><section class="section">${sectionIntro('ПОРЯДОК В КАЖДОМ ПРОЦЕССЕ','Больше, чем кассовая программа.')}<div class="capabilities-grid">${[['screen','Продажи и заказы','Удобная работа на кассе, заказы в зале и навынос.'],['restaurant','Кухня','Передача заказов и взаимодействие между залом и кухней.'],['box','Складской учёт','Ингредиенты, остатки, технологические карты и списания.'],['chart','Финансы и аналитика','Отчётность и данные для ежедневных решений.'],['telegram','Доставка','Рабочие процессы доставки в общей системе.'],['headset','Команда','Рабочие места, права доступа и обучение сотрудников.']].map(([ic,t,d])=>`<article>${icon(ic)}<h3>${t}</h3><p>${d}</p></article>`).join('')}</div></section><section class="section">${sectionIntro('ТАРИФЫ И КОНФИГУРАЦИИ','Решение по масштабу вашего дела.','Актуальные лицензии, доступные функции и стоимость уточним при подборе.')}<div class="pricing-grid">${[['Корнер','Небольшая точка','Для компактного формата и простых процессов.',['Кофе с собой','Небольшие точки','Самовывоз']],['Кафе','Кафе и фастфуд','Для повседневной работы и уверенного роста.',['Касса и продажи','Учёт в облаке','Работа с заказами']],['Профессиональный','Ресторан и сеть','Для комплексного управления заведением.',['Управленческий учёт','Склад и команда','Интеграции']]].map(([name,a,d,items],n)=>`<article class="pricing-card ${n===1?'pricing-featured':''}"><span class="overline">${a}</span><h3>${iiko} ${name}</h3><p>${d}</p>${checkList(items)}<div class="pricing-request">Индивидуальный расчёт</div>${action('Подобрать тариф','iiko '+name,n===1?'button-dark':'button-outline')}</article>`).join('')}</div><p class="pricing-note">Поможем выбрать типовое решение или классический тариф. Состав лицензий, дополнительные модули и условия уточним перед подключением. <a href="https://iiko.ru/pricing/" target="_blank" rel="noopener noreferrer">Подробнее на сайте iiko ${icon('diagonal')}</a></p></section>${contactBanner()}</div>`;}
function aboutPage() {
  return `<div class="container">${breadcrumbs([['О компании']])}
    <section class="about-intro"><div><div class="eyebrow">AVTORESTO / ПАРТНЁР IIKO</div><h1>Одна команда.<br><span>На весь проект.</span></h1></div><div><p class="lead">Автоматизируем заведения HoReCa: от подбора оборудования до ежедневной поддержки.</p><p>Согласуем состав решения, стоимость и сроки до начала работ. После запуска остаёмся на связи.</p>${action('Обсудить задачу','Знакомство с Avtoresto','button-dark')}</div></section>
    <section class="about-principles"><div><span>01 / ПО ДЕЛУ</span><h3>Под вашу задачу</h3><p>Сначала изучаем процессы. Затем предлагаем оборудование и лицензии.</p></div><div><span>02 / ПОНЯТНО</span><h3>С обучением команды</h3><p>Показываем рабочие сценарии на вашей системе.</p></div><div><span>03 / НА СВЯЗИ</span><h3>После запуска</h3><p>Помогаем сотрудникам и решаем технические вопросы.</p></div></section>
    <section class="section" id="process">${sectionIntro('КАК МЫ РАБОТАЕМ','От задачи — к работающей системе.')}<div class="steps">${[['Обсуждаем','Формат, задачи и бюджет.'],['Согласуем','Комплектацию, стоимость и сроки.'],['Внедряем','Настройка и обучение сотрудников.'],['Поддерживаем','Помощь в ежедневной работе.']].map(([a,b],n)=>`<article><span class="step-number">0${n+1}</span><h3>${a}</h3><p>${b}</p></article>`).join('')}</div></section>
    <section class="contacts-section" id="contacts"><div><div class="eyebrow">КОНТАКТЫ</div><h2>Обсудим вашу задачу.</h2><p>Подбор решения, внедрение или поддержка — напишите нам в Telegram.</p><a class="telegram-contact" href="${TELEGRAM}" target="_blank" rel="noopener noreferrer">${icon('telegram')}<span>Avtoresto<strong>@posadmin_request_bot</strong></span>${icon('diagonal')}</a></div><div class="contact-note"><span class="overline">ПОДГОТОВИМ ПРЕДЛОЖЕНИЕ</span><h3>Начнём с вашего<br>формата и задачи.</h3><p>Можно кратко. Уточним детали в переписке.</p>${action('Подготовить заявку','Консультация','button-dark')}</div></section>
  </div>`;
}

function privacyPage(){return `<div class="container legal-page">${breadcrumbs([['Конфиденциальность']])}<div class="eyebrow">ВАШИ ДАННЫЕ</div><h1>Конфиденциальность</h1><p>Форма помогает подготовить обращение в Avtoresto. Сайт не сохраняет введённые данные и не отправляет их на сервер.</p><h2>Отправка в Telegram</h2><p>Вы копируете сообщение и отправляете его боту <a href="${TELEGRAM}" target="_blank" rel="noopener noreferrer">@posadmin_request_bot</a>. До этого шага заявка не отправлена. При переходе в Telegram действуют правила этого сервиса.</p><h2>Cookies и аналитика</h2><p>Сайт не устанавливает рекламные и аналитические cookies и не сохраняет настройки в браузере.</p><h2>Вопросы</h2><p>По вопросам обработки обращения напишите в <a href="${TELEGRAM}" target="_blank" rel="noopener noreferrer">Telegram Avtoresto</a>.</p></div>`;}

function notFound(){document.title='Страница не найдена — Avtoresto';return `<section class="not-found container"><span class="error-number">4${icon('cup')}4</span><div class="eyebrow">ЭТОЙ СТРАНИЦЫ НЕТ В МЕНЮ</div><h1>Кажется, вы немного<br>свернули с маршрута.</h1><p>Вернёмся туда, где всё работает.</p>${link('На главную','/','button-dark')}</section>`;}
const titles={'/':'Avtoresto — автоматизация HoReCa на iiko','/equipment':'Оборудование и готовые комплекты — Avtoresto','/support':'Поддержка iiko и оборудования — Avtoresto','/iiko':'Автоматизация ресторанов с iiko — Avtoresto','/about':'О компании и контакты — Avtoresto','/privacy':'Конфиденциальность — Avtoresto',...Object.fromEntries(equipment.map(p=>['/equipment/'+p.id,p.name+' — оборудование Avtoresto'])),...Object.fromEntries(support.map(p=>['/support/'+p.id,p.name+' — поддержка Avtoresto']))};
function applyBaseLinks(root=document){if(BASE)$$('a[href^="/"]',root).forEach(a=>{const href=a.getAttribute('href');if(href!==BASE&&!href.startsWith(BASE+'/'))a.setAttribute('href',BASE+href);});}
function render(scroll=true){
  const pathname=BASE&&(location.pathname===BASE||location.pathname.startsWith(BASE+'/'))?location.pathname.slice(BASE.length):location.pathname;
  const path=pathname.replace(/\/$/,'')||'/';
  document.title=titles[path]||'Avtoresto — решения для HoReCa';
  document.body.classList.toggle('is-figma-home',path==='/');
  renderHeader(path);
  const routes={'/':home,'/equipment':equipmentPage,'/support':supportPage,'/iiko':iikoPage,'/about':aboutPage,'/privacy':privacyPage};
  const equipmentRoute=path.match(/^\/equipment\/([^/]+)$/);
  const supportRoute=path.match(/^\/support\/([^/]+)$/);
  const content=routes[path]?routes[path]():equipmentRoute?equipmentDetail(equipmentRoute[1]):supportRoute?supportDetail(supportRoute[1]):notFound();
  $('#main').innerHTML=content;renderFooter();applyBaseLinks();
  if(scroll){window.scrollTo({top:0,behavior:'instant'});$('#main').focus({preventScroll:true});}
  if(location.hash){requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());}
}
function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('visible'),3500);}
let dialogOpener=null;
function openRequest(context,draft=null){
  const dlg=$('#request-dialog');
  if(!dlg.open)dialogOpener=document.activeElement;
  const format=/кофейн/i.test(context)?'Кофейня':/кафе|фастфуд/i.test(context)?'Кафе / фастфуд':/ресторан/i.test(context)?'Ресторан':'';
  dlg.innerHTML=`<button class="dialog-close" data-close-dialog aria-label="Закрыть форму">${icon('close')}</button><div class="dialog-eyebrow">НАЧНЁМ С ВАШЕЙ ЗАДАЧИ</div><h2 id="dialog-title" tabindex="-1">Расскажите о<br>своём заведении.</h2><p class="dialog-description">Подготовим текст обращения в Telegram.</p><form id="request-form"><label>Ваше имя — необязательно<input name="name" maxlength="80" placeholder="Как к вам обращаться" autocomplete="given-name"></label><label>Формат заведения<select name="format" required><option value="" disabled selected>Выберите формат</option><option>Кофейня</option><option>Кафе / фастфуд</option><option>Ресторан</option><option>Бар</option><option>Сеть заведений</option><option>Другой формат</option></select></label><label>Что хотите обсудить?<textarea name="task" rows="3" maxlength="1500" required>${escapeHTML(context)}</textarea></label><p class="form-note">Заявку нужно скопировать и отправить боту вручную.</p><button type="submit" class="button button-primary">Подготовить заявку ${icon('arrow')}</button><a class="form-privacy" href="/privacy" data-link>Как используются данные</a></form>`;
  $('#request-form [name="name"]').value=draft?.name||'';
  $('#request-form [name="format"]').value=draft?.format||format;
  delete dlg.dataset.draft;
  applyBaseLinks(dlg);if(!dlg.open)dlg.showModal();document.body.classList.add('modal-open');$('#dialog-title').focus();
}
function closeDialog(){const dlg=$('#request-dialog');if(dlg.open)dlg.close();}
$('#request-dialog').addEventListener('close',()=>{if($('#request-dialog').open)return;document.body.classList.remove('modal-open');if(dialogOpener?.isConnected)dialogOpener.focus();});
$('#request-dialog').addEventListener('click',e=>{if(e.target===$('#request-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
document.addEventListener('submit',e=>{
  if(e.target.id!=='request-form')return;e.preventDefault();
  const taskField=$('[name="task"]',e.target);if(!taskField.value.trim()){taskField.value='';taskField.reportValidity();return;}
  const data=new FormData(e.target);const name=String(data.get('name')).trim();const message=`Здравствуйте! Хочу обсудить автоматизацию с Avtoresto.\n\n${name?'Имя: '+name+'\n':''}Формат: ${data.get('format')}\nЗадача: ${String(data.get('task')).trim()}`;
  $('#request-dialog').innerHTML=`<button class="dialog-close" data-close-dialog aria-label="Закрыть форму">${icon('close')}</button><span class="summary-icon">${icon('telegram')}</span><h2 id="dialog-title" tabindex="-1">Текст заявки готов.</h2><p class="dialog-description">Заявка ещё не отправлена. Скопируйте текст и отправьте его боту.</p><label class="summary-label">Ваше сообщение<textarea class="message-preview" readonly rows="7">${escapeHTML(message)}</textarea></label><button class="button button-dark full-width" data-copy-message>Скопировать заявку ${icon('copy')}</button><a class="button button-primary full-width" href="${TELEGRAM}" target="_blank" rel="noopener noreferrer">Открыть Telegram ${icon('diagonal')}</a><p class="form-note">При первом обращении нажмите «Старт» в чате с ботом.</p><button class="back-button" data-edit-message>Изменить заявку</button>`;
  $('#request-dialog').dataset.draft=JSON.stringify(Object.fromEntries(data));$('#dialog-title').focus();
});
document.addEventListener('click',async e=>{
  const target=e.target.closest('a,button');if(!target)return;
  if(target.matches('[data-link]')&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){e.preventDefault();closeDialog();history.pushState({},'',target.getAttribute('href'));render();return;}
  if(target.hasAttribute('data-request'))openRequest(target.dataset.request);
  if(target.matches('.menu-toggle')){const open=target.getAttribute('aria-expanded')!=='true';target.setAttribute('aria-expanded',String(open));target.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');$('#main-nav').classList.toggle('open',open);target.innerHTML=icon(open?'close':'menu');}
  if(target.hasAttribute('data-close-dialog'))closeDialog();
  if(target.hasAttribute('data-filter')){$$('[data-filter]').forEach(b=>{b.classList.toggle('active',b===target);b.setAttribute('aria-pressed',String(b===target));});$('.equipment-results').innerHTML=equipment.filter(p=>target.dataset.filter==='all'||p.id===target.dataset.filter).map(equipmentCard).join('');applyBaseLinks($('.equipment-results'));}
  if(target.hasAttribute('data-enlarge')){dialogOpener=target;const dlg=$('#request-dialog');dlg.innerHTML=`<button class="dialog-close" data-close-dialog aria-label="Закрыть изображение">${icon('close')}</button><h2 id="dialog-title" class="image-dialog-title">Комплект оборудования</h2>${image(target.dataset.enlarge,'Увеличенный комплект оборудования','enlarged-image',true)}`;dlg.showModal();document.body.classList.add('modal-open');}
  if(target.hasAttribute('data-copy-message')){const field=$('.message-preview');try{await navigator.clipboard.writeText(field.value);toast('Заявка скопирована. Отправьте её в Telegram.');target.innerHTML='Скопировано '+icon('check');}catch{field.focus();field.select();toast('Выделили текст — скопируйте его вручную.');}}
  if(target.hasAttribute('data-edit-message')){const data=JSON.parse($('#request-dialog').dataset.draft);openRequest(data.task,data);}
});
window.addEventListener('popstate',()=>render());
window.addEventListener('scroll',()=>$('#header').classList.toggle('scrolled',window.scrollY>20),{passive:true});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#main-nav')?.classList.contains('open')){$('.menu-toggle').click();$('.menu-toggle').focus();}});
render(false);

document.addEventListener('click',event=>{
  if(!event.target.closest('[data-next-logos]'))return;
  const track=$('.figma-logo-track');
  if(track?.firstElementChild)track.append(track.firstElementChild);
});
