const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Stores size/color/material/etc. variants per product
// e.g. { product_id:1, variant_type:'Size', variant_value:'M', price_modifier:0, stock:50 }
const ProductVariant = sequelize.define('ProductVariant', {
  id:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id:    { type: DataTypes.INTEGER, allowNull: false },
  variant_type:  { type: DataTypes.STRING(50),  allowNull: false }, // Size | Color | Material | etc.
  variant_value: { type: DataTypes.STRING(100), allowNull: false }, // S | M | L | Red | Cotton etc.
  price_modifier:{ type: DataTypes.DECIMAL(10,2), defaultValue: 0 }, // +/- from base price
  stock:         { type: DataTypes.INTEGER, defaultValue: 0 },
  image_url:     { type: DataTypes.STRING(500), allowNull: true }, // variant-specific image
  sort_order:    { type: DataTypes.INTEGER, defaultValue: 0 },
  is_active:     { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'product_variants', timestamps: true, underscored: true,
     indexes: [{ fields: ['product_id'] }, { fields: ['variant_type'] }] });

module.exports = ProductVariant;
