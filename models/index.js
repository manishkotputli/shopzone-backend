const sequelize    = require('../config/database');
const Product      = require('./Product');
const SiteConfig   = require('./SiteConfig');
const ProductVariant = require('./ProductVariant');
const Review       = require('./Review');

// Associations
Product.hasMany(ProductVariant, { foreignKey: 'product_id', as: 'variants', onDelete: 'CASCADE' });
ProductVariant.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'product_id' });

// ── Seed Data ────────────────────────────────────────────────────────────────
const SEED_PRODUCTS = [
  {
    name:'Shining Diva Fashion Traditional Gold Plated Choker Necklace Set for Women',
    brand:'Shining Diva Fashion', category:'Fashion', sub_category:'Jewellery',
    emoji:'💍', price:499, original_price:2495, discount_percent:80,
    rating:3.9, review_count:28, badge:'SALE', stock_quantity:100,
    is_featured:true, seller_name:'VRP Telematics', warranty_months:0,
    country_of_origin:'India', sku:'SDF-NK-001',
    description:'Traditional Gold Plated Copper Choker Necklace Jewellery Set. Stylish Design Fancy Wedding Party Jewelry for Women & Girls.',
    highlights:['Gold plated copper material','Traditional & ethnic design','Suitable for weddings, parties, festivals','Lightweight and comfortable to wear','Includes necklace and earrings set'],
    specifications:{'Material':'Copper Gold Plated','Type':'Necklace & Earrings Set','Occasion':'Wedding, Party, Festival','Style':'Traditional, Ethnic','Country of Origin':'India'},
    in_box:['1 Necklace','1 Pair Earrings'],
    tags:'necklace,choker,gold,jewellery,fashion,traditional,ethnic'
  },
  {
    name:'XJARVIS Clifton Men\'s Solid Linen Cotton Shirt | Casual | Plain | Full Sleeve',
    brand:'NexaFlair', category:'Fashion', sub_category:'Men Shirts',
    emoji:'👔', price:468, original_price:1999, discount_percent:77,
    rating:3.5, review_count:981, badge:'SALE', stock_quantity:200,
    is_featured:true, seller_name:'Cocoblu Retail', warranty_months:0,
    country_of_origin:'India', sku:'XJV-SHIRT-001',
    description:'XJARVIS Clifton Men\'s Solid Linen Cotton Shirt. Casual | Plain | Full Sleeve | Summer-Regular Fit | Men\'s Stylish Shirt | Everyday Formal Wear.',
    highlights:['100% Cotton Linen Fabric','Regular Fit, Full Sleeve','Single chest pocket','Available in multiple colors','Suitable for casual & formal wear'],
    specifications:{'Fabric':'Cotton Linen','Fit':'Regular Fit','Sleeve':'Full Sleeve','Neck':'Collar Neck','Occasion':'Casual, Formal','Pattern':'Solid'},
    in_box:['1 Shirt'],
    tags:'shirt,men,cotton,linen,casual,formal,full sleeve'
  },
  {
    name:'Bellstone Men\'s Cotton Blend Solid Regular Fit Casual Shirt',
    brand:'Bellstone', category:'Fashion', sub_category:'Men Shirts',
    emoji:'👕', price:399, original_price:1999, discount_percent:80,
    rating:4.0, review_count:2109, badge:'SALE', stock_quantity:300,
    is_featured:false, seller_name:'ShopZone Official', warranty_months:0,
    country_of_origin:'India', sku:'BLS-SHIRT-001',
    description:'Bellstone Men\'s Cotton Blend Solid Regular Fit Casual Shirt. Soft, breathable fabric perfect for everyday wear.',
    highlights:['Soft 100% Cotton Blend Fabric','Regular Fit for comfortable wear','Chest pocket','Machine washable','Ideal for daily casual wear'],
    specifications:{'Fabric':'Cotton Blend','Fit':'Regular Fit','Sleeve':'Full Sleeve','Pattern':'Solid','Occasion':'Casual'},
    in_box:['1 Shirt'],
    tags:'shirt,men,cotton,casual,regular fit,bellstone'
  },
  {
    name:'Samsung Galaxy S24 Ultra 5G (256GB, Titanium Black)',
    brand:'Samsung', category:'Electronics', sub_category:'Smartphones',
    emoji:'📱', price:74999, original_price:89999, discount_percent:17,
    rating:4.5, review_count:12840, badge:'HOT', stock_quantity:50,
    is_featured:true, seller_name:'Samsung India Official',
    warranty_months:12, country_of_origin:'South Korea', sku:'SAM-S24U-256',
    description:'The Samsung Galaxy S24 Ultra with integrated S Pen, 200MP camera, and Snapdragon 8 Gen 3.',
    highlights:['6.8" QHD+ Dynamic AMOLED 2X 120Hz','200MP Main Camera','Snapdragon 8 Gen 3','5000mAh battery 45W charging','Built-in S Pen'],
    specifications:{'Display':'6.8 inch QHD+ AMOLED','Processor':'Snapdragon 8 Gen 3','RAM':'12 GB','Storage':'256 GB','Battery':'5000 mAh','OS':'Android 14'},
    in_box:['Smartphone','S Pen','USB-C Cable','SIM Ejector Pin'],
    tags:'samsung,galaxy,s24,ultra,5g,smartphone'
  },
  {
    name:'boAt Airdopes 141 TWS Earbuds (Bold Black)',
    brand:'boAt', category:'Electronics', sub_category:'Earphones',
    emoji:'🎵', price:899, original_price:4990, discount_percent:82,
    rating:4.1, review_count:89200, badge:'SALE', stock_quantity:500,
    is_featured:true, seller_name:'boAt Official Store',
    warranty_months:12, country_of_origin:'India', sku:'BOT-AD141-BLK',
    description:'boAt Airdopes 141 with 42H total playback, ENx noise cancellation for calls, IPX4 water resistance.',
    highlights:['42 Hours total playback','ENx technology for clear calls','IPX4 water resistant','BEAST™ Mode low latency','Type-C charging'],
    specifications:{'Driver':'8mm Dynamic','Total Playback':'42 Hours','Bluetooth':'5.2','Water Resistance':'IPX4'},
    in_box:['Earbuds (L+R)','Charging Case','USB-C Cable','Ear Tips (3 sizes)'],
    tags:'boat,earbuds,tws,wireless,bluetooth,airdopes'
  }
];

