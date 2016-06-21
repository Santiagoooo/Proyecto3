'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */


angular.module('clientApp')
  .controller('MainCtrl', function ($scope,$rootScope,$routeParams,Movie,Like,$location,$timeout) {


      //$scope.movie = Movie.one($routeParams.id).get().$object;

      function refreshList()  {
        Like.getList({limit:100}).then(function (like) {
          console.log(like);
          var fin = like.length;
          //Quiero mostrar las ultimas 7 calificaciones.
          if(like.length>7){
          $scope.likes = like.slice(like.length - 7,like.length);
          }
          else{
            $scope.likes=like;
          }
          console.log($scope.likes);
          $timeout(function () {
            refreshList();
          }, 3000);
        });
      }

      refreshList();
  });
