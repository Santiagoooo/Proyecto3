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
      

      $scope.movie = Movie.one($routeParams.id).get().$object;

      function refreshList()  {
        Like.getList({limit:7}).then(function (like) {
          console.log(like);
          $scope.likes = like;
          $timeout(function () {
            refreshList();
          }, 3000);
        });
      }

      refreshList();
  });
