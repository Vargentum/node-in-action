var connect = require('connect')
var basicAuth = require('basic-auth-connect')


var users = {
  joe: 'foo',
  jane: 'bar',
  jim: 'baz'
}


connect()
  // .use(basicAuth('username', 'password')) // simple usage
  .use(basicAuth(function (user, pass) { //generic usage
    return users[user] === pass
  }))
  .use(helloWorld)
  .listen(9076)




function helloWorld(req, res, next) {
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello world')
}




/* -----------------------------
  CSRF module usage
----------------------------- */
// connect()
//   .use(bodyParser())
//   .use(cookieParser('secret'))
//   .use(session())
//   .use(csrf())