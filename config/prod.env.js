'use strict'
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), './.env.production') });
const merge = require('webpack-merge')
module.exports = {
  NODE_ENV: '"production"',
  API_HOST: '"'+process.env.APIHOST+'"',
  CMS_HOST: '"'+process.env.CMS_HOST+'"',
}
