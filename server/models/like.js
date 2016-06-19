var mongoose = require('mongoose');

var LikeSchema = new mongoose.Schema({
  userid: {
    type: String, //id del usuario
    required: true
  },
  movie: {
    type: String, //id de la pelicula
    required:true
  },
  vote: {
    type: String, //0 for dislike, 1 for like
    required:true
  },
  time: {
    type: Date,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  userimage: {
    type: String,
    required:false
  },
  movietitle: {
    type: String,
    required: true
  }

});

module.exports = mongoose.model('like', LikeSchema);
