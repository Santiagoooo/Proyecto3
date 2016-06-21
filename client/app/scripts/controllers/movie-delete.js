'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieDeleteCtrl
 * @description
 * # MovieDeleteCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
.controller('MovieDeleteCtrl', function ($scope,$routeParams,Movie, Like,$location) {
  $scope.movie = Movie.one($routeParams.id).get().$object;

  // DELETE /movie/id
  $scope.deleteMovie = function() {
    //Borro la pelicula
    $scope.movie.remove().then(function() {

      //Tambien tengo que borrar los likes/dislikes asociados a esta pelicula
      Like.getList({movie: $routeParams.id}).then(function(like){
        for (var i = 0; i < like.length; i++) {
          like[i].remove();
        }
      });

      var nombre = $scope.movie.title;
      //Tengo que quitar la referencia de la pelicula a eliminar del resto de las peliculas
      Movie.getList().then(function (pelicula) {
          for (var i = 0; i < pelicula.length; i++) {
              var index = pelicula[i].recomendada.indexOf(nombre);
              if(index > -1){
                pelicula[i].recomendada.splice(index,1);
                pelicula[i].idRecomendada.splice(index,1);
              }
              pelicula[i].save();
          }
      });
      //Al terminar redirijo al listado de peliculas.
     $location.path('/movies');
    });
  };

  $scope.back = function() {
    $location.path('/movie/' + $routeParams.id);
  };
});