const SEED_VARIANTS = [
  // Necklace colors
  { product_id:1, variant_type:'Color', variant_value:'Round Bead Gold', price_modifier:0,  stock:50, sort_order:1 },
  { product_id:1, variant_type:'Color', variant_value:'Kundan',          price_modifier:0,  stock:30, sort_order:2 },
  { product_id:1, variant_type:'Color', variant_value:'Pearl Border',    price_modifier:56, stock:40, sort_order:3 },
  // XJARVIS shirt sizes
  { product_id:2, variant_type:'Size',  variant_value:'S',   price_modifier:0,  stock:40, sort_order:1 },
  { product_id:2, variant_type:'Size',  variant_value:'M',   price_modifier:0,  stock:60, sort_order:2 },
  { product_id:2, variant_type:'Size',  variant_value:'L',   price_modifier:0,  stock:55, sort_order:3 },
  { product_id:2, variant_type:'Size',  variant_value:'XL',  price_modifier:0,  stock:45, sort_order:4 },
  { product_id:2, variant_type:'Size',  variant_value:'2XL', price_modifier:0,  stock:30, sort_order:5 },
  // Bellstone shirt sizes
  { product_id:3, variant_type:'Size',  variant_value:'S',   price_modifier:0,  stock:50, sort_order:1 },
  { product_id:3, variant_type:'Size',  variant_value:'M',   price_modifier:0,  stock:80, sort_order:2 },
  { product_id:3, variant_type:'Size',  variant_value:'L',   price_modifier:0,  stock:70, sort_order:3 },
  { product_id:3, variant_type:'Size',  variant_value:'XL',  price_modifier:0,  stock:60, sort_order:4 },
  { product_id:3, variant_type:'Size',  variant_value:'2XL', price_modifier:0,  stock:40, sort_order:5 },
  // Samsung storage
  { product_id:4, variant_type:'Storage', variant_value:'256GB',  price_modifier:0,     stock:30, sort_order:1 },
  { product_id:4, variant_type:'Storage', variant_value:'512GB',  price_modifier:10000, stock:20, sort_order:2 },
  { product_id:4, variant_type:'Color',   variant_value:'Titanium Black',  price_modifier:0,    stock:20, sort_order:1 },
  { product_id:4, variant_type:'Color',   variant_value:'Titanium Gray',   price_modifier:0,    stock:10, sort_order:2 },
  { product_id:4, variant_type:'Color',   variant_value:'Titanium Violet', price_modifier:0,    stock:10, sort_order:3 },
];

