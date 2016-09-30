var http = require('http');
var todos = [];


http.createServer(function(req, res) {
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

http.listen(9044);




function show(res) {
  var html = '<html><head>Todo list</head><body>'
            +'<h1>Todo List</h1>'
            +'<ul>'
            + items.map(function(item) {
                return '<li>'+item+'</li>'
               }).join('')
            +'</ul>'
            +'<form>'
            +'<p><input type="text" name="item" /></p>'
            +'<p><input type="submit" value="Add Item" /></p>'
            +'</form></body></html>'
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html)
}

function add(req, res) {
  
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
