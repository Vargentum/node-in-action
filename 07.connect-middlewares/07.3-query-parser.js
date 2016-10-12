var connect = require('connect')
var queryParser = require('connect-query')

//echo server

var app = connect()
  .use(queryParser())
  .use(function (req, res, next) {
    console.log(req.query, 'req.query---------')
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(req.query))
  })
  .listen(9073)