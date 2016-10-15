var express = require('express');
var PhotoModel = require('../models/photo') 
var fs = require('fs')
var path = require('path')


exports.list = function (req, res, next) {
  PhotoModel.find(function(err, photos) {
    if (err) next(err)
    res.render('photos', {
      title: "Photos",
      photos: photos
    })
  })
}


exports.form = function(req, res) {
  res.render('photos/upload', {
    title: 'Photo uploads'
  })
}



/* -----------------------------
  submit
  (dir) => (res, req) =>
 
  access image file as req.files.photo
  access name as req.body.photo
  get Abs image path

  perform `fs.rename` to place images into new Dir

  after renaming => use Model#create to add new data to DB
  make redirect to root page

  also perform possible errors

----------------------------- */
exports.submit = function(dir) {
  return function(req, res, next) {
    var img = req.files.photo.image //access to uploaded to system folder image object
    //compose new name and new path to store at project public folder
    var ext = img.name.split('.')[img.name.split('.').length - 1]
    var imgName = req.body.photo.name ? req.body.photo.name + "." + ext : img.name
    var newPath = path.join(dir, imgName)

    fs.rename(img.path, newPath, function(err) {
      if (err) next(err)
      PhotoModel.create({
        name: imgName.split('.')[0],
        path: imgName
      }, function(err) {
        if (err) next(err)
        res.redirect('/')
      })

    })
  }
}



