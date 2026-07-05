const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Reviews — admin adds them, shown on product pages
const Review = sequelize.define('Review', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id:   { type: DataTypes.INTEGER, allowNull: true  }, // null = show on ALL products
  reviewer_name:{ type: DataTypes.STRING(100), allowNull: false },
  reviewer_city:{ type: DataTypes.STRING(100), allowNull: true },
  rating:       { type: DataTypes.INTEGER, defaultValue: 5, validate: { min:1, max:5 } },
  title:        { type: DataTypes.STRING(300), allowNull: true },
  body:         { type: DataTypes.TEXT, allowNull: false },
  verified:     { type: DataTypes.BOOLEAN, defaultValue: true }, // "Verified Purchase" badge
  helpful_count:{ type: DataTypes.INTEGER, defaultValue: 0 },
  review_date:  { type: DataTypes.DATEONLY, allowNull: true },
  is_active:    { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'reviews', timestamps: true, underscored: true,
     indexes: [{ fields: ['product_id'] }, { fields: ['rating'] }] });

module.exports = Review;
