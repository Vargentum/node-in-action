var http = require('http')
var url = require('url')
var todos = []

function composeChunksFor (container) {
  return function(chunk) {
    container += chunk
  }
}
function onTodoCreate(req, res, todos) {
  var item = ''
  req.setEncoding('utf-8')
  req.on('data', composeChunksFor(item))
  req.on('end', function() {
    todos.push(item)
    res.end('Posted')
  })
}
function onTodoView(req, res, todos) {
  var body = todos.map(function(item,i), {return i + '. ' + item}).join('\n')
  res.setHeader('Content-Length', Buffer.byteLength(body))
  res.setHeader('Content-Type', 'text/plain; charset="utf-8"')
}
function defaultBehavior(req, res) {
  res.end('Hello world')
}


var server = http.createServer(function(req, res) {
  switch (req.method) {
    case "POST":
      onTodoCreate(req, res, todos)
      break;
    case "GET":
      onTodoView(req, res, todos)
      break;
    default: 
      defaultBehavior(req, res)
  }
})

server.listen(9042)