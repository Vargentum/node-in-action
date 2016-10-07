var connect = require('connect')
var app = connect()

app.use(logger)
   .use(helloWorld)

app.listen(9061)



/* -----------------------------
  Middlewares
----------------------------- */

function logger(req, res, next) {
  console.log(req.url, req.method)
  next()
}

function helloWorld(req, res, next) {
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello world')
}