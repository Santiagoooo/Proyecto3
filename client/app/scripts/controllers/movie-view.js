'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieViewCtrl
 * @description
 * # MovieViewCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
.controller('MovieViewCtrl', function ( $scope,$rootScope ,$routeParams,$location ,Movie, Like, auth) {

  $scope.viewMovie = true;
  var botonNoMeGusta = document.getElementById('botonNoMeGusta');
  var botonMeGusta = document.getElementById('botonMeGusta');

  auth.profilePromise.then(function(profile){
    Like.getList({movie: $routeParams.id, userid: profile.user_id, vote: 0}).then(function(like){
      if(like.length == 1){
        botonMeGusta.style.opacity = "0.5";
      }
    });
    Like.getList({movie: $routeParams.id, userid: profile.user_id, vote: 1}).then(function(like){
      if(like.length == 1){
        botonNoMeGusta.style.opacity = "0.5";
      }
    });
  });



  //Obtengo la pelicula que tiene el id indicado
  $scope.movie = Movie.one($routeParams.id).get().$object;


    $scope.liked = function() {

      var botonNoMeGusta = document.getElementById('botonNoMeGusta');
      Movie.one($routeParams.id).get().then(function(movie) {
        auth.profilePromise.then(function(profile){

          Like.getList({movie: $routeParams.id, userid: profile.user_id, vote: 0}).then(function(like){
            if(like.length == 0){
              //No fue realizado el dislike, luego se puede realizar un like
              Like.getList({movie: $routeParams.id, userid: profile.user_id}).then(function(like) {
                //Obtengo la tupla que con los datos del usuario y la pelicula
                //Si existe, luego el usuario ya voto, por lo tanto si vuelve a presionar se quita el like

                if(like.length == 1){

                  //Debo quitar el like
                  $scope.movie = movie;
                  $scope.movie.meGusta-=1;
                  $scope.movie.save();
                  botonNoMeGusta.style.opacity = "1";


                  like[0].remove().then(function(){
                    $location.path('/movie/' + $routeParams.id);
                  });
                }
                else{
                  if(like.length == 0){
                    $scope.like={};
                    $scope.movie = movie;
                    $scope.movie.meGusta+=1;
                    $scope.like.userid=profile.user_id;
                    $scope.like.movie=$routeParams.id;
                    $scope.like.vote=1;
                    $scope.like.username=profile.name;
                    $scope.like.time=new Date();
                    $scope.like.userimage = profile.picture;
                    $scope.like.movietitle = movie.title;

                    $scope.movie.save();
                    botonNoMeGusta.style.opacity = "0.5";

                    Like.post($scope.like).then(function(){
                      $location.path('/movie/' + $routeParams.id);
                    });
                  }
                }
                $rootScope.$emit("changeScope", {});
              });
            }
          });
        });
      });

    };

    $scope.disliked = function() {

      var botonMeGusta = document.getElementById('botonMeGusta');
      Movie.one($routeParams.id).get().then(function(movie) {
        auth.profilePromise.then(function(profile){

          Like.getList({movie: $routeParams.id, userid: profile.user_id, vote: 1}).then(function(like){
            if(like.length == 0){
              //No fue realizado el like, luego se puede realizar un dislike
              Like.getList({movie: $routeParams.id, userid: profile.user_id}).then(function(like) {
                //Obtengo la tupla que con los datos del usuario y la pelicula
                //Si existe, luego el usuario ya voto, por lo tanto si vuelve a presionar se quita el dislike

                if(like.length == 1){

                  //Debo quitar el dislike
                  $scope.movie = movie;
                  $scope.movie.noMeGusta-=1;
                  $scope.movie.save();
                  botonMeGusta.style.opacity = "1";


                  like[0].remove().then(function(){
                    $location.path('/movie/' + $routeParams.id);
                  });
                }
                else{
                  if(like.length == 0){
                    $scope.like={};
                    $scope.movie = movie;
                    $scope.movie.noMeGusta+=1;
                    $scope.like.userid=profile.user_id;
                    $scope.like.movie=$routeParams.id;
                    $scope.like.vote=0;
                    $scope.like.username=profile.name;
                    $scope.like.time=new Date().toISOString();
                    $scope.like.userimage = profile.picture;
                    $scope.like.movietitle = movie.title;

                    $scope.movie.save();
                    botonMeGusta.style.opacity = "0.5";

                    Like.post($scope.like).then(function(){
                      $location.path('/movie/' + $routeParams.id);
                    });
                  }
                }
                $rootScope.$emit("changeScope", {});
              });
            }
          });
        });
      });

    };

  });
