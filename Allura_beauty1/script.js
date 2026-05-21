/* ─── Constants ─── */
const WA = "201557546026";

const CATEGORIES = [
  { id:"centella", label:"Centella" },
  { id:"huda",     label:"Huda Beauty" },
  { id:"ordinary", label:"The Ordinary" },
];
const CAT_IMGS = {
  centella: "Images/centella_products.webp",
  huda:  "Images/Huda_beauty.webp",
  ordinary: "Images/Ordinary_products.webp",
};

const PRODUCTS = [
  { id:"sunscreen-centella",       name:"Sunscreen Centella",            category:"centella", description:"Lightweight daily sunscreen infused with Centella Asiatica. Soothes redness and shields skin from UVA/UVB damage with a soft, dewy finish.",                 image:"Images/Sunscreen_Centella.webp", prices:{"10ml":320,"15ml":450,"Full Size":1450} },
  { id:"ampoule-centella",         name:"Ampoule Centella",              category:"centella", description:"A concentrated calming ampoule that targets sensitivity and uneven texture. Strengthens the skin barrier with pure Centella extract.",                      image:"Images/Ampoule_centella.webp", prices:{"10ml":280,"15ml":380,"Full Size":1600} },
  { id:"ampoule-foam-centella",    name:"Ampoule Foam Centella",         category:"centella", description:"Velvety cleansing foam with the soothing power of Centella ampoule. Removes impurities while keeping skin balanced and calm.",                               image:"Images/Ampoule_foam_centella.webp", prices:{"10ml":200,"15ml":280,"20ml":375,"30ml":550,"Full Size":1300} },
  { id:"centella-oil-wash",        name:"Centella Oil Wash",             category:"centella", description:"Silky cleansing oil that melts away makeup and SPF. Centella infusion leaves skin soft, comforted and never stripped.",                                    image:"Images/centella_oil_wash.webp", prices:{"10ml":195,"15ml":245,"30ml":475,"Full Size":1655} },
  { id:"loose-powder-birthday",    name:"Loose Powder — Birthday Cake",  category:"huda",     description:"Iconic translucent loose powder with a soft pink hue. Sets makeup for a luminous, blurred finish that lasts all day.",                                      image:"Images/powder_birthday.webp", prices:{"Full Size":3000,} },
  { id:"loose-powder-easybake",    name:"Loose Powder — Easy Bake",      category:"huda",     description:"Featherlight baking powder for a flawless under-eye and crease-free finish. Buildable, breathable, beautifully smooth.",                                        image:"      Images/Powder_easy.webp", prices:{"2ml":290,"5ml":600} },
  { id:"primer-huda-beauty",       name:"Primer Huda Beauty",            category:"huda",     description:"Smoothing primer that blurs pores and grips makeup for hours. Silky texture with a satin, second-skin finish.",                                                 image:"Images/Primer_huda_beauty.webp", prices:{"2ml":295,"5ml":620} },
  { id:"foundation-huda-beauty",   name:"Foundation Huda Beauty",        category:"huda",     description:"Full-coverage liquid foundation with a luminous matte finish. Lightweight feel, transfer-resistant, photo-ready.",                                              image:"Images/Foundation.webp", prices:{"2ml":300,"5ml":675} },
  { id:"the-ordinary-serum",       name:"The Ordinary Serum",            category:"ordinary", description:"Clinically-inspired serum with active ingredients to refine, hydrate and even out skin tone. Minimalist skincare, maximum results.",                            image:"Images/The_Ordinary.webp", prices:{"10ml":175,"15ml":225,"20ml":300,"30ml":435} },
];

/* ─── State ─── */
let currentPage = "home";
let prevPage    = "home";
let shopCat     = "all";
let detProd     = null;

let detQty      = 1;

/* ─── Helpers ─── */
const fmt = n => {
  if (n == null || n === "" || isNaN(n)) return "N/A";
  return Number(n).toLocaleString() + " EGP";
};

function buildWA(product, size, qty) {
  const price = product.prices[size];
  const msg = `Hello, I want to order:\nProduct: ${product.name}\nSize: ${size}\nQuantity: ${qty}\nPrice: ${price} EGP\nTotal: ${price*qty} EGP`;
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}

function productCard(p, i) {
  const min = Math.min(...Object.values(p.prices));
  return `<div class="prod-card fade-up" style="animation-delay:${i*60}ms" onclick="openProduct('${p.id}')">
    <div class="prod-img"><img src="${p.image}" alt="${p.name}" loading="lazy"/></div>
    <div class="prod-info">
      <p class="prod-cat">${p.category}</p>
      <h3 class="prod-name">${p.name}</h3>
      <div class="prod-price-row"><span>From</span><span class="prod-price">${fmt(min)}</span></div>
    </div>
  </div>`;
}

