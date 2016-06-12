'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RegisterCtrl', function ($scope, User, $location) {
      $scope.user = {};


      $scope.saveUser = function() {
        User.post($scope.user).then(function() {
          $location.path('/#');
        });
      };

  });
