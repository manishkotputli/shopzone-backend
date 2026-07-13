// ── ShopZone Product Store — fetches from MySQL via API (no localStorage) ────

let _productsCache = null;
let _configCache = null;

async function fetchProducts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch('/api/products' + (qs ? '?' + qs : ''));
  const data = await res.json();
  return data.success ? data.products : [];
}

async function fetchProductById(id) {
  const res = await fetch('/api/products/' + id);
  const data = await res.json();
  return data.success ? data.product : null;
}

async function fetchSiteConfig() {
  if (_configCache) return _configCache;
  const res = await fetch('/api/config');
  const data = await res.json();
  _configCache = data.success ? data.config : {};
  return _configCache;
}

// Normalize a product object from API (decimal strings -> numbers, field aliasing)
function normalizeProduct(p) {
  if (!p) return p;
  return {
    ...p,
    price: parseFloat(p.price),
    orig: p.original_price ? parseFloat(p.original_price) : null,
    save: p.discount_percent || 0,
    reviews: p.reviews || 0,
    rating: parseFloat(p.rating) || 4,
    desc: p.description || '',
  };
}

// Shared product-card renderer (used on home, category, deals, and product-detail "related" rail)
function renderProductCard(p, showSave) {
  p = normalizeProduct(p);
  const img = p.image_url ? `<img src="${p.image_url}" alt="${p.name}" style="max-width:100%;max-height:100%;object-fit:contain;">` : (p.emoji||'📦');
  const badge = p.badge ? `<div class="prod-badge ${p.badge.toLowerCase()}">${p.badge}</div>`
    : p.save ? `<div class="prod-badge">-${p.save}%</div>` : '';
  const saveEl = showSave && p.save ? `<span class="price-save">Save ${p.save}%</span>` : '';
  const origEl = p.orig ? `<span class="price-orig">₹${p.orig.toLocaleString('en-IN')}</span>` : '';
  const isHi = getLang() === 'hi';
  return `<div class="prod-card">
    ${badge}
    <a href="/product?id=${p.id}"><div class="prod-img-wrap">${img}</div></a>
    <div class="prod-body">
      <div class="prod-brand">${p.brand||''}</div>
      <a href="/product?id=${p.id}"><div class="prod-name">${p.name}</div></a>
      <div class="rating-row">
        <span class="stars">${'★'.repeat(Math.floor(p.rating||4))}${(p.rating||4)%1===0.5?'½':''}</span>
        <span class="rating-count">(${(p.reviews||0).toLocaleString()})</span>
      </div>
      <div class="price-row">
        <span class="price">₹${p.price.toLocaleString('en-IN')}</span>
        ${origEl}${saveEl}
      </div>
      <div class="prime-badge"><span>prime</span><small data-t="freeDelivery">${isHi?'मुफ्त डिलीवरी':'FREE Delivery'}</small></div>
      <button class="add-cart-btn" onclick="addToCart(${p.id},'${p.name.replace(/'/g,"\\'")}',${p.price})" data-t="addToCart">${isHi?'कार्ट में जोड़ें':'Add to Cart'}</button>
    </div>
  </div>`;
}
