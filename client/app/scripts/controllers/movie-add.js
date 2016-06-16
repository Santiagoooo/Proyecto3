'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieAddCtrl
 * @description
 * # MovieAddCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MovieAddCtrl', function ($scope, Movie, $location, flash) {

    $(document).ready(function() {

    //Campo donde se escribe el titulo de la pelicula
    var $input = document.getElementById('searchBox');
    var baseUrl = "http://sg.media-imdb.com/suggests/";
    //Div donde se muestran las sugerencias
    var $result = document.getElementById('result');
    var body = document.getElementsByTagName('body');


    $input.addEventListener('keyup', function(){

    	//Elimina los espacios
    	var cleanInput = $input.value.replace(/\s/g, "");

    	//Limpia el div result si el campo input esta vacio
    	if(cleanInput.length === 0) {
    		$result.innerHTML = "";
    	}

      //Input tiene contenido
    	if(cleanInput.length > 0) {

        //Forma la url y realiza la llamada
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

    	    	//Limpia el div result si se trata de una respuesta valida
    	    	if(result.d.length > 0) {
    	    		$result.innerHTML = "";
    	    	}

            //Creacion de la fila correspondiente para cada sugerencia
    		    for(var i = 0; i < result.d.length; i++) {

              //Obtengo la categoria
    		    	var category = result.d[i].id.slice(0,2);

              //Considero solo aquellas que son de peliculas
    		    	if(category === "tt") {
    		    		//fila para mostrar el resultado
    		    		var resultRow = document.createElement('a');
    		    		resultRow.setAttribute('class', 'resultRow');

                //Seteo el id y nombrePelicula
                resultRow.id =  result.d[i].id;
                resultRow.setAttribute('nombrePelicula', result.d[i].l);
    		    		resultRow.setAttribute('target', '_blank');

                resultRow.onclick = function(e) {

                  //Puede hacerse el click en lo que seria la descripcion o fuera de ella.
                  if (e.target.id == ""){
                    var par = $(event.target).parent();
                    par = par.parent()[0];
                    doneTyping(par.getAttribute("id"), par.getAttribute("nombrePelicula"));
                  }
                  else{
                    doneTyping(e.target.id, e.target.nombrePelicula);
                  }
                  //Hago desaparecer la lista de sugerencia
                  $result.innerHTML = "";
                };

    		    		//creacion y seteo del poster
    		    		var poster = document.createElement('img');
    		    		poster.setAttribute('class', 'poster');

    		    		if(result.d[i].i) {
    			    		var imdbPoster = result.d[i].i[0];
    			    		imdbPoster = imdbPoster.replace("._V1_.jpg", "._V1._SX40_CR0,0,40,54_.jpg");
    			    		var posterUrl =
    			    			"http://i.embed.ly/1/display/resize?key=798c38fecaca11e0ba1a4040d3dc5c07&url="
    			    			+ imdbPoster
    			    			+ "&height=54&width=40&errorurl=http%3A%2F%2Flalwanivikas.github.io%2Fimdb-autocomplete%2Fimages%2Fnoimage.png&grow=true"
    			    		poster.setAttribute('src', posterUrl);
    		    		}

    		    		//creacion y seteo de la descripcion
    		    		var description = document.createElement('div');
    		    		description.setAttribute('class', 'description');

    		    		var name = document.createElement('h4');
    		    		var snippet = document.createElement('h5');

    		    		if(result.d[i].y) {
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

    //Obtengo los elementos del formulario
    var $titulo = $('#searchBox');
    var $anio = $('#año');
    var $director = $('#director');
    var $actores = $('#actores');
    var $sinopsis = $('#sinopsis');
    var $duracion = $('#duracion');
    var $url = $('#url');
    var $wikipedia = $('#wikipedia');


    function doneTyping (id, nombrePelicula) {

      var title = id;

      //hago la llamada para completar los campos
      $.ajax({
             url: "http://www.omdbapi.com/?i="+title+"&y=&plot=short&r=json",
             data: "", //ur data to be sent to server
             type: "GET",
             success: function (data) {

                //Cargo los campos con la info obtenida

                $titulo.val(data.Title);
                $scope.movie.title = data.Title;

                //Guardo por el momento la sinopsis de este sitio, pero no voy a mostrarla hasta
                //no terminar la segunda llamada a otro servicio web. Si la segunda no tiene sinopsis asociada
                //se mostrara esta.
                $scope.movie.sinopsis = data.Plot;

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
      //Hago la llamada para completar los campos faltantes
      //La api requeire se realice el encode
      title =  encodeURI(nombrePelicula);
      $.ajax({
             url: "http://www.tastekid.com/api/similar?q="+title+"&k=227278-Pelicula-Q60XAF18&info=1&limit=5",
             data: "", //ur data to be sent to server
             type: "GET",
             dataType: 'jsonp',
             success: function (data) {

                //Verificio si tiene o no sinopsis asociada
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
                //for (var i=0; i<data.Similar.Results.length; i++) {
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

    //guardo la pelicula y redirijo a la lista de peliculas
    $scope.saveMovie = function() {
      // Set the 'submitted' flag to true
      $scope.form.$submitted = true;
      Movie.post($scope.movie).then(function() {
        $location.path('/movies');
      });
    };

    $scope.dangerAlert = function () {
      flash.error = 'Fail!';
    };

    $scope.hasError = function(field, validation){
    var err;
    if(validation){
      err = ($scope.form[field].$dirty && $scope.form[field].$error[validation]) || ($scope.form.$submitted && $scope.form[field].$error[validation]);
      if(err){
        flash.error = 'Debe completar el campo '+field;
                return 1;
      }
      else{
        return 0;
      }
    }
    err = ($scope.form[field].$dirty && $scope.form[field].$invalid) || ($scope.form.$submitted && $scope.form[field].$invalid);
    if(err){
      flash.error = 'Lo ingresado en el campo '+field+' es invalido';
      return 1;
    }
    else{
      return 0;
    }
    };




  });
