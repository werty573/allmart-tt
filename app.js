/* ALLMART.TT concept demo. Vanilla JS, no build step. */
(() => {
const WA = '18687628199';
const IMG = (id, w = 520, h = 600) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=60&auto=format`;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const money = n => 'TT$' + Math.round(n).toLocaleString('en-US');
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
const waLink = text => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

/* Categories */
const CATS = [
  { id: 'shop', label: 'Shop Products', icon: 'ph-storefront' },
  { id: 'cars', label: 'Cars Rent-to-Own', icon: 'ph-car-profile' },
  { id: 'property', label: 'Property', icon: 'ph-house-line' },
  { id: 'food', label: 'Food Market', icon: 'ph-basket' },
  { id: 'services', label: 'Services', icon: 'ph-wrench' },
  { id: 'jobs', label: 'Jobs', icon: 'ph-briefcase' },
  { id: 'finance', label: 'Finance', icon: 'ph-bank' }
];

/* Rent-to-own maths (sample: flat 9% a year on the financed amount) */
const CARS = {
  corolla: { name: 'Toyota Corolla 2020', price: 145000 },
  creta: { name: 'Hyundai Creta 2019', price: 118000 }
};
const rto = (price, dep, months) => {
  const fin = price - dep;
  const monthly = Math.ceil((fin * (1 + 0.09 * months / 12)) / months / 10) * 10;
  return { monthly, months, dep, total: dep + monthly * months };
};

/* Listings (samples) */
const P = [
  { id: 'iph', cat: 'shop', t: 'iPhone 11 Pro, 256GB', p: 3900, cond: 'Like new', loc: 'Chaguanas', img: '1592750475338-74b7b21085ab', s: "Kerwin's Phones", r: 4.9, sales: 212, sd: 1 },
  { id: 'nik', cat: 'shop', t: 'Nike Free RN, size 10', p: 680, cond: 'New', loc: 'San Fernando', img: '1542291026-7eec264c27ff', s: 'Sole Supply TT', r: 4.8, sales: 96, sd: 1 },
  { id: 'cor', cat: 'cars', t: 'Toyota Corolla 2020, auto', car: 'corolla', cond: 'Foreign used', loc: 'Freeport', img: '1623869675781-80aa31012a5a', s: 'Central Auto Mart', r: 4.7, sales: 38 },
  { id: 'mng', cat: 'food', t: 'Julie mangoes, 20 count', p: 60, cond: 'Fresh today', loc: 'Scarborough', img: '1776883776296-c9f0cb8a92f2', s: 'Tobago Farm Stall', r: 5.0, sales: 341, sd: 1 },
  { id: 'ps5', cat: 'shop', t: 'PS5 Slim + 2 controllers', p: 4750, cond: 'New', loc: 'Arima', img: '1606144042614-b2417e99c4e3', s: 'Arima Game Spot', r: 4.8, sales: 64, sd: 1 },
  { id: 'apt', cat: 'property', t: '2-bed apartment, furnished', p: 5200, per: '/month', cond: 'Available Dec 1', loc: 'Arima', img: '1583847268964-b28dc8f51f92', s: 'Northside Rentals', r: 4.6, sales: 19, note: 'First month + 1 deposit. Total to move in: TT$10,400.' },
  { id: 'veg', cat: 'food', t: 'Market produce box, 8kg', p: 185, cond: 'Fresh today', loc: 'Chaguanas', img: '1488459716781-31db52582fe9', s: 'Caroni Greens', r: 4.9, sales: 508, sd: 1 },
  { id: 'ac', cat: 'services', t: 'AC servicing, split unit', p: 350, per: ' per unit', cond: 'Next day', loc: 'Freeport', img: '1792799888905-8696bd32a11a', s: 'CoolBreeze Services', r: 4.9, sales: 143 },
  { id: 'cre', cat: 'cars', t: 'Hyundai Creta 2019', car: 'creta', cond: 'Local used', loc: 'San Fernando', img: '1748214547184-d994bfe53322', s: 'South Auto Hub', r: 4.6, sales: 27 },
  { id: 'snd', cat: 'shop', t: 'Sony WH-1000XM4 headphones', p: 1650, cond: 'Used, boxed', loc: 'Port of Spain', img: '1618366712010-f4ae9c647dcb', s: 'Audio Corner POS', r: 4.7, sales: 58, sd: 1 },
  { id: 'job', cat: 'jobs', t: 'Delivery rider, own bike', p: 450, per: '/day', cond: 'Start Monday', loc: 'Arima', img: '1617347454431-f49d7ff5c3b1', s: 'QuickDrop TT', r: 4.5, sales: 0 },
  { id: 'cur', cat: 'food', t: 'Curry chicken, rice and salad', p: 55, cond: 'Hot lunch', loc: 'Port of Spain', img: '1633457027853-106d9bed16ce', s: "Auntie Bev's Kitchen", r: 4.9, sales: 1290, sd: 1 },
  { id: 'bag', cat: 'shop', t: 'Red leather top-handle bag', p: 1150, cond: 'New', loc: 'Tunapuna', img: '1584917865442-de89df76afd3', s: 'Maison Ruby', r: 4.8, sales: 71, sd: 1 },
  { id: 'brd', cat: 'services', t: 'Cornrows and knotless braids', p: 400, from: 1, cond: 'Book this week', loc: 'Arima', img: '1673470907547-1c0c6a996095', s: 'Braided by Kaycee', r: 5.0, sales: 233 },
  { id: 'wh', cat: 'jobs', t: 'Warehouse picker, night shift', p: 24, per: '/hour', cond: 'Immediate start', loc: 'Chaguanas', img: '1586528116022-aeda1613c63d', s: 'Lange Park Logistics', r: 4.4, sales: 0 }
];
P.forEach((x, i) => {
  x.order = i;
  if (x.car) { const c = rto(CARS[x.car].price, 25000, 36); x.p = c.monthly; x.per = '/month'; x.rt = c; }
});
const byId = id => P.find(x => x.id === id);
const priceLabel = x => (x.from ? 'from ' : '') + money(x.p) + (x.per ? `<small>${x.per}</small>` : '');
const actionFor = x => ({ shop: 'Add', food: 'Add', cars: 'Reserve', services: 'Book', property: 'View', jobs: 'Apply' })[x.cat];

/* State */
const S = {
  cat: null, q: '', sort: 'live',
  favs: new Set(store.get('am-favs', [])),
  cart: store.get('am-cart', []),
  buyerTown: 'Port of Spain'
};
const save = () => { store.set('am-favs', [...S.favs]); store.set('am-cart', S.cart); };

/* Toast */
let tt;
const toast = msg => { const t = $('[data-toast]'); t.textContent = msg; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2200); };

/* Counts */
function counts() {
  const f = $('[data-fav-count]'), c = $('[data-cart-count]');
  const n = S.cart.reduce((a, b) => a + b.q, 0);
  f.hidden = !S.favs.size; f.textContent = S.favs.size;
  c.hidden = !n; c.textContent = n;
}
const bump = sel => { const el = $(sel); el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); };

/* Categories */
function renderCats() {
  $('[data-cats]').innerHTML = CATS.map(c => `<button class="cat" role="tab" aria-selected="${S.cat === c.id}" data-cat="${c.id}" type="button"><i class="ph ${c.icon}" aria-hidden="true"></i>${c.label}</button>`).join('');
}
function setCat(id, scroll = true) {
  if (id === 'finance') { S.cat = null; renderCats(); renderGrid(); $('#cars').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); toast('Rent-to-own and finance calculator'); return; }
  S.cat = S.cat === id ? null : id;
  renderCats(); renderGrid();
  if (scroll) $('#feed').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
}

/* Grid */
const TP = window.TT.towns;
const dist = loc => { const a = TP[loc] || TP['Port of Spain'], b = TP[S.buyerTown]; return Math.hypot(a[0] - b[0], a[1] - b[1]); };
function cardHTML(x, i) {
  const fav = S.favs.has(x.id);
  const total = x.rt ? `<div class="total">${x.rt.months} payments of ${money(x.rt.monthly)}. Total <b>${money(x.rt.total)}</b>. No hidden months.</div>`
    : x.note ? `<div class="total">${x.note}</div>` : '';
  return `<article class="card" style="--i:${i}" data-id="${x.id}">
    <div class="card-media" data-view="${x.id}" role="button" tabindex="0" aria-label="Watch the seller video for ${x.t}">
      <img src="${IMG(x.img, 480, 528)}" alt="${x.t}" loading="lazy" width="480" height="528">
      <div class="vtop"><span class="live">LIVE</span><span class="vtime"><i class="ph-fill ph-video-camera"></i>0:15</span></div>
      <span class="play" aria-hidden="true"><i class="ph-fill ph-play"></i></span>
      <button class="fav ${fav ? 'on' : ''}" data-fav="${x.id}" type="button" aria-label="${fav ? 'Remove from saved' : 'Save'}" aria-pressed="${fav}"><i class="${fav ? 'ph-fill' : 'ph'} ph-heart"></i></button>
    </div>
    <div class="card-body">
      <div class="price">${priceLabel(x)}</div>
      <div class="card-title" data-view="${x.id}">${x.t}</div>
      ${total}
      <div class="loc"><i class="ph ph-map-pin"></i>${x.cond} • ${x.loc}</div>
      <div class="badges">
        <span class="badge v"><i class="ph-fill ph-seal-check"></i>Verified</span>
        <span class="badge e"><i class="ph-fill ph-shield-check"></i>Escrow</span>
        ${x.sd ? '<span class="badge d"><i class="ph-fill ph-lightning"></i>Same day</span>' : ''}
      </div>
      <div class="card-foot">
        <button class="add" data-act="${x.id}" type="button">${actionFor(x)}</button>
        <a class="wa-mini" href="${waLink(`Hi ALLMART.TT, is the "${x.t}" (${x.loc}) still available?`)}" target="_blank" rel="noopener" aria-label="Ask on WhatsApp"><i class="ph ph-whatsapp-logo"></i></a>
      </div>
    </div>
  </article>`;
}
function renderGrid() {
  const q = S.q.trim().toLowerCase();
  let list = P.filter(x => (!S.cat || x.cat === S.cat) && (!q || (x.t + ' ' + x.loc + ' ' + x.cat + ' ' + x.s + ' ' + (CATS.find(c => c.id === x.cat).label)).toLowerCase().includes(q)));
  if (S.sort === 'low') list.sort((a, b) => a.p - b.p);
  else if (S.sort === 'near') list.sort((a, b) => dist(a.loc) - dist(b.loc));
  else list.sort((a, b) => a.order - b.order);
  const g = $('[data-grid]');
  g.innerHTML = list.length ? list.map(cardHTML).join('') :
    `<div class="empty"><i class="ph ph-magnifying-glass"></i><strong>Nothing live for "${S.q.replace(/[<>&"]/g, '')}" yet</strong>Try another word, or ask the community on WhatsApp.<br><br><button class="btn btn-line" data-clear type="button">Show everything</button></div>`;
  const cat = S.cat && CATS.find(c => c.id === S.cat).label;
  $('[data-feed-note]').textContent = `${list.length} live listing${list.length === 1 ? '' : 's'}${cat ? ' in ' + cat : ''}${q ? ` matching "${S.q}"` : ''}${S.sort === 'near' ? ', nearest to ' + S.buyerTown : ''}`;
}

