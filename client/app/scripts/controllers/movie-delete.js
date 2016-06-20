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
      //Al terminar redirijo al listado de peliculas.
      $location.path('/movies');
    });
  };

  $scope.back = function() {
    $location.path('/movie/' + $routeParams.id);
  };
});