/* ─── Navigation ─── */
function showPage(name) {
  prevPage = currentPage;
  document.getElementById("page-"+currentPage).classList.remove("active");
  currentPage = name;
  document.getElementById("page-"+name).classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});

  document.querySelectorAll(".nav-links a").forEach(a => a.classList.remove("active"));
  if (name==="home") document.getElementById("nl-home").classList.add("active");
  if (name==="shop") document.getElementById("nl-shop").classList.add("active");

  if (name==="shop") renderShop();
}

function goBack() { showPage(prevPage==="product"?"shop":prevPage); }

function goCat(id) {
  shopCat = id;
  showPage("shop");
  renderShop();
}

/* ─── Mobile ─── */
function toggleMobile() { document.getElementById("mobile-menu").classList.toggle("open"); }
function closeMobile()  { document.getElementById("mobile-menu").classList.remove("open"); }

/* ─── Nav search ─── */
function navSearch(val) {
  const sq = document.getElementById("shop-q");
  if (sq) sq.value = val;
  showPage("shop");
  renderShop();
}

/* ─── Home ─── */
function renderHome() {
  document.getElementById("cat-grid").innerHTML = CATEGORIES.map((c,i) =>
    `<div class="cat-card fade-up" style="animation-delay:${i*100}ms" onclick="goCat('${c.id}')">
      <img src="${CAT_IMGS[c.id]}" alt="${c.label}" loading="lazy"/>
      <div class="cat-overlay"></div>
      <div class="cat-text">
        <p class="cat-label">Collection</p>
        <h3 class="cat-name">${c.label}</h3>
        <span class="cat-discover">Discover <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
      </div>
    </div>`).join("");

  document.getElementById("featured-grid").innerHTML = PRODUCTS.slice(0,4).map(productCard).join("");
}

/* ─── Shop ─── */
function renderShop() {
  const q = (document.getElementById("shop-q")?.value||"").toLowerCase();
  const filtered = PRODUCTS.filter(p =>
    (shopCat==="all"||p.category===shopCat) &&
    (!q||p.name.toLowerCase().includes(q)||p.description.toLowerCase().includes(q))
  );

  const grid  = document.getElementById("shop-grid");
  const noRes = document.getElementById("no-results");

  if (!filtered.length) { grid.innerHTML=""; noRes.style.display="block"; }
  else { noRes.style.display="none"; grid.innerHTML = filtered.map(productCard).join(""); }

  const allCats = [{id:"all",label:"All"}, ...CATEGORIES];
  document.getElementById("filter-pills").innerHTML = allCats.map(c =>
    `<button class="pill ${shopCat===c.id?"active":""}" onclick="filterPill('${c.id}')">${c.label}</button>`
  ).join("");
}

function filterPill(id) { shopCat=id; renderShop(); }

/* ─── Detail ─── */
function openProduct(id) {
  detProd = PRODUCTS.find(p=>p.id===id);
  detSize = Object.keys(detProd.prices)[0];
  if (!detProd) return;
  detSize = "15ml"; detQty = 1;
  prevPage = currentPage;
  showPage("product");
  renderDetail();
}

function renderDetail() {
  const p = detProd;
document.getElementById("det-img").src  = p.image;
  document.getElementById("det-img").alt  = p.name;
  document.getElementById("det-cat").textContent  = p.category;
  document.getElementById("det-name").textContent = p.name;
  document.getElementById("det-desc").textContent = p.description;
  updatePrices();
document.getElementById("size-btns").innerHTML =
  ["2ml","5ml","10ml","15ml","20ml","30ml","Full Size"]
  .map(s => {
    const price = detProd.prices[s];

    if (!price) return "";

    return `
      <button class="size-btn ${s === detSize ? "active" : ""}"
        onclick="selectSize('${s}')">
        <div class="sb-size">${s}</div>
        <div class="sb-price">${fmt(price)}</div>
      </button>
    `;
  }).join("");
}
function updatePrices() {
  const price = detProd.prices[detSize];
 
  document.getElementById("det-price").textContent  = fmt(price);
  document.getElementById("det-total").textContent  = fmt(price*detQty);
  document.getElementById("qty-val").textContent    = detQty;
  document.getElementById("wa-link").href           = buildWA(detProd, detSize, detQty);
 
}

function selectSize(s) {
  detSize = s;
  document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
  event.currentTarget.classList.add("active");
  updatePrices();
}

function changeQty(d) { detQty = Math.max(1, detQty+d); updatePrices(); }

/* ─── Init ─── */
document.getElementById("yr").textContent = new Date().getFullYear();
renderHome();