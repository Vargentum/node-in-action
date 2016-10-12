var connect = require('connect')
var errorHandler = require('errorhandler')
var morgan = require('morgan')


connect()
  .use(morgan('dev'))
  .use(genErrorMiddleware)
  .use(errorHandler())
  .listen(9077)


function genErrorMiddleware (req, res, next) {
  next(new Error('some error'))
}