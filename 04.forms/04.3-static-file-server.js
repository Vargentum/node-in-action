var http = require('http')
var parseUrl = require('url').parse
var joinPath = require('path').join
var fs = require('fs')

var root = __dirname

function flush500Error(res) {
  return function() {
    res.statusCode = 500
    res.end('Internal Server Error')
  }
}

var server = http.createServer(function(req, res) {
  var url = parseUrl(req.url)
  var path = joinPath(root, url.pathname)
  var flush500e = flush500Error(res)
  
  fs.stat(path, function(err, stat) {
    if (err) {
      if (err.name === 'ENOENT') {
        res.statusCode = 404
        res.end('File not found')
      } else {
        flush500e()
      }
    } else {
      res.setHeader('Content-Length', stat.size)
      var fileContentStream = fs.createReadStream(path)
      fileContentStream.on('error', flush500e)
      fileContentStream.pipe(res)
    }
  })
})

server.listen(9043)
