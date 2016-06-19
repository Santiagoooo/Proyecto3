var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
// Create the MovieSchema.
var MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: false
  },
  anio: {
    type: String,
    required: true
  },
  director: [{
    type: String,
    required: true
  }],
  actores: [{
    type: String,
    required: true
  }],
  sinopsis: {
    type: String,
    required: true
  },
  duracion: {
    type: String,
    required: true
  },
  wikipedia: {
    type: String,
    required: false
  },
  recomendada: [{
    type: String,
    required: false
  }],
  idRecomendada: [{
    type: Schema.Types.ObjectId,
    required: false
  }],
  meGusta: {
    type: Number,
    required: true
  },
  noMeGusta: {
    type: Number,
    required: true
  },
  palabrasClave: [{
    type: String,
    required: true
  }]
});

// Export the model.
module.exports = mongoose.model('movie', MovieSchema);
