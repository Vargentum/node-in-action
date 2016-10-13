var connect = require('connect')
var serveStatic = require('serve-static')
var compression = require('compression')
var serveIndex = require('serve-index')


connect()
  .use(compression())
  .use(serveIndex('public'))
  .use(serveStatic('public'))
  .listen(9078)