/* Hero video stack */
function initStack() {
  const ids = ['iph', 'cor', 'mng', 'nik'];
  const el = $('[data-stack]');
  el.innerHTML = ids.map(id => { const x = byId(id); return `<div class="vcard" data-view="${id}" role="button" tabindex="0" aria-label="${x.t}">
      <img src="${IMG(x.img, 520, 720)}" alt="" ${id === 'iph' ? '' : 'loading="lazy"'}>
      <div class="shade"></div><div class="vbar"><i></i></div>
      <div class="vtop"><span class="live">LIVE</span><span class="vtime"><i class="ph-fill ph-video-camera"></i>0:15</span></div>
      <div class="vinfo"><strong>${x.t}</strong><div class="vprice">${money(x.p)}${x.per ? ' ' + x.per : ''}</div><div class="vseller"><i class="ph-fill ph-seal-check"></i>${x.s} • ${x.loc}</div></div>
    </div>`; }).join('') +
    `<div class="float-badge fb-1"><i class="ph-fill ph-shield-check"></i><div>TT$3,900 in escrow<small>Released when you confirm</small></div></div>
     <div class="float-badge fb-2"><i class="ph-fill ph-moped"></i><div>Rider 6 min away<small>Same day, Chaguanas</small></div></div>`;
  const cards = $$('.vcard', el);
  let front = 0;
  const DUR = 6;
  const place = () => {
    const sm = innerWidth < 768, dx = sm ? 92 : 128;
    cards.forEach((c, i) => {
      const k = (i - front + cards.length) % cards.length;
      c.classList.toggle('front', k === 0);
      const T = [
        `translate3d(0,0,0) rotate(0deg)`,
        `translate3d(${dx}px,18px,-140px) rotate(7deg)`,
        `translate3d(${-dx}px,18px,-140px) rotate(-7deg)`,
        `translate3d(0,30px,-260px) rotate(0deg)`
      ][k];
      c.style.transform = T;
      c.style.zIndex = 10 - k;
      c.style.opacity = k === 3 ? 0 : 1;
      c.style.filter = k === 0 ? 'none' : 'brightness(.62) saturate(.8)';
      if (k === 0) { $$('img, .vbar i', c).forEach(n => { n.style.animation = 'none'; void n.offsetWidth; n.style.animation = ''; n.style.animationDuration = DUR + 's'; }); }
    });
  };
  place();
  if (RM) return;
  let timer = setInterval(() => { front = (front + 1) % cards.length; place(); }, DUR * 1000);
  new IntersectionObserver(([e]) => {
    clearInterval(timer);
    if (e.isIntersecting) timer = setInterval(() => { front = (front + 1) % cards.length; place(); }, DUR * 1000);
  }).observe(el);
  addEventListener('resize', place, { passive: true });
}

