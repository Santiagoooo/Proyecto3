'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */


angular.module('clientApp')
  .controller('MainCtrl', function ($scope,$rootScope,$routeParams,Movie,Like,$location) {

      $scope.likes = Like.getList().$object;
      $scope.movie = Movie.one($routeParams.id).get().$object;


   $rootScope.$on("changeScope", function(){
           $scope.likes = Like.getList().$object;
        });



  });
