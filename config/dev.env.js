'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"/"',
  API_WS: '"ws://47.112.167.239:8189/websocket/"'
})
