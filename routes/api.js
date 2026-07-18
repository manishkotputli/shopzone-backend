const express = require('express');
const router  = express.Router();
const { Product, SiteConfig, ProductVariant, Review } = require('../models');
const { Op } = require('sequelize');
const { encryptId, decryptId } = require("../helpers/cryptoHelper");
const axios = require('axios'); // npm install axios --break-system-packages, or use fetch

// Products list
router.get('/products', async (req, res) => {
  try {
    const { category, brand, search, featured, minPrice, maxPrice, minRating, minDiscount, sort } = req.query;
    const where = { is_active: true };
    if (category)  where.category   = category;
    if (brand)     where.brand      = brand;
    if (featured === 'true') where.is_featured = true;
    if (search) {
      where[Op.or] = [
        { name:        { [Op.like]: `%${search}%` } },
        { brand:       { [Op.like]: `%${search}%` } },
        { category:    { [Op.like]: `%${search}%` } },
        { tags:        { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }
    if (minRating)   where.rating            = { [Op.gte]: parseFloat(minRating) };
    if (minDiscount) where.discount_percent  = { [Op.gte]: parseInt(minDiscount) };

    let order = [['id','DESC']];
    if (sort === 'priceLow')  order = [['price','ASC']];
    if (sort === 'priceHigh') order = [['price','DESC']];
    if (sort === 'rating')    order = [['rating','DESC']];
    if (sort === 'discount')  order = [['discount_percent','DESC']];

    const products = await Product.findAll({ where, order });

const data = products.map(p => {
    const obj = p.toJSON();

    obj.encrypted_id = encryptId(obj.id);

    return obj;
});

res.json({
    success: true,
    products: data
});
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, products: [] });
  }
});

// router.get("/product", (req, res) => {

//     if (!req.query.product_id) {
//     return res.redirect("/");
// }

//     res.render("product");
// });

// Single product — with variants + reviews
router.get('/products/:id', async (req, res) => {
  try {
   const id = decryptId(req.params.id);

if (!id) {
    return res.status(400).json({
        success:false,
        error:"Invalid Product"
    });
}

const product = await Product.findOne({
    where:{
        id,
        is_active:true
    },
    include:[
        {
            model:ProductVariant,
            as:"variants",
            where:{is_active:true},
            required:false
        },
        {
            model:Review,
            as:"reviews",
            where:{is_active:true},
            required:false
        }
    ]
});
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Categories
router.get('/categories', async (req, res) => {
  try {
    const rows = await Product.findAll({
      attributes: ['category', [Product.sequelize.fn('COUNT', Product.sequelize.col('id')), 'count']],
      where: { is_active: true }, group: ['category'], raw: true
    });
    res.json({ success: true, categories: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Public site config
router.get('/config', async (req, res) => {
  try {
    const all = await SiteConfig.getAll();
    res.json({ success: true, config: {
      upi_id: all.upi_id||'', upi_name: all.upi_name||'',
      phonepe_upi: all.phonepe_upi||'', gpay_upi: all.gpay_upi||'',
      paytm_upi: all.paytm_upi||'', qr_image: all.qr_image||'',
      store_name: all.store_name||'ShopZone', store_tagline: all.store_tagline||'',
      store_phone: all.store_phone||'', store_email: all.store_email||'',
      free_delivery_min: all.free_delivery_min||'0', gst_percent: all.gst_percent||'0'
    }});
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


router.post('/send-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number' });
    }
    if (!otp || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    const apiUrl = req.app.locals.CFG.otp_api_url;
    const apiKey = req.app.locals.CFG.otp_api_key;
    const templateId = '0afbdeb0-785d-4dd0-bd48-365a182df276';

    if (!apiUrl || !apiKey) {
      return res.status(500).json({ error: 'OTP service not configured' });
    }

    await axios.post(apiUrl, {
      phoneNumber: '+91' + mobile,
      templateId,
      variables: { otp, appName: 'ShopZone' }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      }
    });

    res.json({ success: true });
  } catch (err) {
    console.error('[OTP] Send failed:', err.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

module.exports = router;
