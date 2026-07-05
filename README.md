# ShopZone — E-Commerce Platform (Phase 1)

Amazon-style e-commerce site with **MySQL + Sequelize** backend.

## 🆕 What's New in This Version
- ✅ **Products stored in MySQL** (not localStorage) — full Amazon-style detail page (highlights, specifications table, in-the-box, brand, SKU, warranty, etc.)
- ✅ **Admin Panel — Product CRUD** fully wired to the database (Add / Edit / Delete / List), with image upload, dynamic specs/highlights/in-box fields, category & brand autocomplete
- ✅ **Site Configuration in MySQL** — Admin can set/update:
  - UPI IDs (Primary, PhonePe, GPay, Paytm)
  - Payment QR code image (upload your own, or one auto-generates from your UPI ID)
  - Bank account details (for internal records)
  - Store settings (name, tagline, support contact, GST %, free delivery threshold)
- ✅ Checkout page pulls live QR code + UPI IDs from the database — no hardcoded payment info
- ✅ **No third-party payment gateway** — payment is "simulated verified" once customer scans QR / enters UPI ID and clicks pay (matches your requirement: only UPI/QR collection, no Razorpay/Stripe/etc.)
- ✅ Hindi/English toggle, OTP sign-in (sessionStorage, no permanent user data), pincode auto-fetch — all carried over from Phase 1

## Tech Stack
- Node.js + Express + EJS
- **MySQL** (via Sequelize ORM)
- Vanilla JS frontend (fetch API, no frontend framework)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create the MySQL database
```sql
CREATE DATABASE shopzone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
(See `SETUP.sql`)

### 3. Configure environment
Copy `.env.example` to `.env` and fill in your MySQL credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=shopzone_db
DB_USER=root
DB_PASS=your_mysql_password
ADMIN_USER=admin
ADMIN_PASS=shopzone123
```

### 4. Run
```bash
npm start
```
Sequelize will auto-create tables (`products`, `site_config`) and seed 8 sample products + default config on first run.

Visit:
- Website → http://localhost:3000
- Admin Panel → http://localhost:3000/admin (login: `admin` / `shopzone123`)

## Admin Panel — What You Can Manage
| Tab | What it controls |
|---|---|
| **Product List** | View/search/filter all products, edit or delete |
| **Add Product** | Full Amazon-style product form: name, brand, category, price, discount, stock, rating, image upload, highlights, specifications table, in-the-box items, warranty, SKU, tags |
| **Payment Settings** | UPI IDs for each app + upload payment QR code image |
| **Bank Details** | Bank account info (internal use, not shown to customers) |
| **Store Settings** | Store name, tagline, support contact, GST %, free delivery rules |

## Payment Flow (No Gateway)
1. Customer adds items → goes to checkout
2. Sees QR code + UPI IDs **pulled live from your admin settings**
3. Scans QR or taps a UPI app button (Google Pay / PhonePe / Paytm / BHIM)
4. App simulates "payment verification" (since there's no real gateway integration) and places the order
5. No transaction records, card data, or payment gateway credentials are stored — exactly as scoped

## Data Storage Summary
| Data | Where |
|---|---|
| Products | MySQL (`products` table) |
| Site config (UPI/QR/Bank/Store) | MySQL (`site_config` table) |
| User OTP/login session | Browser `sessionStorage` (cleared on tab close) |
| Cart | Browser `localStorage` (cleared after order) |
| Delivery address | Not persisted — entered fresh at each checkout |
| Order history / transactions | **Not stored anywhere** (out of scope, as required) |

## Folder Structure
```
shopzone/
├── app.js                  # Express app entry
├── config/database.js      # Sequelize MySQL connection
├── models/                 # Product, SiteConfig (+ seed data)
├── routes/
│   ├── api.js               # Public API (products, config) for storefront
│   └── admin.js              # Admin API (CRUD + auth)
├── middleware/
│   ├── auth.js                # Admin session cookie check
│   └── upload.js               # Multer image upload handling
├── views/
│   ├── pages/                # Customer-facing pages
│   └── admin/                 # Admin login + panel
└── public/
    ├── css/style.css
    ├── js/                    # lang.js, auth.js, products.js (API client)
    └── uploads/                # product images & QR codes land here
```
