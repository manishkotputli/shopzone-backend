const express = require('express');
const router  = express.Router();
const { Product, SiteConfig, ProductVariant, Review } = require('../models');
const { requireAdmin } = require('../middleware/auth');
const { uploadProductImage, uploadQrImage, uploadLogo } = require('../middleware/upload');
const { Op } = require('sequelize');
const { encryptId, decryptId } = require("../helpers/cryptoHelper");



const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'shopzone123';

// ── Login ─────────────────────────────────────────────────────────────────────
router.get('/login',  (req, res) => res.render('admin/login', { error: null }));
router.post('/login', (req, res) => {
  if (req.body.username === ADMIN_USER && req.body.password === ADMIN_PASS) {
    res.setHeader('Set-Cookie', 'sz_admin=authenticated; Path=/; HttpOnly; Max-Age=86400');
    return res.redirect('/admin/panel');
  }
 res.render('admin/login', {
  error: 'Invalid username or password. Please try again.'
});
});
router.get('/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'sz_admin=; Path=/; Max-Age=0');
  res.redirect('/admin/login');
});
router.get('/',      (req, res) => res.redirect('/admin/panel'));
router.get('/panel', requireAdmin, (req, res) => res.render('admin/panel'));




router.post('/api/upload-image', requireAdmin, uploadProductImage.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, error:'No file' });
    const url = `/uploads/products/${req.file.filename}`;
    res.json({ success:true, url });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});
