'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieAddCtrl
 * @description
 * # MovieAddCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MovieAddCtrl', function ($scope, Movie, $location) {
    $scope.movie = {};

    var typingTimer;                //timer identifier
    var doneTypingInterval = 1000;  //time in ms, 5 second for example
    var $titulo = $('#titulo');
    var $anio = $('#año');
    var $director = $('#director');
    var $actores = $('#actores');
    var $sinopsis = $('#sinopsis');
    var $duracion = $('#duracion');
    var $url = $('#url');
    var $wikipedia = $('#wikipedia');



    //on keyup, start the countdown
    $titulo.on('keyup', function () {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    //on keydown, clear the countdown
    $titulo.on('keydown', function () {
      clearTimeout(typingTimer);
    });

    //user is "finished typing," do something
    function doneTyping () {

      //hago la llamada para completar los campos
      var title = $scope.movie.title;
      $.ajax({
             url: "http://www.omdbapi.com/?t="+title+"&y=&plot=short&r=json",
             data: "", //ur data to be sent to server
             type: "GET",
             success: function (data) {
                //var json = JSON.stringify(data, undefined, '\t');

                //Cargo los campos con la info obtenida
                $anio.val(data.Year);
                $scope.movie.anio = data.Year;

                $director.val(data.Director);
                $scope.movie.director = data.Director;

                $actores.val(data.Actors);
                $scope.movie.actores = data.Actors;

                $duracion.val(data.Runtime);
                $scope.movie.duracion = data.Runtime;


             },
             error: function (x, y, z) {
                alert(x.responseText +"  " +x.status);
             }
      });
      //Hago la llamada para completar los campos faltantes.
      title =  encodeURI(title);
      $.ajax({
             url: "http://www.tastekid.com/api/similar?q="+title+"&k=227278-Pelicula-Q60XAF18&info=1&limit=5",
             data: "", //ur data to be sent to server
             type: "GET",
             dataType: 'jsonp',
             success: function (data) {

                console.log(data);

                $sinopsis.val(data.Similar.Info[0].wTeaser);
                $scope.movie.sinopsis = data.Similar.Info[0].wTeaser;

                $url.val(data.Similar.Info[0].yUrl);
                $scope.movie.url = data.Similar.Info[0].yUrl;

                $wikipedia.val(data.Similar.Info[0].wUrl);
                $scope.movie.wikipedia = data.Similar.Info[0].wUrl;

                  //Peliculas recomendadas.
              //  for (var i=0; i<data.Similar.Results.length; i++) {
                    // Esto deberia guardar las 5 peliculas relacionadas en un array pero no se bien como hacerlo.
                    //Por ahora solo guarda una pelicula como recomendada.
                    $scope.movie.recomendada = data.Similar.Results[0].Name;
                //}
             },
             error: function (x, y, z) {
                alert(x.responseText +"  " +x.status);
             }
      });

      //Seteo el megusta y nomegusta en 0
      $scope.movie.meGusta = 0;
      $scope.movie.noMeGusta = 0;
    }


    $scope.saveMovie = function() {
      Movie.post($scope.movie).then(function() {
        $location.path('/movies');
      });
    };
  });
