var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/photo_app')
mongoose.set('debug', true)

var photoSchema = new mongoose.Schema({
  name: String,
  path: String
})
module.exports = mongoose.model('Photo', photoSchema)
