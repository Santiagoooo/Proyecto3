var mongoose = require('mongoose');

var LikeSchema = new mongoose.Schema({
  user: {
    type: Number, //id del usuario
    required: true
  },
  movie: {
    type: Number, //id de la pelicula
    required:true
  },
  vote: {
    type: Number, //0 for dislike, 1 for like
    required:true
  }
});

module.exports = mongoose.model('like', LikeSchema);