const SEED_REVIEWS = [
  { product_id:1, reviewer_name:'Priya Sharma', reviewer_city:'Jaipur', rating:4, title:'Good quality, looks expensive!', body:'Bought this for my sister\'s wedding. The quality is really good for the price. Looks very expensive and elegant. Everyone complimented her. Delivery was fast too.', verified:true, helpful_count:12, review_date:'2026-06-15' },
  { product_id:1, reviewer_name:'Sunita Devi', reviewer_city:'Delhi', rating:5, title:'Exactly as shown in image', body:'The necklace looks exactly like the pictures. My daughter loved it for her engagement ceremony. Gold plating is thick and hasn\'t faded. Very happy with this purchase!', verified:true, helpful_count:8, review_date:'2026-05-20' },
  { product_id:1, reviewer_name:'Meena Agarwal', reviewer_city:'Mumbai', rating:3, title:'Decent but earrings are small', body:'Necklace is beautiful and worth the money. But the earrings that came with it are a bit small. Overall still a good deal for this price.', verified:true, helpful_count:5, review_date:'2026-04-10' },
  { product_id:2, reviewer_name:'Rahul Verma', reviewer_city:'Noida', rating:4, title:'Great fabric, perfect fit', body:'The shirt quality is amazing for the price. Linen cotton blend feels premium. Size M fits perfectly as per the size chart. Color is exactly as shown. Highly recommended!', verified:true, helpful_count:23, review_date:'2026-06-20' },
  { product_id:2, reviewer_name:'Amit Kumar', reviewer_city:'Bangalore', rating:3, title:'Good but slightly transparent', body:'The shirt looks stylish and the fit is nice. However the white color is slightly see-through. Quality is decent for the price. Would recommend darker colors.', verified:true, helpful_count:15, review_date:'2026-06-01' },
  { product_id:3, reviewer_name:'Vikash Singh', reviewer_city:'Lucknow', rating:5, title:'Best value shirt under 500', body:'Absolutely love this shirt! Soft fabric, perfect stitching, and great fit. Washed it 5 times already and no fading or damage. Best purchase this month!', verified:true, helpful_count:45, review_date:'2026-06-18' },
  { product_id:4, reviewer_name:'Tech Reviewer', reviewer_city:'Hyderabad', rating:5, title:'Best Android phone ever!', body:'S24 Ultra is simply the best. S Pen is amazing, camera quality is unreal. Battery lasts a full day easily. Build quality is premium. Worth every rupee!', verified:true, helpful_count:89, review_date:'2026-05-15' },
  { product_id:5, reviewer_name:'Music Lover', reviewer_city:'Chennai', rating:4, title:'Great earbuds for the price', body:'Sound quality is very good for earbuds in this price range. Bass is punchy. ANC is decent. Battery life of 42 hours is excellent. Highly recommended!', verified:true, helpful_count:120, review_date:'2026-06-10' },
];

