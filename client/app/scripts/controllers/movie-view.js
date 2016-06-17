'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieViewCtrl
 * @description
 * # MovieViewCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
.controller('MovieViewCtrl', function ( $scope, $routeParams,$location ,Movie, Like, auth) {

  $scope.viewMovie = true;

  //Obtengo la pelicula que tiene el id indicado
  $scope.movie = Movie.one($routeParams.id).get().$object;


    $scope.liked = function() {
      Movie.one($routeParams.id).get().then(function(movie) {
        auth.profilePromise.then(function(profile){

          Like.getList({movie: $routeParams.id, user: profile.user_id}).then(function(like) {
            //Obtengo la tupla que con los datos del usuario y la pelicula
            //Si existe, luego el usuario ya voto, por lo tanto si vuelve a presionar se quita el like
            if(like.length != 0){
              //Debo quitar el like

            }
            else{
              $scope.like={};
              $scope.movie = movie;
              $scope.movie.meGusta+=1;
              $scope.like.user=profile.user_id;
              $scope.like.movie=$routeParams.id;
              $scope.like.vote=1;

              $scope.movie.save();
              Like.post($scope.like).then(function(){
                $location.path('/movie/' + $routeParams.id);
              });
            }
          });
        });
      });
    };

    $scope.disliked = function() {
      Movie.one($routeParams.id).get().then(function(movie,like) {
        $scope.movie = movie;
        $scope.like = like;
        $scope.movie.noMeGusta+=1;
        $scope.like={"user":$routeParams.id,"vote":0};
      // PUT /movie/id/ Save tiene la capacidad de saber si tiene que realizar el put o el post
      $scope.movie.save().then(function() {
        $location.path('/movie/' + $routeParams.id);
        });

      });
    };

});
