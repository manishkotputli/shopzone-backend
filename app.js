require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const { SiteConfig } = require('./models');

app.use(async (req, res, next) => {
    try {
        const rows = await SiteConfig.findAll();

        const CFG = {};

        rows.forEach(row => {
            CFG[row.config_key] = row.config_value;
        });

        // Sabhi EJS pages ke liye automatic
        app.locals.CFG = CFG;

        next();

    } catch (err) {
        console.error(err);
        app.locals.CFG = {};
        next();
    }
});
// const { sequelize, syncDB } = require('./models');
const { sequelize, syncDB, Product } = require('./models');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// ── Website Page Routes ───────────────────────────────────────────────────────
// app.get('/',             (req, res) => res.render('pages/index'));
// app.get('/category',     (req, res) => res.render('pages/category', { cat: req.query.cat || 'Electronics' }));
// app.get('/product',      (req, res) => res.render('pages/product'));
app.get('/', (req, res) => {
    res.redirect('/product?id=1');
});

app.get('/category', (req, res) => {
    res.redirect('/product?id=1');
});
app.get('/product', async (req, res) => {

    const id = parseInt(req.query.id);

    if (!id || isNaN(id))
        return res.redirect('/product?id=1');

    const product = await Product.findByPk(id);

    if (!product)
        return res.redirect('/product?id=1');

    res.render('pages/product', {
        productId: id
    });

});
app.get('/cart',         (req, res) => res.render('pages/cart'));
app.get('/checkout',     (req, res) => res.render('pages/checkout'));
app.get('/login',        (req, res) => res.render('pages/login'));
app.get('/register',     (req, res) => res.render('pages/register'));
app.get('/account',      (req, res) => res.render('pages/account'));
app.get('/orders',       (req, res) => res.render('pages/orders'));
app.get('/wishlist',     (req, res) => res.render('pages/wishlist'));
app.get('/search',       (req, res) => res.render('pages/search', { q: req.query.q || '' }));
app.get('/deals',        (req, res) => res.render('pages/deals'));
app.get('/about',        (req, res) => res.render('pages/about'));
app.get('/contact',      (req, res) => res.render('pages/contact'));
app.get('/order-success',(req, res) => res.render('pages/order-success'));



// ── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).send('Page not found'));

// ── Start Server (after DB sync) ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connection established');
    await syncDB();
    app.listen(PORT, () => {
      console.log(`\n🚀 ShopZone running → http://localhost:${PORT}`);
      console.log(`🔐 Admin Panel      → http://localhost:${PORT}/admin`);
      console.log(`   Login: ${process.env.ADMIN_USER || 'admin'} / ${process.env.ADMIN_PASS || 'shopzone123'}\n`);
    });
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err.message);
    console.error('\n👉 Check your .env file — DB_HOST, DB_NAME, DB_USER, DB_PASS');
    console.error('👉 Make sure MySQL server is running and the database exists.');
    console.error('   You can create it with: CREATE DATABASE shopzone_db;\n');
    process.exit(1);
  }
}

start();
