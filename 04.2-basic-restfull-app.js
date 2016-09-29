var http = require('http')
var url = require('url')
var queryString = require('querystring')
var todos = []

function composeChunksFor (container) {
  return function(chunk) {
    container += chunk
  }
}
function onTodoCreate(req, res) {
  var item = ''
  req.setEncoding('utf-8')
  req.on('data', composeChunksFor(item))
  req.on('end', function() {
    todos.push(item)
    res.end('Posted')
  })
}
function onTodoView(req, res) {
  var body = todos.map(function(item,i), {return i + '. ' + item}).join('\n')
  res.setHeader('Content-Length', Buffer.byteLength(body))
  res.setHeader('Content-Type', 'text/plain; charset="utf-8"')
}
function onTodoDelete(req, res) {
  var path = url.parse(req.url).pathname
  var idx = parseInt(path.slice(1), 10)

  if (isNan(idx)) {
    res.statusCode = 400
    res.end('Invalid item id')
  } else if (!todos[idx]) {
    res.statusCode = 404
    res.end('Item not found')
  } else {
    todos.splice(i, 1)
    tes.end('OK\n')
  }
}

function onTodoUpdate(req, res) {
  var urlObject = url.parse(req.url)
  var idx = parseInt(urlObject.pathname.slice(1), 10)
  var data = urlObject.query

  if (isNan(idx)) {
    res.statusCode = 400
    res.end('Invalid item id')
  } else if (!todos[idx]) {
    res.statusCode = 404
    res.end('Item not found')
  } else {
    todos[i] = data
    tes.end('OK\n')
  }
}


var server = http.createServer(function(req, res) {
  switch (req.method) {
    case "POST":
      onTodoCreate(req, res)
      break;
    case "GET":
      onTodoView(req, res)
      break;
    case "PUT":
      onTodoUpdate(req, res)
    case "DELETE":
      onTodoDelete(req, res)
  }
})

server.listen(9042)