var http = require('http')
var url = require('url')


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
  console.log(todos.join(' '), '---------')
  res.end(todos.join(' '))
}
function defaultBehavior(req, res) {
  res.end('Hello world')
}


var server = http.createServer(function(req, res) {
  var todos = []
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