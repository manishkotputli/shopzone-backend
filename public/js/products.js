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
