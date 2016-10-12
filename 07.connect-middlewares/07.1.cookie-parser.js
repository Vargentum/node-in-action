var connect = require('connect')
var cookieParser = require('cookie-parser')

var secret = String(Math.random()).slice(0, 20)

var app = connect()
  .use(cookieParser(secret))
  .use(function (req, res, next) {
    console.log(req.cookies, 'req.cookies---------')
    console.log(req.signedCookies, 'req.signedCookies---------')
    res.end("Cookies!")
  })
  .listen(9071)