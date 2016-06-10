'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MoviesCtrl
 * @description
 * # MoviesCtrl
 * Controller of the clientApp
 */
 angular.module('clientApp')
 .controller('MoviesCtrl', function ($scope, Movie) {

   $scope.sortType = 'title'; // set the default sort type
   $scope.sortReverse  = false;  // set the default sort order
   $scope.searchFish   = '';     // set the default search/filter term

   $scope.movies = Movie.getList().$object;
 });