const SEED_CONFIG = [
  { config_key:'upi_id',           config_value:'shopzone@upi',                      config_type:'text',  label:'Primary UPI ID',            group_name:'payment' },
  { config_key:'upi_name',         config_value:'ShopZone Payments',                 config_type:'text',  label:'UPI Display Name',          group_name:'payment' },
  { config_key:'phonepe_upi',      config_value:'shopzone@ybl',                      config_type:'text',  label:'PhonePe UPI ID',            group_name:'payment' },
  { config_key:'gpay_upi',         config_value:'shopzone@okaxis',                   config_type:'text',  label:'Google Pay UPI ID',         group_name:'payment' },
  { config_key:'paytm_upi',        config_value:'shopzone@paytm',                    config_type:'text',  label:'Paytm UPI ID',              group_name:'payment' },
  { config_key:'qr_image',         config_value:'',                                  config_type:'image', label:'Payment QR Code Image',     group_name:'payment' },
  { config_key:'bank_name',        config_value:'State Bank of India',               config_type:'text',  label:'Bank Name',                 group_name:'bank' },
  { config_key:'bank_account_no',  config_value:'1234567890',                        config_type:'text',  label:'Account Number',            group_name:'bank' },
  { config_key:'bank_ifsc',        config_value:'SBIN0001234',                       config_type:'text',  label:'IFSC Code',                 group_name:'bank' },
  { config_key:'bank_holder',      config_value:'ShopZone Pvt Ltd',                  config_type:'text',  label:'Account Holder Name',       group_name:'bank' },
  { config_key:'bank_branch',      config_value:'New Delhi Main Branch',             config_type:'text',  label:'Branch Name',               group_name:'bank' },
  { config_key:'store_name',       config_value:'ShopZone',                          config_type:'text',  label:'Store Name',                group_name:'store' },
  { config_key:'store_tagline',    config_value:"India's Fastest Growing Online Store", config_type:'text',label:'Tagline',                  group_name:'store' },
  { config_key:'store_phone',      config_value:'1800-XXX-XXXX',                     config_type:'text',  label:'Support Phone',             group_name:'store' },
  { config_key:'store_email',      config_value:'support@shopzone.in',               config_type:'text',  label:'Support Email',             group_name:'store' },
  { config_key:'store_address',    config_value:'New Delhi, India 110001',            config_type:'text',  label:'Store Address',             group_name:'store' },
  { config_key:'free_delivery_min',config_value:'0',                                 config_type:'text',  label:'Free Delivery Min Order (₹)',group_name:'store' },
  { config_key:'gst_percent',      config_value:'18',                                config_type:'text',  label:'GST %',                     group_name:'store' },
  { config_key:'otp_api_url',      config_value:'https://api.example.com/send-otp',  config_type:'text',  label:'OTP API URL (POST)',         group_name:'store' },
  { config_key:'otp_api_key',      config_value:'YOUR_OTP_API_KEY_HERE',             config_type:'text',  label:'OTP API Key',               group_name:'store' },
];

async function syncDB() {
  await sequelize.sync();

  const pCount = await Product.count();
  if (pCount === 0) {
    const created = await Product.bulkCreate(SEED_PRODUCTS);
    // Update seed_variant product_ids to match actual inserted ids
    const idMap = created.map(p => p.id);
    const adjustedVariants = SEED_VARIANTS.map(v => ({ ...v, product_id: idMap[v.product_id - 1] }));
    await ProductVariant.bulkCreate(adjustedVariants);
    const adjustedReviews = SEED_REVIEWS.map(r => ({ ...r, product_id: r.product_id ? idMap[r.product_id - 1] : null }));
    await Review.bulkCreate(adjustedReviews);
    console.log(`✅ Seeded ${SEED_PRODUCTS.length} products, ${adjustedVariants.length} variants, ${adjustedReviews.length} reviews`);
  }

  const cCount = await SiteConfig.count();
  if (cCount === 0) {
    await SiteConfig.bulkCreate(SEED_CONFIG);
    console.log(`✅ Seeded ${SEED_CONFIG.length} config entries`);
  }
}

module.exports = { sequelize, Product, SiteConfig, ProductVariant, Review, syncDB };
