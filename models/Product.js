const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  sub_category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  emoji: {
    type: DataTypes.STRING(10),
    defaultValue: '📦'
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  images :{
    type: DataTypes.JSON,
    allowNull: true


  },

  // Pricing
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  original_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  discount_percent: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  // Details
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  highlights: {
    // JSON array of bullet points e.g. ["6.8\" AMOLED","200MP Camera"]
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const v = this.getDataValue('highlights');
      try { return v ? JSON.parse(v) : []; } catch { return []; }
    },
    set(val) {
      this.setDataValue('highlights', JSON.stringify(Array.isArray(val) ? val : []));
    }
  },
  specifications: {
    // JSON object e.g. {"Display":"6.8 inch AMOLED","RAM":"12GB"}
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const v = this.getDataValue('specifications');
      try { return v ? JSON.parse(v) : {}; } catch { return {}; }
    },
    set(val) {
      this.setDataValue('specifications', JSON.stringify(val || {}));
    }
  },
  in_box: {
    // JSON array e.g. ["Device","Charger","Cable"]
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const v = this.getDataValue('in_box');
      try { return v ? JSON.parse(v) : []; } catch { return []; }
    },
    set(val) {
      this.setDataValue('in_box', JSON.stringify(Array.isArray(val) ? val : []));
    }
  },

  // Meta
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 4.0
  },
  review_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  badge: {
    type: DataTypes.ENUM('', 'HOT', 'NEW', 'SALE', 'TRENDING'),
    defaultValue: ''
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  weight_grams: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  warranty_months: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  country_of_origin: {
    type: DataTypes.STRING(100),
    defaultValue: 'India'
  },
  seller_name: {
    type: DataTypes.STRING(200),
    defaultValue: 'ShopZone Official'
  },
  tags: {
    // comma-separated search tags
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'products',
  indexes: [
    { fields: ['category'] },
    { fields: ['brand'] },
    { fields: ['is_active'] },
    { fields: ['is_featured'] }
  ]
});

module.exports = Product;
