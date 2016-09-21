var http = require('http')
var fs = require('fs')
var path = require('path')
var mime = require('mime')

var cache = {}

function error404(res) {
  res.writeHead(404, {'Content-Type': 'text/plain'})
  res.write("Error 404. Page wasn't found.")
  res.end()
}

function sendFile(res, filePath, fileContents) {
  res.writeHead(200,{'Content-Type': mime.lookup(path.basename(filePath))})
  res.end(fileContents)
}


/*
staticServer

interface: (response, cache, absPath)

if file in cache -> sendFile from cache
else check file existence -> (with fs)
  if exist -> read from file (with fs)
    if error -> send404
    else write to cache, sendFile
  else -> send404

*/

function serveStatic(res, cache, absPath) {
  if (cache[absPath]) {
    sendFile(res, absPath, cache[absPath])
  } else {
    fs.stat(absPath, function(err, stats) {
      if (err) throw err
      if (stats.isFile()) {
        fs.readFile(absPath, function(err, data) {
          if (err) error404(res)
          else {
            cache[absPath] = data
            sendFile(res, absPath, data)
          }
        })
      } else {
        error404(res)
      }
    })
  }
}


/*
httpServer:

create server (http module)

if / -> set filepath to index.html
else set from public

use serveStatic to request a file
*/
var server = http.createServer(function(req, res) {
  var filePath = null
  if (req.url === '/') {
    filePath = 'public/index.html'  // served by default
  } else {
    filePath = 'public' + req.url  // relative path!
  }
  var absPath = './' + filePath
  serveStatic(res, cache, absPath)
})

server.listen(9065, function() {
  console.log('Server listening at port 9065')
})


// add socket.io server
var listen = require('./lib/chat_server');
listen(server);