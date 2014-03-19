module.exports = {
  port: process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000,
  ip: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
  db_config: process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://127.0.0.1:27017/',
  collection_name: process.env.DB_MAP_TABLE_NAME || process.env.OPENSHIFT_APP_NAME || 'locations'
}