/* Escrow pipeline */
function initPipe() {
  const pipe = $('[data-pipe]'), items = $$('li', pipe), tok = $('.token', pipe);
  const run = () => {
    pipe.classList.add('run');
    const vertical = innerWidth < 1101;
    items.forEach((li, i) => setTimeout(() => {
      li.classList.add('lit');
      pipe.style.setProperty('--p', i / (items.length - 1));
      const pr = pipe.getBoundingClientRect(), nr = $('.node', li).getBoundingClientRect();
      tok.style.transform = vertical ? `translateY(${nr.top - pr.top}px)` : `translateX(${nr.left - pr.left}px)`;
    }, RM ? 0 : 200 + i * 650));
  };
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { run(); o.disconnect(); } }, { threshold: .45 }).observe(pipe);
}

/* Rent to own calculator */
function initRto() {
  let car = 'corolla', term = 36;
  const veh = $('[data-veh]'), dep = $('[data-dep]');
  veh.innerHTML = Object.entries(CARS).map(([k, v]) => `<button type="button" role="radio" aria-checked="${k === car}" data-v="${k}">${v.name.replace(/ 20\d\d/, '')}</button>`).join('');
  const upd = () => {
    const d = +dep.value, c = rto(CARS[car].price, d, term);
    dep.style.setProperty('--fill', ((d - dep.min) / (dep.max - dep.min) * 100) + '%');
    $('[data-dep-out]').textContent = money(d);
    $('[data-rto-month]').textContent = money(c.monthly);
    $('[data-rto-n]').textContent = c.months;
    $('[data-rto-total]').textContent = money(c.total);
    $('[data-rto-wa]').href = waLink(`Hi ALLMART.TT, I'm interested in the ${CARS[car].name} rent-to-own: ${money(d)} deposit, ${term} months at ${money(c.monthly)}. Total ${money(c.total)}.`);
  };
  const seg = (el, cb) => el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('button', el).forEach(x => x.setAttribute('aria-checked', x === b)); cb(b.dataset.v); upd(); });
  seg(veh, v => car = v); seg($('[data-term]'), v => term = +v);
  dep.addEventListener('input', upd);
  upd();
}

/* Map */
const MAIN = { Freeport: 31, Arima: 24, Scarborough: 9 };
const OTHER = { 'Port of Spain': 0, 'San Fernando': 0, Chaguanas: 0, 'Sangre Grande': 0, 'Point Fortin': 0 };
function initMap() {
  const svg = $('[data-map]');
  let h = `<path class="land" d="${window.TT.d}"/>`;
  Object.keys(OTHER).forEach(n => { const [x, y] = TP[n]; h += `<circle class="pin-small" cx="${x}" cy="${y}" r="5"/><text class="town-name" x="${x + 10}" y="${y + 24}">${n}</text>`; });
  Object.entries(MAIN).forEach(([n, c]) => {
    const [x, y] = TP[n];
    const label = `${n}  ${c}`, w = 22 + n.length * 14.5 + 40;
    const left = n !== 'Arima';
    const lx = left ? x - w - 18 : x + 18, ly = y - 26;
    h += `<g class="pin-g" data-town="${n}" tabindex="0" role="button" aria-label="${n}, ${c} sellers live">
      <circle class="pin-ring" cx="${x}" cy="${y}" r="12"/><circle class="pin-ring" cx="${x}" cy="${y}" r="12" style="animation-delay:1.2s"/>
      <circle class="pin-dot" cx="${x}" cy="${y}" r="11"/>
      <g class="pin-label"><rect x="${lx}" y="${ly}" width="${w}" height="52" rx="26"/><text x="${lx + 20}" y="${ly + 35}">${n} <tspan class="n">${c}</tspan></text></g>
    </g>`;
  });
  svg.innerHTML = h;
  $('[data-towns]').innerHTML = Object.entries(MAIN).map(([n, c]) => `<li><button class="town" data-town="${n}" type="button"><i class="ph-fill ph-map-pin" style="color:var(--brand-text);font-size:20px"></i><span class="tn">${n}<span class="tl" style="display:block;font-weight:400">${n === 'Scarborough' ? 'Tobago' : 'Trinidad'}</span></span><span class="tc">${c}</span><span class="tl">sellers live</span></button></li>`).join('');
  const pick = n => {
    $$('[data-town]').forEach(el => el.classList.toggle('on', el.dataset.town === n));
    const here = P.filter(x => x.loc === n).map(x => x.t);
    showTick(`<i class="ph-fill ph-broadcast"></i><span>${here.length ? `Live in ${n}: ${here.slice(0, 2).join(', ')}` : `${MAIN[n]} sellers live in ${n} right now`}</span>`);
  };
  document.addEventListener('click', e => { const t = e.target.closest('[data-town]'); if (t) pick(t.dataset.town); });
  svg.addEventListener('keydown', e => { const t = e.target.closest('[data-town]'); if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(t.dataset.town); } });
  const TICKS = [
    ['Sole Supply TT went live in San Fernando', '1 min ago'],
    ['Escrow released to Caroni Greens', 'just now'],
    ['Tobago Farm Stall went live in Scarborough', '3 min ago'],
    ['Central Auto Mart posted a new video in Freeport', '4 min ago'],
    ['Arima Game Spot sold a PS5, same day', '6 min ago']
  ];
  let k = 0;
  const next = () => { const [a, b] = TICKS[k++ % TICKS.length]; showTick(`<i class="ph-fill ph-broadcast"></i><span>${a} <span style="color:var(--muted)">• ${b}</span></span>`); };
  next();
  if (!RM) setInterval(() => { if (!document.hidden) next(); }, 4200);
}
function showTick(html) { $('[data-ticker]').innerHTML = `<span class="tk" style="display:flex;gap:10px;align-items:center">${html}</span>`; }

/* Sheet */
const sheet = $('[data-sheet]'), scrim = $('[data-scrim]'), body = $('[data-sheet-body]');
let lastFocus, rafs = [];
function openSheet(html, wide = false, label = 'Details') {
  lastFocus = document.activeElement;
  body.innerHTML = html; body.scrollTop = 0;
  sheet.classList.toggle('wide', wide);
  sheet.setAttribute('aria-label', label);
  sheet.hidden = scrim.hidden = false;
  requestAnimationFrame(() => { sheet.classList.add('on'); scrim.classList.add('on'); });
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('.sheet-x').focus({ preventScroll: true }), 60);
}
function closeSheet() {
  rafs.forEach(cancelAnimationFrame); rafs = [];
  sheet.classList.remove('on'); scrim.classList.remove('on');
  document.body.style.overflow = '';
  setTimeout(() => { sheet.hidden = scrim.hidden = true; body.innerHTML = ''; }, 420);
  lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
}
scrim.addEventListener('click', closeSheet);
$('[data-close]').addEventListener('click', closeSheet);
addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });

