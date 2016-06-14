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

    $(document).ready(function() {

    var $input = document.getElementById('searchBox');
    var baseUrl = "http://sg.media-imdb.com/suggests/";
    var $result = document.getElementById('result');
    var body = document.getElementsByTagName('body');

    $input.addEventListener('keyup', function(){

    	//clearing blank spaces from input
    	var cleanInput = $input.value.replace(/\s/g, "");

    	//clearing result div if the input box in empty
    	if(cleanInput.length === 0) {
    		$result.innerHTML = "";
    	}

    	if(cleanInput.length > 0) {

    		var queryUrl = baseUrl + cleanInput[0].toLowerCase() + "/"
    					  + cleanInput.toLowerCase()
    					  + ".json";
    		$.ajax({

    		    url: queryUrl,
    		    dataType: 'jsonp',
    		    cache: true,
    		    jsonp: false,
    		    jsonpCallback: "imdb$" + cleanInput.toLowerCase()

    		}).done(function (result) {

    	    	//clearing result div if there is a valid response
    	    	if(result.d.length > 0) {
    	    		$result.innerHTML = "";
    	    	}

    		    for(var i = 0; i < result.d.length; i++) {

    		    	var category = result.d[i].id.slice(0,2);

    		    	if(category === "tt") {
    		    		//row for risplaying one result
    		    		var resultRow = document.createElement('a');
    		    		resultRow.setAttribute('class', 'resultRow');
    		    		var destinationUrl;

    		    		if(category === "tt") {
    		    			destinationUrl = "http://www.imdb.com/title/" + result.d[i].id;
                  resultRow.id =  result.d[i].id;
                  resultRow.setAttribute('nombrePelicula', result.d[i].l);
    		    		}

    		    		//resultRow.setAttribute('href', "destinationUrl");
    		    		resultRow.setAttribute('target', '_blank');
                resultRow.onclick = function(e) {

                  //Puede hacerse el click en lo que seria la descripcion o fuera de ella.
                  if (e.target.id == ""){
                    //puede no funcionar en todos los browser
                    var par = $(event.target).parent();
                    par = par.parent()[0];
                    console.log(par);
                    doneTyping(par.getAttribute("id"), par.getAttribute("nombrePelicula"));
                  }
                  else{
                    doneTyping(e.target.id, e.target.nombrePelicula)
                  }
                };

    		    		//creating and setting poster
    		    		var poster = document.createElement('img');
    		    		poster.setAttribute('class', 'poster');

    		    		if(result.d[i].i) {
    			    		var imdbPoster = result.d[i].i[0];
    			    		imdbPoster = imdbPoster.replace("._V1_.jpg", "._V1._SX40_CR0,0,40,54_.jpg");
    			    		var posterUrl =
    			    			"http://i.embed.ly/1/display/resize?key=798c38fecaca11e0ba1a4040d3dc5c07&url="
    			    			+ imdbPoster
    			    			+ "&height=54&width=40&errorurl=http%3A%2F%2Flalwanivikas.github.io%2Fimdb-autocomplete%2Fimg%2Fnoimage.png&grow=true"
    			    		poster.setAttribute('src', posterUrl);
    		    		}

    		    		//creating and setting description
    		    		var description = document.createElement('div');
    		    		description.setAttribute('class', 'description');

    		    		var name = document.createElement('h4');
    		    		var snippet = document.createElement('h5');

    		    		if(category === "tt" && result.d[i].y) {
    		    			name.innerHTML = result.d[i].l + " (" + result.d[i].y + ")";
    		    		}
    		    		snippet.innerHTML = result.d[i].s;

    		    		$(description).append(name);
    		    		$(description).append(snippet);

    		    		$(resultRow).append(poster);
    		    		$(resultRow).append(description);
    		    		$("#result").append(resultRow);
    		    	}
    		    }

    		});
    	}
    });
    });






    $scope.movie = {};

    var typingTimer;                //timer identifier
    var doneTypingInterval = 1000;  //time in ms, 5 second for example
    var $titulo = $('#searchBox');
    var $anio = $('#año');
    var $director = $('#director');
    var $actores = $('#actores');
    var $sinopsis = $('#sinopsis');
    var $duracion = $('#duracion');
    var $url = $('#url');
    var $wikipedia = $('#wikipedia');





    //user is "finished typing," do something
    function doneTyping (id, nombrePelicula) {

      //hago la llamada para completar los campos
      var title = id;
      console.log(nombrePelicula);
      $.ajax({
             url: "http://www.omdbapi.com/?i="+title+"&y=&plot=short&r=json",
             data: "", //ur data to be sent to server
             type: "GET",
             success: function (data) {
                //var json = JSON.stringify(data, undefined, '\t');
                //Cargo los campos con la info obtenida
                console.log(data);

                $scope.movie.sinopsis = data.Plot;

                $titulo.val(data.Title);
                $scope.movie.title = data.Title;

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
      title =  encodeURI(nombrePelicula);
      var uuu = "http://www.tastekid.com/api/similar?q="+title+"&k=227278-Pelicula-Q60XAF18&info=1&limit=5"
      console.log(uuu);
      $.ajax({
             url: "http://www.tastekid.com/api/similar?q="+title+"&k=227278-Pelicula-Q60XAF18&info=1&limit=5",
             data: "", //ur data to be sent to server
             type: "GET",
             dataType: 'jsonp',
             success: function (data) {

                console.log(data);
                console.log(data.Similar.Info[0].wTeaser);

                if(data.Similar.Info[0].wTeaser !== undefined){
                  $sinopsis.val(data.Similar.Info[0].wTeaser);
                  $scope.movie.sinopsis = data.Similar.Info[0].wTeaser;
                }
                else{
                  $sinopsis.val($scope.movie.sinopsis);
                }

                $url.val(data.Similar.Info[0].yUrl);
                $scope.movie.url = data.Similar.Info[0].yUrl;

                $wikipedia.val(data.Similar.Info[0].wUrl);
                $scope.movie.wikipedia = data.Similar.Info[0].wUrl;

                  //Peliculas recomendadas.
              //  for (var i=0; i<data.Similar.Results.length; i++) {
                    // Esto deberia guardar las 5 peliculas relacionadas en un array pero no se bien como hacerlo.
                    //Por ahora solo guarda una pelicula como recomendada.
                if(data.Similar.Results.length > 0){
                 $scope.movie.recomendada = data.Similar.Results[0].Name;
                }
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
