const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SiteConfig = sequelize.define('SiteConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  config_key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  config_value: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  config_type: {
    // text | image | json | boolean
    type: DataTypes.STRING(20),
    defaultValue: 'text'
  },
  label: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  group_name: {
    // payment | store | appearance
    type: DataTypes.STRING(50),
    defaultValue: 'general'
  }
}, {
  tableName: 'site_config',
  timestamps: true,
  underscored: true
});

// Helper to get a config value by key
SiteConfig.get = async function(key, fallback = null) {
  const row = await SiteConfig.findOne({ where: { config_key: key } });
  return row ? row.config_value : fallback;
};

// Helper to set/upsert a config value
SiteConfig.set = async function(key, value) {
  const [row] = await SiteConfig.findOrCreate({ where: { config_key: key }, defaults: { config_value: value } });
  if (row.config_value !== value) {
    row.config_value = value;
    await row.save();
  }
  return row;
};

// Get all configs as a flat object { key: value }
SiteConfig.getAll = async function() {
  const rows = await SiteConfig.findAll();
  const obj = {};
  rows.forEach(r => { obj[r.config_key] = r.config_value; });
  return obj;
};

module.exports = SiteConfig;
