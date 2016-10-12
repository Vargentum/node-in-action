var connect = require('connect')
var bodyParser = require('body-parser')
var multiparty = require('connect-multiparty')

//echo server

var app = connect()
  .use(bodyParser())
  .use(bodyParser.json({
    limit: '32kb'
  }))
  // .use(multiparty())
  .use(function (req, res, next) {
    console.log(req.body, 'req.body---------')
    console.log(req.files, 'req.files---------')
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(req.body))
  })
  .listen(9072)