/* Product view */
function viewProduct(id) {
  const x = byId(id);
  const cost = x.rt
    ? `<div class="costbox"><div><span>Deposit</span><b>${money(x.rt.dep)}</b></div><div><span>${x.rt.months} monthly payments</span><b>${money(x.rt.monthly)}</b></div><div class="ct"><span>Total you pay</span><b>${money(x.rt.total)}</b></div><div style="color:var(--muted);font-size:.8rem">No balloon payment. No hidden months.</div></div>`
    : `<div class="costbox"><div><span>Item</span><b>${money(x.p)}${x.per || ''}</b></div>${x.sd ? `<div><span>Same-day delivery</span><b>${money(40)}</b></div>` : ''}${x.note ? `<div style="font-size:.84rem">${x.note}</div>` : ''}<div class="ct"><span>${x.sd ? 'Total with delivery' : 'Total'}</span><b>${money(x.p + (x.sd ? 40 : 0))}</b></div></div>`;
  const primary = { shop: 'Buy with escrow', food: 'Buy with escrow', cars: 'Reserve with TT$2,500', services: 'Book and pay in escrow', property: 'Book a viewing', jobs: 'Apply on WhatsApp' }[x.cat];
  openSheet(`
    <h2 class="sh-h">${x.t}</h2>
    <p class="sh-sub">${x.cond} • ${x.loc}</p>
    <div class="pd" style="margin-top:18px">
      <div class="pd-video playing" data-pv>
        <img src="${IMG(x.img, 720, 900)}" alt="${x.t}">
        <div class="shade"></div><div class="vbar"><i></i></div>
        <div class="vtop"><span class="live">LIVE</span><span class="vtime"><i class="ph-fill ph-video-camera"></i>0:15</span></div>
        <div class="pd-cap"><i class="ph-fill ph-seal-check"></i>Seller video, verified by ALLMART</div>
        <button class="pd-replay" type="button" aria-label="Replay video" data-replay><span><i class="ph-fill ph-arrow-counter-clockwise"></i></span></button>
      </div>
      <div class="pd-info">
        <div class="pd-price">${priceLabel(x)}</div>
        ${cost}
        <div class="badges"><span class="badge v"><i class="ph-fill ph-seal-check"></i>Verified</span><span class="badge e"><i class="ph-fill ph-shield-check"></i>Escrow Protected</span>${x.sd ? '<span class="badge d"><i class="ph-fill ph-lightning"></i>Same Day Delivery Trinidad</span>' : ''}</div>
        <div class="seller"><span class="ava">${x.s.replace(/[^A-Z]/g, '').slice(0, 2) || x.s[0]}</span><div><b>${x.s} <i class="ph-fill ph-seal-check"></i></b><small>${x.r.toFixed(1)} rating${x.sales ? ` • ${x.sales} sales` : ''} • ID and business checked</small></div></div>
        <div class="pd-actions">
          <button class="btn btn-brand btn-block" data-primary="${x.id}" type="button">${primary}</button>
          <a class="btn btn-line btn-block" href="${waLink(`Hi ALLMART.TT, I'd like to order: ${x.t} (${x.loc}), ${money(x.p)}${x.per || ''}.`)}" target="_blank" rel="noopener"><i class="ph ph-whatsapp-logo"></i>Order on WhatsApp</a>
          <button class="btn btn-line btn-block" data-open="messages" data-seller="${x.id}" type="button"><i class="ph ph-chat-circle-dots"></i>Message seller</button>
        </div>
      </div>
    </div>`, true, x.t);
  const pv = $('[data-pv]');
  $('.vbar i', pv).addEventListener('animationend', () => pv.classList.add('ended'));
  $('[data-replay]').addEventListener('click', () => { pv.classList.remove('playing', 'ended'); void pv.offsetWidth; pv.classList.add('playing'); });
}

/* Cart */
const cartItems = () => S.cart.map(c => ({ ...c, x: byId(c.id) })).filter(c => c.x);
const lineCost = c => c.x.cat === 'cars' ? 2500 : c.x.p;
function addToCart(id, silent) {
  const x = byId(id);
  const f = S.cart.find(c => c.id === id);
  if (f) { if (x.cat !== 'cars') f.q++; } else S.cart.push({ id, q: 1 });
  save(); counts(); bump('[data-cart-count]');
  if (!silent) toast(x.cat === 'cars' ? 'Reservation added to cart' : 'Added to cart');
}
function primaryAction(id, btn, silent) {
  const x = byId(id);
  if (x.cat === 'jobs') { open(waLink(`Hi ALLMART.TT, I'd like to apply for "${x.t}" (${x.loc}).`), '_blank', 'noopener'); return; }
  if (x.cat === 'property') { open(waLink(`Hi ALLMART.TT, I'd like to book a viewing: ${x.t}, ${x.loc}, ${money(x.p)}${x.per}.`), '_blank', 'noopener'); return; }
  addToCart(id, silent);
  if (btn && btn.classList.contains('add')) { btn.classList.add('done'); btn.innerHTML = '<i class="ph ph-check"></i>Added'; setTimeout(() => { btn.classList.remove('done'); btn.textContent = actionFor(x); }, 1400); }
}
function totals() {
  const items = cartItems();
  const sub = items.reduce((a, c) => a + lineCost(c) * c.q, 0);
  const del = items.some(c => c.x.sd) ? 40 : 0;
  return { items, sub, del, total: sub + del };
}
function viewCart() {
  const { items, sub, del, total } = totals();
  if (!items.length) {
    openSheet(`<h2 class="sh-h">Your cart</h2><div class="empty" style="margin-top:22px"><i class="ph ph-shopping-bag"></i><strong>Nothing here yet</strong>Watch a few seller videos and add what you like.<br><br><button class="btn btn-brand" data-close-go="#feed" type="button">Browse live listings</button></div>`, false, 'Cart');
    return;
  }
  openSheet(`<h2 class="sh-h">Your cart</h2><p class="sh-sub">Paid into escrow. Sellers are paid only after you confirm.</p>
    <div class="lines" style="margin-top:18px">${items.map(c => `<div class="line"><img src="${IMG(c.x.img, 120, 120)}" alt=""><div class="ln"><b>${c.x.t}</b><small>${c.x.cat === 'cars' ? 'Refundable reservation' : c.x.loc} • ${money(lineCost(c))}</small></div><div class="qty"><button data-q="-1" data-id="${c.id}" aria-label="Fewer" type="button"><i class="ph ph-minus"></i></button><span>${c.q}</span><button data-q="1" data-id="${c.id}" aria-label="More" type="button"${c.x.cat === 'cars' ? ' disabled' : ''}><i class="ph ph-plus"></i></button></div></div>`).join('')}</div>
    <div class="sum"><div><span>Subtotal</span><b>${money(sub)}</b></div>${del ? `<div><span>Same-day delivery</span><b>${money(del)}</b></div>` : ''}<div class="grand"><span>Total</span><b>${money(total)}</b></div></div>
    <button class="btn btn-brand btn-block" data-checkout type="button">Checkout with escrow <span class="btn-ico"><i class="ph ph-lock-key"></i></span></button>`, false, 'Cart');
}

/* Checkout flow: Pay > Escrow > Track > Confirm > Paid */
const STEPS = ['Pay', 'Escrow', 'Track', 'Confirm', 'Paid'];
const CO = { step: 0, method: 'wipay', id: '' };
const stepper = n => `<div class="stepper">${STEPS.map((s, i) => `<div class="${i <= n ? 'done' : ''}">${s}</div>`).join('')}</div>`;
function checkout(step = 0) {
  CO.step = step;
  const { items, total } = totals();
  if (!items.length) return viewCart();
  if (!CO.id) CO.id = 'AM-' + (48000 + Math.floor(Math.random() * 999));
  const methods = [
    ['wipay', 'ph-credit-card', 'WiPay', 'Visa, Mastercard or Linx'],
    ['cash', 'ph-money', 'Cash on delivery', 'Rider collects, ALLMART holds it'],
    ['rhand', 'ph-wallet', 'RHAND', 'Pay from your RHAND account']
  ];
  let h = `<h2 class="sh-h">Checkout</h2><p class="sh-sub">Order ${CO.id}</p>${stepper(step)}`;
  if (step === 0) {
    h += `<div class="inp"><label for="btown">Deliver to</label><select id="btown" data-btown>${Object.keys(TP).filter(n => n !== 'Scarborough').map(n => `<option ${n === S.buyerTown ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
      <div class="pay" role="radiogroup" aria-label="Payment method">${methods.map(([k, ic, b, s]) => `<button class="payopt" role="radio" aria-checked="${CO.method === k}" data-method="${k}" type="button"><i class="ph ${ic}"></i><span><b>${b}</b><small>${s}</small></span><span class="rd"></span></button>`).join('')}</div>
      <div class="sum"><div class="grand"><span>Total into escrow</span><b>${money(total)}</b></div></div>
      <button class="btn btn-brand btn-block" data-co="1" type="button">Pay ${money(total)} into escrow <span class="btn-ico"><i class="ph ph-lock-key"></i></span></button>`;
  } else if (step === 1) {
    h += `<div class="vault"><div class="vault-ico"><span class="coin"><i class="ph-fill ph-coins"></i></span><i class="ph-fill ph-lock-key"></i></div>
      <h3>${money(total)} is safe in escrow</h3><p>The seller can see you paid, but can't touch it until you confirm the item matches the video.</p></div>
      <button class="btn btn-brand btn-block" data-co="2" type="button">Track delivery <span class="btn-ico"><i class="ph ph-map-trifold"></i></span></button>`;
  } else if (step === 2) {
    const from = items[0].x.loc === 'Scarborough' ? 'Port of Spain' : items[0].x.loc;
    const a = TP[from], b = TP[S.buyerTown];
    const same = from === S.buyerTown;
    const b2 = same ? [b[0] + 60, b[1] + 40] : b;
    const mx = (a[0] + b2[0]) / 2 + (b2[1] - a[1]) * .25, my = (a[1] + b2[1]) / 2 - (b2[0] - a[0]) * .25;
    h += `<div class="trackmap"><svg viewBox="130 400 620 520" role="img" aria-label="Rider route from ${from} to ${S.buyerTown}">
        <path class="land" d="${window.TT.d}"/>
        <path id="rt" class="route" d="M${a[0]},${a[1]} Q${mx},${my} ${b2[0]},${b2[1]}"/>
        <circle cx="${a[0]}" cy="${a[1]}" r="9" class="pin-dot"/><circle cx="${b2[0]}" cy="${b2[1]}" r="12" fill="none" stroke="var(--brand-text)" stroke-width="4"/>
        <text class="town-name" x="${a[0] + 14}" y="${a[1] - 12}">${from}</text><text class="town-name" x="${b2[0] + 16}" y="${b2[1] + 8}">You</text>
        <g data-rider><circle r="17" class="rider"/><circle r="7" fill="#fff"/></g>
      </svg></div>
      <div class="tstatus"><div class="on" data-ts="0"><i class="ph-fill ph-check-circle"></i>Picked up from ${items[0].x.s}</div><div data-ts="1"><i class="ph-fill ph-check-circle"></i>On the way to ${S.buyerTown}<span data-eta style="margin-left:auto;font-family:'Geist Mono',monospace"></span></div><div data-ts="2"><i class="ph-fill ph-check-circle"></i>Arrived</div></div>
      <button class="btn btn-brand btn-block" data-co="3" type="button" style="margin-top:18px" disabled data-recv>I received it</button>`;
  } else if (step === 3) {
    h += `<div class="lines">${items.map(c => `<div class="line"><img src="${IMG(c.x.img, 120, 120)}" alt=""><div class="ln"><b>${c.x.t}</b><small>Compare with the seller video</small></div></div>`).join('')}</div>
      <p style="margin:20px 0 6px;font-weight:600;font-size:1.1rem">Does everything match the video?</p><p class="sh-sub" style="margin-bottom:18px">Confirming releases ${money(total)} to the seller.</p>
      <button class="btn btn-brand btn-block" data-co="4" type="button">Yes, release payment <span class="btn-ico"><i class="ph ph-check"></i></span></button>
      <button class="btn btn-line btn-block" style="margin-top:10px" data-problem type="button">Report a problem</button>`;
  } else {
    const lines = items.map(c => `- ${c.q} x ${c.x.t} (${money(lineCost(c))})`).join('\n');
    const msg = `Hi ALLMART.TT, order ${CO.id}:\n${lines}\nDeliver to: ${S.buyerTown}\nPayment: ${({ wipay: 'WiPay', cash: 'Cash on delivery', rhand: 'RHAND' })[CO.method]} (escrow)\nTotal: ${money(total)}`;
    h += `<div class="center"><div class="big-check"><i class="ph ph-check-fat"></i></div><h3 style="font-size:1.4rem;margin-top:16px;letter-spacing:-.02em">Seller paid</h3><p class="sh-sub">Thanks for shopping safe.</p></div>
      <div class="receipt"><div><span>Order</span><b>${CO.id}</b></div>${items.map(c => `<div><span>${c.q} x ${c.x.t}</span><b>${money(lineCost(c) * c.q)}</b></div>`).join('')}<div><span>Paid with</span><b>${({ wipay: 'WiPay', cash: 'Cash', rhand: 'RHAND' })[CO.method]}</b></div><div style="font-weight:700"><span>Released to seller</span><b>${money(total)}</b></div></div>
      <a class="btn btn-brand btn-block" href="${waLink(msg)}" target="_blank" rel="noopener">Send order to WhatsApp <span class="btn-ico"><i class="ph ph-whatsapp-logo"></i></span></a>
      <button class="btn btn-line btn-block" style="margin-top:10px" data-done type="button">Done</button>`;
  }
  openSheet(h, false, 'Checkout');
  if (step === 2) animateRider();
}
function animateRider() {
  const path = $('#rt'), g = $('[data-rider]'), L = path.getTotalLength(), D = RM ? 1 : 5200;
  let t0;
  const statusAt = p => { $$('[data-ts]').forEach(d => d.classList.toggle('on', +d.dataset.ts <= (p >= 1 ? 2 : p > .08 ? 1 : 0))); const e = $('[data-eta]'); if (e) e.textContent = p < 1 ? Math.max(1, Math.ceil((1 - p) * 14)) + ' min' : ''; };
  const tick = ts => {
    if (!t0) t0 = ts;
    const p = Math.min(1, (ts - t0) / D), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const pt = path.getPointAtLength(e * L);
    g.setAttribute('transform', `translate(${pt.x},${pt.y})`);
    statusAt(p);
    if (p < 1) rafs.push(requestAnimationFrame(tick));
    else { const b = $('[data-recv]'); if (b) b.disabled = false; }
  };
  rafs.push(requestAnimationFrame(tick));
}

/* Favs, messages, account */
function viewFavs() {
  const items = P.filter(x => S.favs.has(x.id));
  openSheet(`<h2 class="sh-h">Saved</h2>${items.length ? `<div class="lines" style="margin-top:18px">${items.map(x => `<button class="line thread" data-view="${x.id}" type="button"><img src="${IMG(x.img, 120, 120)}" alt=""><div class="ln"><b>${x.t}</b><small>${money(x.p)}${x.per || ''} • ${x.loc}</small></div><i class="ph ph-caret-right"></i></button>`).join('')}</div>` :
    `<div class="empty" style="margin-top:22px"><i class="ph ph-heart"></i><strong>No saved items</strong>Tap the heart on any listing to keep it here.</div>`}`, false, 'Saved');
}
const THREADS = [
  { id: 'iph', last: 'Still available. Can do same day to you.', n: 2, msgs: [['vid'], ['Still available. Battery health 89%, no scratches. Can do same day to you.'], ['me', 'Nice. Does it come with a charger?'], ['Yes, original cable. Pay in the app and it goes into escrow, so you are covered.']] },
  { id: 'ac', last: 'Tomorrow 9am works. Two units?', n: 0, msgs: [['me', 'Hi, can you service 2 split units in Freeport?'], ['Tomorrow 9am works. Two units?']] }
];
function viewMessages(sellerId) {
  const th = sellerId ? (THREADS.find(t => t.id === sellerId) || { id: sellerId, msgs: [['Hi! Thanks for your interest. Ask me anything about it.']] }) : null;
  if (!th) {
    openSheet(`<h2 class="sh-h">Messages</h2><div style="margin-top:14px">${THREADS.map(t => { const x = byId(t.id); return `<button class="thread" data-thread="${t.id}" type="button"><span class="ava">${x.s.replace(/[^A-Z]/g, '').slice(0, 2)}</span><div class="ln"><b>${x.s}</b><small>${t.last}</small></div>${t.n ? `<span class="unread">${t.n}</span>` : ''}</button>`; }).join('')}</div>`, false, 'Messages');
    return;
  }
  const x = byId(th.id);
  openSheet(`<h2 class="sh-h">${x.s}</h2><p class="sh-sub">About: ${x.t}</p>
    <div class="chat" data-chat>${th.msgs.map(m => m[0] === 'vid' ? `<div class="msg vid"><img src="${IMG(x.img, 300, 375)}" alt="Seller video still"><small style="padding:4px 6px">15-sec video</small></div>` : m[0] === 'me' ? `<div class="msg me">${m[1]}</div>` : `<div class="msg">${m[0]}</div>`).join('')}</div>
    <form class="search" data-chatform style="margin-bottom:12px"><i class="ph ph-chat-circle" aria-hidden="true"></i><label class="sr" for="chatin">Message</label><input id="chatin" placeholder="Write a message" autocomplete="off"></form>
    <a class="btn btn-line btn-block" href="${waLink(`Hi ALLMART.TT, I have a question about "${x.t}" from ${x.s}.`)}" target="_blank" rel="noopener"><i class="ph ph-whatsapp-logo"></i>Continue on WhatsApp</a>`, false, 'Messages');
  $('[data-chatform]').addEventListener('submit', e => {
    e.preventDefault(); const i = $('#chatin'); const v = i.value.trim(); if (!v) return;
    const c = $('[data-chat]'); c.insertAdjacentHTML('beforeend', `<div class="msg me"></div>`); c.lastElementChild.textContent = v; i.value = '';
    setTimeout(() => { c.insertAdjacentHTML('beforeend', `<div class="msg">Got it, replying shortly.<small>Seller typically replies in 5 min</small></div>`); c.lastElementChild.scrollIntoView({ block: 'end', behavior: 'smooth' }); }, 900);
  });
}
function viewAccount() {
  const { items, total } = totals();
  openSheet(`<h2 class="sh-h">Account</h2><p class="sh-sub">Verified buyer • Port of Spain</p>
    <div class="acct-card"><span>Held in escrow for you</span><strong>${money(total || 3900)}</strong><small>Released only when you confirm delivery</small></div>
    <h3 style="font-size:1rem;margin-bottom:6px">Orders</h3>
    ${(items.length ? items.map(c => [c.x, 'In escrow', '']) : [[byId('iph'), 'Out for delivery', ''], [byId('veg'), 'Seller paid', 'g']]).map(([x, st, cl]) => `<div class="ord"><img src="${IMG(x.img, 120, 120)}" alt=""><div class="ln"><b>${x.t}</b><span class="pill ${cl}">${cl ? '<i class="ph ph-check"></i>' : '<i class="ph ph-lock-key"></i>'}${st}</span></div></div>`).join('')}
    <div class="seller" style="margin-top:18px"><span class="ava"><i class="ph ph-identification-card"></i></span><div><b>KYC complete <i class="ph-fill ph-seal-check"></i></b><small>ID, selfie and business checked. You can sell.</small></div></div>
    <button class="btn btn-brand btn-block" style="margin-top:16px" data-close-go="#sell" type="button">Start selling</button>`, false, 'Account');
}

/* Seller wizard */
const W = { step: 0, id: false, selfie: false, biz: '', type: 'Individual', area: 'Arima', title: '', price: '', vid: false };
function wizard() {
  const el = $('[data-wizard]');
  const bars = `<div class="wz-steps" aria-hidden="true">${[0, 1, 2, 3, 4].map(i => `<span class="${i < W.step ? 'done' : ''}"></span>`).join('')}</div>`;
  let h = '';
  if (W.step === 0 || W.step === 1) {
    const isId = W.step === 0, ok = isId ? W.id : W.selfie;
    h = `${bars}<span class="wz-k">Verify, step ${W.step + 1} of 3</span><h3 class="wz-h">${isId ? 'Your ID card' : 'A quick selfie'}</h3><p class="wz-p">${isId ? 'National ID, passport or driver\'s permit. Only our team sees it.' : 'We match it to your ID so buyers know you are you.'}</p>
      <div class="wz-box"><button class="up ${ok ? 'ok' : ''}" data-up="${isId ? 'id' : 'selfie'}" type="button"><i class="ph ${ok ? 'ph-check' : isId ? 'ph-identification-card' : 'ph-camera'}"></i><span><b>${ok ? (isId ? 'ID checked' : 'Selfie matched') : isId ? 'Add photo of ID' : 'Take selfie'}</b><small>${ok ? 'Looks good' : 'Tap to add (demo)'}</small></span></button></div>
      <div class="wz-nav">${W.step ? '<button class="btn btn-line" data-wz="-1" type="button">Back</button>' : ''}<button class="btn btn-brand btn-block" data-wz="1" type="button" ${ok ? '' : 'disabled'}>Continue</button></div>`;
  } else if (W.step === 2) {
    h = `${bars}<span class="wz-k">Verify, step 3 of 3</span><h3 class="wz-h">Your business</h3><p class="wz-p">Selling as yourself is fine too.</p>
      <div class="wz-box"><div class="inp"><label for="wz-biz">Shop name</label><input id="wz-biz" value="${W.biz}" placeholder="e.g. Arima Game Spot" autocomplete="organization"><span class="err" data-err></span></div>
      <div class="row2"><div class="inp"><label for="wz-type">Type</label><select id="wz-type">${['Individual', 'Registered business'].map(o => `<option ${o === W.type ? 'selected' : ''}>${o}</option>`).join('')}</select></div>
      <div class="inp"><label for="wz-area">Area</label><select id="wz-area">${Object.keys(TP).map(o => `<option ${o === W.area ? 'selected' : ''}>${o}</option>`).join('')}</select></div></div></div>
      <div class="wz-nav"><button class="btn btn-line" data-wz="-1" type="button">Back</button><button class="btn btn-brand btn-block" data-wz="1" type="button">Continue</button></div>`;
  } else if (W.step === 3) {
    h = `${bars}<span class="wz-k">Your listing</span><h3 class="wz-h">Film 15 seconds, set a price</h3>
      <div class="wz-box"><button class="vid-drop ${W.vid ? '' : ''}" data-rec type="button" aria-label="Record a 15 second video">${W.vid ? `<img src="${IMG('1618366712010-f4ae9c647dcb', 600, 375)}" alt=""><div class="vbar"><i style="width:100%"></i></div>` : '<div class="vbar"><i></i></div>'}<span class="rec" style="${W.vid ? 'color:#fff;text-shadow:0 1px 8px rgba(0,0,0,.5)' : ''}"><i class="ph${W.vid ? '-fill ph-check-circle' : ' ph-video-camera'}"></i>${W.vid ? 'Video ready, 0:15' : 'Record 15 seconds'}</span></button>
      <div class="row2"><div class="inp"><label for="wz-t">What are you selling?</label><input id="wz-t" value="${W.title}" placeholder="Sony headphones"></div><div class="inp"><label for="wz-p">Price (TTD)</label><input id="wz-p" inputmode="numeric" value="${W.price}" placeholder="1,650"></div></div><span class="err" data-err style="color:var(--live);font-size:.82rem"></span></div>
      <div class="wz-nav"><button class="btn btn-line" data-wz="-1" type="button">Back</button><button class="btn btn-brand btn-block" data-wz="1" type="button">Continue</button></div>`;
  } else if (W.step === 4) {
    h = `${bars}<span class="wz-k">Ready</span><h3 class="wz-h">${W.title || 'Your item'} • ${money(+String(W.price).replace(/\D/g, '') || 0)}</h3><p class="wz-p">Verified, filmed and priced. Press to go live in ${W.area}.</p>
      <button class="golive" data-golive type="button">GO LIVE</button>
      <div class="wz-nav"><button class="btn btn-line btn-block" data-wz="-1" type="button">Back</button></div>`;
  } else {
    const pr = money(+String(W.price).replace(/\D/g, '') || 0);
    h = `${bars}<span class="wz-k" style="color:var(--live)">You are live</span><h3 class="wz-h">${W.title || 'Your item'} is live in ${W.area}</h3><p class="wz-p">Buyers nearby can see your video now.</p>
      <button class="golive on" type="button" aria-hidden="true" tabindex="-1">LIVE</button>
      <div class="seller" data-sold style="opacity:0;transition:opacity .5s"><span class="ava"><i class="ph ph-lock-key"></i></span><div><b>A buyer in Chaguanas paid ${pr}</b><small>Money is in escrow. Pack it up, a rider is on the way.</small></div></div>
      <div class="wz-nav" style="margin-top:16px"><button class="btn btn-line" data-wzreset type="button">List another</button><a class="btn btn-brand btn-block" href="${waLink(`Hi ALLMART.TT, I want to sell on the app. Shop: ${W.biz || 'not set'} (${W.type}), ${W.area}. First listing: ${W.title || 'item'} at ${pr}.`)}" target="_blank" rel="noopener">Apply on WhatsApp</a></div>`;
    setTimeout(() => { const s = $('[data-sold]'); if (s) s.style.opacity = 1; }, RM ? 0 : 1500);
  }
  el.innerHTML = h;
}
function wzNext(dir) {
  if (dir > 0 && W.step === 2) {
    W.biz = $('#wz-biz').value.trim(); W.type = $('#wz-type').value; W.area = $('#wz-area').value;
    if (!W.biz) { $('[data-err]').textContent = 'Add a shop name, or your own name.'; $('#wz-biz').focus(); return; }
  }
  if (dir > 0 && W.step === 3) {
    W.title = $('#wz-t').value.trim(); W.price = $('#wz-p').value.trim();
    const err = !W.vid ? 'Record your 15-second video first.' : !W.title ? 'Say what you are selling.' : !(+W.price.replace(/\D/g, '')) ? 'Add a price in TTD.' : '';
    if (err) { $('[data-err]').textContent = err; return; }
  }
  if (W.step === 3 && dir < 0) { W.title = $('#wz-t').value.trim(); W.price = $('#wz-p').value.trim(); }
  W.step = Math.max(0, Math.min(5, W.step + dir)); wizard();
}

/* Events */
document.addEventListener('click', e => {
  const t = e.target;
  const fav = t.closest('[data-fav]');
  if (fav) { e.stopPropagation(); const id = fav.dataset.fav; const on = !S.favs.has(id); on ? S.favs.add(id) : S.favs.delete(id); save(); counts(); bump('[data-fav-count]'); fav.classList.toggle('on', on); fav.setAttribute('aria-pressed', on); fav.innerHTML = `<i class="${on ? 'ph-fill' : 'ph'} ph-heart"></i>`; toast(on ? 'Saved' : 'Removed from saved'); return; }
  const v = t.closest('[data-view]'); if (v) { viewProduct(v.dataset.view); return; }
  const act = t.closest('[data-act]'); if (act) { const x = byId(act.dataset.act); if (x.cat === 'property' || x.cat === 'jobs') viewProduct(x.id); else primaryAction(x.id, act); return; }
  const pr = t.closest('[data-primary]'); if (pr) { const x = byId(pr.dataset.primary); primaryAction(x.id, null, true); if (x.cat !== 'jobs' && x.cat !== 'property') { CO.id = ''; checkout(0); } return; }
  const c = t.closest('[data-cat]'); if (c) { setCat(c.dataset.cat); return; }
  const go = t.closest('[data-goto]'); if (go) { S.cat = null; setCat(go.dataset.goto); return; }
  const so = t.closest('[data-sort]'); if (so) { S.sort = so.dataset.sort; $$('[data-sort]').forEach(b => b.classList.toggle('is-on', b === so)); renderGrid(); return; }
  if (t.closest('[data-clear]')) { S.q = ''; S.cat = null; $$('[data-search] input').forEach(i => i.value = ''); renderCats(); renderGrid(); return; }
  const op = t.closest('[data-open]');
  if (op) {
    const k = op.dataset.open;
    if (k === 'sell') { if (!sheet.hidden) closeSheet(); $('#sell').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); return; }
    if (k === 'cart') return viewCart();
    if (k === 'favs') return viewFavs();
    if (k === 'messages') return viewMessages(op.dataset.seller);
    if (k === 'account') return viewAccount();
  }
  const th = t.closest('[data-thread]'); if (th) return viewMessages(th.dataset.thread);
  const q = t.closest('[data-q]'); if (q) { const it = S.cart.find(c => c.id === q.dataset.id); it.q += +q.dataset.q; if (it.q < 1) S.cart = S.cart.filter(c => c !== it); save(); counts(); viewCart(); return; }
  if (t.closest('[data-checkout]')) { CO.id = ''; return checkout(0); }
  const pm = t.closest('[data-method]'); if (pm) { CO.method = pm.dataset.method; $$('[data-method]').forEach(b => b.setAttribute('aria-checked', b === pm)); return; }
  const co = t.closest('[data-co]'); if (co) { if (CO.step === 0) S.buyerTown = $('[data-btown]').value; return checkout(+co.dataset.co); }
  if (t.closest('[data-problem]')) { toast('Payment stays in escrow. Our team will call you.'); return; }
  if (t.closest('[data-done]')) { S.cart = []; save(); counts(); closeSheet(); toast('Order complete'); return; }
  const cg = t.closest('[data-close-go]'); if (cg) { closeSheet(); setTimeout(() => $(cg.dataset.closeGo).scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }), 120); return; }
  const wz = t.closest('[data-wz]'); if (wz) return wzNext(+wz.dataset.wz);
  const up = t.closest('[data-up]'); if (up && !up.classList.contains('ok')) { $('b', up).textContent = 'Checking...'; setTimeout(() => { W[up.dataset.up] = true; wizard(); }, RM ? 0 : 700); return; }
  const rec = t.closest('[data-rec]'); if (rec && !W.vid) { W.title = $('#wz-t').value; W.price = $('#wz-p').value; rec.classList.add('rolling'); $('.rec', rec).innerHTML = '<i class="ph-fill ph-record" style="color:var(--live)"></i>Recording...'; setTimeout(() => { W.vid = true; W.title = $('#wz-t').value; W.price = $('#wz-p').value; wizard(); }, RM ? 0 : 2400); return; }
  if (t.closest('[data-golive]')) { W.step = 5; wizard(); return; }
  if (t.closest('[data-wzreset]')) { Object.assign(W, { step: 3, title: '', price: '', vid: false }); wizard(); return; }
});
document.addEventListener('keydown', e => { const v = e.target.closest && e.target.closest('[data-view][role=button]'); if (v && (e.key === 'Enter' || e.key === ' ') && !e.target.closest('[data-fav]')) { e.preventDefault(); viewProduct(v.dataset.view); } });

/* Search (both boxes share state) */
const PH = ['Search products, cars, properties, services, jobs...', 'Try "PS5"', 'Try "Arima"', 'Try "mangoes"', 'Try "rent-to-own"'];
$$('[data-search]').forEach(f => {
  const i = $('input', f);
  i.addEventListener('input', () => { S.q = i.value; $$('[data-search] input').forEach(o => { if (o !== i) o.value = i.value; }); renderGrid(); });
  f.addEventListener('submit', e => { e.preventDefault(); i.blur(); $('#feed').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); });
});
if (!RM) { let p = 0; const hi = $('#q-hero'); setInterval(() => { if (document.activeElement !== hi && !hi.value) hi.placeholder = PH[++p % PH.length]; }, 3000); }

/* Theme */
const tbtn = $('[data-theme-toggle]');
const setIcon = () => tbtn.innerHTML = `<i class="ph ${document.documentElement.dataset.theme === 'dark' ? 'ph-sun' : 'ph-moon'}"></i>`;
tbtn.addEventListener('click', () => { const d = document.documentElement; d.dataset.theme = d.dataset.theme === 'dark' ? 'light' : 'dark'; store.set('am-theme', d.dataset.theme); try { localStorage.setItem('am-theme', d.dataset.theme); } catch (e) {} setIcon(); });
setIcon();

/* Topbar border + dock state */
const sent = document.createElement('div'); sent.style.cssText = 'position:absolute;top:0;height:8px;width:1px'; document.body.prepend(sent);
new IntersectionObserver(([e]) => $('.topbar').classList.toggle('is-scrolled', !e.isIntersecting)).observe(sent);
new IntersectionObserver(([e]) => { $$('.dock-i[data-dock]').forEach(d => d.classList.toggle('is-on', (d.dataset.dock === 'shop') === e.isIntersecting)); }, { rootMargin: '-40% 0px -40% 0px' }).observe($('#feed'));

/* Reveal on scroll */
const rv = $$('.trust-item, .escrow .h2, .rto-photo, .rto-calc, .map-copy, .map-box, .more .h2, .tile, .sell-copy, .wizard, .closing');
rv.forEach(el => el.classList.add('rv'));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
rv.forEach((el, i) => { el.style.transitionDelay = (el.classList.contains('tile') || el.classList.contains('trust-item') ? (i % 4) * 80 : 0) + 'ms'; io.observe(el); });

/* Init */
$('[data-wa-general]').href = waLink('Hi ALLMART.TT, I would like to place an order.');
renderCats(); renderGrid(); counts(); initStack(); initPipe(); initRto(); initMap(); wizard();
})();