// ════════════════ PRODUCTS ════════════════
router.get('/api/products', requireAdmin, async (req, res) => {
  try {
    const { search, category, brand } = req.query;
    const where = {};
    if (search)   where.name     = { [Op.like]: `%${search}%` };
    if (category) where.category = category;
    if (brand)    where.brand    = brand;
    const products = await Product.findAll({ where, order:[['id','DESC']] });
    res.json({ success:true, products: products.map(withEncryptedId) });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.get('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const p = await Product.findByPk(req.params.id, {
      include: [
        { model: ProductVariant, as:'variants', required:false },
        { model: Review,         as:'reviews',  required:false }
      ]
    });
    if (!p) return res.status(404).json({ success:false, error:'Not found' });
    res.json({ success:true,product: withEncryptedId(p) });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

function coerce(body) {

  ['highlights', 'specifications', 'in_box'].forEach(f => {
    if (typeof body[f] === 'string') {
      try {
        body[f] = JSON.parse(body[f]);
      } catch {
        body[f] = f === 'specifications' ? {} : [];
      }
    }
  });

  ['price', 'original_price'].forEach(f => {
    if (body[f] !== undefined && body[f] !== '') {
      body[f] = parseFloat(body[f]);
    } else {
      delete body[f];
    }
  });

  ['discount_percent','review_count','stock_quantity','warranty_months','weight_grams'].forEach(f => {
    if (body[f] !== undefined && body[f] !== '') {
      body[f] = parseInt(body[f]);
    } else {
      delete body[f];
    }
  });

  if (body.rating !== undefined && body.rating !== '') {
    body.rating = parseFloat(body.rating);
  } else {
    delete body.rating;
  }

  if (body.is_featured !== undefined) {
    body.is_featured = body.is_featured === 'true' || body.is_featured === true;
  }

  if (body.is_active !== undefined) {
    body.is_active = body.is_active === 'true' || body.is_active === true;
  }

  return body;
}

function withEncryptedId(p) {
  const obj = p.toJSON();          // plain object banao pehle
  obj.encrypted_id = encryptId(p.id);
  return obj;
}

router.post('/api/products', requireAdmin, uploadProductImage.single('image'), async (req, res) => {
  try {
    const body = coerce({...req.body});
    if (req.file) {
    body.image_url = `/uploads/products/${req.file.filename}`;
}
    const p = await Product.create(body);
    res.json({ success:true, product:p });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.put('/api/products/:id', requireAdmin, uploadProductImage.single('image'), async (req, res) => {
 //console.log("=== PUT ROUTE HIT ===");

  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ success:false, error:'Not found' });
    const body = coerce({...req.body});
  if (req.file) {
    body.image_url = `/uploads/products/${req.file.filename}`;
}
  

//console.log("Before:", p.toJSON());

await p.update(body);

// console.log("After:", p.toJSON());
    res.json({ success:true, product:p });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.delete('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    await Product.destroy({ where:{ id:req.params.id } });
    res.json({ success:true });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.get('/api/meta', requireAdmin, async (req, res) => {
  try {
    const cats  = await Product.findAll({ attributes:[[Product.sequelize.fn('DISTINCT',Product.sequelize.col('category')),'category']], raw:true });
    const brands= await Product.findAll({ attributes:[[Product.sequelize.fn('DISTINCT',Product.sequelize.col('brand')),'brand']], raw:true });
    res.json({ success:true, categories:cats.map(c=>c.category).filter(Boolean), brands:brands.map(b=>b.brand).filter(Boolean) });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

// ════════════════ VARIANTS ════════════════
router.get('/api/products/:id/variants', requireAdmin, async (req, res) => {
  try {
    const v = await ProductVariant.findAll({ where:{ product_id:req.params.id }, order:[['sort_order','ASC']] });
    res.json({ success:true, variants:v });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

// Bulk-replace variants for a product
router.post('/api/products/:id/variants', requireAdmin, async (req, res) => {
  try {
    const { variants } = req.body; // array of { variant_type, variant_value, price_modifier, stock, sort_order }
    await ProductVariant.destroy({ where:{ product_id:req.params.id } });
    if (variants && variants.length) {
      const rows = variants.map((v,i) => ({ ...v, product_id:parseInt(req.params.id), sort_order:i }));
      await ProductVariant.bulkCreate(rows);
    }
    const saved = await ProductVariant.findAll({ where:{ product_id:req.params.id }, order:[['sort_order','ASC']] });
    res.json({ success:true, variants:saved });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

// ════════════════ REVIEWS ════════════════
router.get('/api/reviews', requireAdmin, async (req, res) => {
  try {
    const { product_id } = req.query;
    const where = product_id ? { product_id } : {};
    const reviews = await Review.findAll({ where, order:[['id','DESC']] });
    res.json({ success:true, reviews });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.post('/api/reviews', requireAdmin, async (req, res) => {
  try {
    const body = {...req.body};
    body.rating = parseInt(body.rating)||5;
    body.helpful_count = parseInt(body.helpful_count)||0;
    body.verified = body.verified==='true'||body.verified===true;
    body.is_active = body.is_active!=='false';
    if (!body.product_id || body.product_id==='') body.product_id = null;
    const r = await Review.create(body);
    res.json({ success:true, review:r });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.put('/api/reviews/:id', requireAdmin, async (req, res) => {
  try {
    const r = await Review.findByPk(req.params.id);
    if (!r) return res.status(404).json({ success:false, error:'Not found' });
    const body = {...req.body};
    body.rating = parseInt(body.rating)||5;
    if (!body.product_id||body.product_id==='') body.product_id = null;
    await r.update(body);
    res.json({ success:true, review:r });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.delete('/api/reviews/:id', requireAdmin, async (req, res) => {
  try {
    await Review.destroy({ where:{ id:req.params.id } });
    res.json({ success:true });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

// ════════════════ SITE CONFIG ════════════════
router.get('/api/config', requireAdmin, async (req, res) => {
  try {
    const rows = await SiteConfig.findAll({ order:[['group_name','ASC'],['id','ASC']] });
    res.json({ success:true, configs:rows });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.post('/api/config', requireAdmin, async (req, res) => {
  try {
    for (const key of Object.keys(req.body)) await SiteConfig.set(key, req.body[key]);
    res.json({ success:true });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});

router.post('/api/config/qr-upload', requireAdmin, uploadQrImage.single('qr'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, error:'No file' });
    const url = `/uploads/qr/${req.file.filename}`;
    await SiteConfig.set('qr_image', url);
    res.json({ success:true, url });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
});


router.post(
    "/api/upload-logo",
    requireAdmin,
    uploadLogo.single("logo"),
    async (req,res)=>{

        if(!req.file){
            return res.json({
                success:false,
                error:"No file"
            });
        }

        const logo="/uploads/logo/"+req.file.filename;

        await SiteConfig.set("store_logo",logo);

        res.json({
            success:true,
            logo
        });

});

module.exports = router;
