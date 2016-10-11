var connect = require('connect')
var _ = require('lodash')
var app = connect()

var routes = {
  GET: {
    'users': function(req, res) {},
    'users/:id': function(req, res) {}
  },
  POST: {
    'users': function(req, res) {},
  },
  PUT: {
    'users/:id': function(req, res) {}
  }
}

app.use(router())
app.listen(9062)


/* -----------------------------
  router
----------------------------- */
function router(config) {
  var methods = _.keys(config)
  var methodRoutes = _.keys(method)

  return function(req, res, next) {
    var currentMethod = config[res.method]
    if (!currentMethod) next()
    _.forEach(currentMethod, applyIfMatched(req.url))
  }
}

function applyIfMatched(url) {
  var decomposedUrl = url.split('/')

  /*TODO: write urlPathComparator */

  if (req.url === path) cb(req, res)

  return function (cb, path) {
    
  }
}