var http = require('http')
var parseUrl = require('url').parse
var joinPath = require('path').join
var fs = require('fs')

var root = __dirname

var server = http.createServer(function(req, res) {
  var url = parseUrl(req.url)
  var path = joinPath(root, url.pathname)
  var fileContentStream = fs.createReadStream(path)
  fileContentStream.pipe(res)
})

server.listen(9043)
