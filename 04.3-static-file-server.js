var http = require('http')
var parseUrl = require('url').parse
var joinPath = require('path').join
var fs = require('fs')

var root = __dirname

var server = http.createServer(function(req, res) {
  var url = parseUrl(req.url)
  var path = joinPath(root, url.pathname)
  var stream = fs.createReadStream(path)
  stream.on('data', function(chunk) {
    res.write(chunk)
  })
  stream.on('end', function() {
    res.end()
  })
})

server.listen(9043)