/*
“The hello component will respond with “Hello World\n.”
The users component will throw a notFoundError when a user doesn’t exist.
The pets component will cause a ReferenceError to be thrown to demonstrate the error handler.
The errorHandler component will handle any errors from the api app.
The errorPage component will handle any errors from the main app app.”

*/
var connect = require('connect')

var api = connect()
  .use(users)
  .use(pets)
  .use(errorHandler)

var app = connect()
  .use(hello)
  .use('/api', api)
  .use(errorPage)
  .listen(9065)


var db = {
  users: [
    { name: 'tobi' },
    { name: 'loki' },
    { name: 'jane' }
  ]
};

/* -----------------------------
  Middlewares
----------------------------- */

function hello (req, res, next) {
  if (req.url.match(/^\/hello/)) {
    res.end('Hello World\n')  
  } else {
    next()
  }
}

function users (req, res, next) {
  var matched = req.url.match(/^\/user\/(.+)/)
  if (matched) {
    var requestedUser = db.users[matched[1]]
    if (requestedUser) {
      res.setHeader('Content-Type', 'application/json')  
      res.end(JSON.stringify(requestedUser))
    } else {
      var error = new Error('User ' + matched[1] + ' is not found')
      error.notFound = true
      next(error)
    }  
  } else {
    next()
  }
}

function pets (req, res, next) {
  if (req.url.match(/^\/pet\/(.+)/)) {
    foo();
  } else {
    next();
  }
}


/* -----------------------------
  Error Middlewares
----------------------------- */
function errorHandler (err, req, res, next) {
  console.log(err.stack)
  res.setHeader('Content-Type', 'application/json')
  if (err.notFound) {
    res.statusCode = 404
    res.end(JSON.stringify({error: err.message}))
  } else {
    res.statusCode = 500
    res.end(JSON.stringify({error: 'Internal server error'}))
  }
}

function errorPage (req, res, next) {
  res.setHeader('Content-Type', 'text/html')
  res.end('<html><head></head><body><h1>Error</h1></body></html>')
  next()
}