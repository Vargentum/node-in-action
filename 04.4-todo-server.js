var http = require('http');
var qs = require('querystring');
var todos = [];


var server = http.createServer(function(req, res) {
  if  (req.url === '/') {
    switch (req.method) {
      case "GET":
        show(res); break;
      case "POST":
        add(req, res); break;
      default: badRequest(res)
    }
  } else {
    notFound(res)
  }
});

server.listen(9044);




function show(res) {
  var html = '<html><head><title>Todo list</title></head><body>'
            +'<h1>Todo List</h1>'
            +'<ul>'
            + todos.map(function(todo) {
                return '<li>'+todo+'</li>'
               }).join('')
            +'</ul>'
            +'<form method="post" action="/">'
            +'<p><input type="text" name="todo" /></p>'
            +'<p><input type="submit" value="Add Item" /></p>'
            +'</form></body></html>'
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html)
}

function add(req, res) {
  var body = '';
  req.setEncoding('utf-8')
  req.on('data', function(chunk) {
    body += chunk
  })
  req.on('end', function () {
    var bodyObject = qs.parse(body)
    todos.push(bodyObject.todo)
    show(res)
  })
}

function badRequest(res) {
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = 500;
  res.end('Bad request')
}

function notFound(res) {
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = 404;
  res.end('Not found')
}
