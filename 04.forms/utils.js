
exports.badRequest = function badRequest(res) {
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = 400;
  res.end('Bad request')
}

exports.notFound = function notFound(res) {
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = 404;
  res.end('Not found')
}
