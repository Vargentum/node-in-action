var connect = require('connect')
var app = connect()

app.use('/admin', provideBasicAuth)
   .use('/admin', showAdminPanel)

app.listen(9062)



/* -----------------------------
  Middlewares
----------------------------- */
function provideBasicAuth (req, res, next) {
  var authorization = req.headers.authorization
  if (!authorization) res.end('Not Authorized!')

  var parts = authorization.split(' ')
  var scheme = parts[0]
  var auth = new Buffer(parts[1], 'base64').toString().split(':')
  var user = auth[0]
  var password = auth[1]

  authenticateWithDatabase(user, password, function(err, result) {
    if (err) next(err)
    next()
  })
}

function showAdminPanel (req, res, next) {
  switch(req.url) {
    case '/': res.end('try /users'); break; 
    case '/users': // not admin/users,  but <mountedPath>/users !!!
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(['jane', 'joe', 'john']))
      break;
  }
}

function authenticateWithDatabase(user, password, cb) {
  if (true) cb(null, {result: 'successfully authenticated'})
  else cb(new Error('no such user'))
}
