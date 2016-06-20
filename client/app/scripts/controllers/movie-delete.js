'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieDeleteCtrl
 * @description
 * # MovieDeleteCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
.controller('MovieDeleteCtrl', function ($scope,$routeParams,Movie,Like,$location) {
  $scope.movie = Movie.one($routeParams.id).get().$object;
  // DELETE /movie/id
  $scope.deleteMovie = function() {
    $scope.movie.remove().then(function() {
      Like.getList({movie: $routeParams.id}).then(function(like){
        var i;
        for (i = 0; i < like.length; i++) {
          like[i].remove();
        }
      });
      $location.path('/movies');
    });
  };
  $scope.back = function() {
    $location.path('/movie/' + $routeParams.id);
  };
});
