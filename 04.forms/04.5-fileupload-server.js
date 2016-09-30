var http = require('http');
var formidable = require('formidable');
var u = require('./utils')


var server = http.createServer(function (req, res) {
  switch (req.method) {
    case "GET": show(req, res); break;
    case "POST": upload(req, res); break;
  }
})

server.listen(9045)

function logArgs(a1, a2) {
  console.log(a1, '---------')
  console.log(a2, '---------')
}

function show(req, res) {
  var html = '<html><head><title>File uploading server</title></head><body>'
            +'<form method="post" action="/" enctype="multipart/form-data">'
            +'<p><input type="file" name="file" /></p>'
            +'<p><input type="submit" value="Upload a file" /></p>'
            +'</form></body></html>'
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html)
}

function upload(req, res) {
  if (!isFormData(req)) 
    u.badRequest()
  var form = new formidable.IncomingForm()
  form.on('field', logArgs)
  form.on('file', logArgs)
  form.on('end', function() {
    res.end('Upload complete')
  })
  form.parse(req)
}

function isFormData(req) {
  var type = req.headers['content-type'] || '';
  return 0 == type.indexOf('multipart/form-data');
}

/*
upload
  
  create IncomingForm
  call form.parse with Req
  listen fo form events
  use formidable API

*/