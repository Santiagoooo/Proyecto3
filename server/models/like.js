var mongoose = require('mongoose');

var LikeSchema = new mongoose.Schema({
  user: {
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
  }
});

module.exports = mongoose.model('like', LikeSchema);
