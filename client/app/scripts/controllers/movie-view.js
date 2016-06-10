'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieViewCtrl
 * @description
 * # MovieViewCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
.controller('MovieViewCtrl', function ( $scope, $routeParams, Movie) {

  $scope.viewMovie = true;
  $scope.movie = Movie.one($routeParams.id).get().$object;


  Movie.one($routeParams.id).get().then(function(pelicula) {
    $scope.pelicula = pelicula;
    console.log($scope.pelicula.title);
    var title = $scope.pelicula.title;
    title =  encodeURI(title);

    $.ajax({
           url: "http://www.tastekid.com/api/similar?q="+title+"&k=227278-Pelicula-Q60XAF18&info=1&limit=5",
           data: "", //ur data to be sent to server
           type: "GET",
           dataType: 'jsonp',
           success: function (data) {
              var json = JSON.stringify(data, undefined, '\t');
              console.log(data);
              console.log(data.Similar.Results.length);
              for (var i=0; i<data.Similar.Results.length; i++) {
                  console.log(data.Similar.Results[i].Name);
              }
              //Mostrar los resultados...
           },
           error: function (x, y, z) {
              alert(x.responseText +"  " +x.status);
           }
    });

  });


});
