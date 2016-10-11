var connect = require('connect')
var url = require('url')
var _ = require('lodash')
var app = connect()

app.use(rewrite)
   .use(showBlogPosts)
   .listen(9064)


function rewrite (req, res, next) {
  var findSlug = /\/blog\/posts\/(.+)/g
  var match = findSlug
  next()
}