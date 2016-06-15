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

   $scope.sortType = 'title';    // Por defecto ordeno por titulo
   $scope.sortReverse  = false;  // Por defecto se utiliza el orden normal
   $scope.searchTerm   = '';     // Por defecto no hay un termino para buscar

   //Obtengo todas las peliculas
   $scope.movies = Movie.getList({limit:1000000}).$object;
   console.log("Peliculas todas");
   console.log($scope.movies);
   console.log(Movie.getList());
   console.log(Movie);
 });
