-- ShopZone Database Setup
-- Run this in MySQL before starting the app (or just create the empty DB —
-- Sequelize will auto-create tables and seed data on first run).

CREATE DATABASE IF NOT EXISTS shopzone_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- That's it! Tables (products, site_config) and seed data
-- are created automatically by Sequelize when you run: npm start
