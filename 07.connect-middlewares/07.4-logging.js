var connect = require('connect')
var logger = require('connect-logger')
var morgan = require('morgan')
var fs = require('fs')

var logStream = fs.createWriteStream('./log.txt')


connect()
  .use(morgan('dev', {
    stream: logStream
  }))
  // .use(logger())
  .use(helloWorld)
  .listen(9074)



/* -----------------------------
  Custom M 
----------------------------- */

function helloWorld(req, res, next) {
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello world')
}