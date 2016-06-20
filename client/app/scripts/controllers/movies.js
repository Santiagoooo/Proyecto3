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
  })

 .filter('customFilter', function() {
   return function(input, aBuscar, categoria) {

     var output = [];

     // Verifico si se selecciono alguna categoria, de lo contrario el default es buscar por titulo
     var categoria = categoria || 'title';
     // Verifico si se escribio algo en el campo de busqueda, de lo contrario el default es ''
     var aBuscar = aBuscar || '';
     if(aBuscar == ''){
       // No hay que realizar ningun filro
       output = input;
     }
     else{
       // El campo de busqueda no esta vacio, luego hay que filtrar
       angular.forEach(input, function(pelicula) {
         switch (categoria) {
                        case "director":
                            for (var i = 0; i < pelicula.director.length; i++) {
                                if (pelicula.director[i].startsWith(aBuscar)) {
                                    output.push(pelicula);
                                    //Ya agregue la pelicula entonces corto
                                    break;
                                }
                            }
                            break;
                        case "actor":
                            for (var i = 0; i < pelicula.actores.length; i++) {
                                if (pelicula.actores[i].startsWith(aBuscar)) {
                                    output.push(pelicula);
                                    //Ya agregue la pelicula entonces corto
                                    break;
                                }
                            }
                            break;
                        case "genero":
                            for (var i = 0; i < pelicula.palabrasClave.length; i++) {
                                if (pelicula.palabrasClave[i].startsWith(aBuscar)) {
                                    output.push(pelicula);
                                    //Ya agregue la pelicula entonces corto
                                    break;
                                }
                            }
                            break;
                        default:
                            if (pelicula[categoria].startsWith(aBuscar)) {
                                output.push(pelicula)
                            }
          }
        });
      }
      return output;
    }
 });
