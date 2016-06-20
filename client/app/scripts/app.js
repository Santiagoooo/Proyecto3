'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'auth0',
    'angular-storage',
    'angular-jwt',
    'ngRoute',
    'yaru22.angular-timeago',
    'restangular',
    'angular-flash.service',
    'angular-flash.flash-alert-directive'
  ])
  .config(function ($routeProvider, RestangularProvider, authProvider, $httpProvider, $locationProvider,jwtInterceptorProvider, flashProvider ) {

     RestangularProvider.setBaseUrl('http://localhost:3000');

     flashProvider.errorClassnames.push('alert-danger');



    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        requiresLogin: false
      })
      .when('/login', {
        controller: 'LoginCtrl',
        templateUrl: 'views/login.html',
        pageTitle: 'Login',
        requiresLogin: false
      })
      .when('/movies', {
        templateUrl: 'views/movies.html',
        controller: 'MoviesCtrl',
        requiresLogin: true
      })
      .when('/admin/create/movie', {
        templateUrl: 'views/movie-add.html',
        controller: 'MovieAddCtrl',
        requiresLogin: true,
        resolve:{
          "check":function($rootScope, $location){
              //verificar si no soy admin que no me deje entrar.
                if($rootScope.soyAdmin === false){
                    $location.path('/403');
                }
          }
        }
      })
      .when('/movie/:id', {
        templateUrl: 'views/movie-view.html',
        controller: 'MovieViewCtrl',
        requiresLogin: true
      })
      .when('/admin/movie/:id/delete', {
        templateUrl: 'views/movie-delete.html',
        controller: 'MovieDeleteCtrl',
        requiresLogin: true,
        resolve:{
          "check":function($rootScope, $location){
              //verificar si no soy admin que no me deje entrar.
                if($rootScope.soyAdmin === false){
                    $location.path('/403');
                }
          }
        }
      })
      .when('/admin/movie/:id/edit', {
        templateUrl: 'views/movie-edit.html',
        controller: 'MovieEditCtrl',
        requireLogin: true,
        resolve:{
          "check":function($rootScope, $location){
              //verificar si no soy admin que no me deje entrar.
                if($rootScope.soyAdmin === false){
                    $location.path('/403');
                }
          }
        }
      })
      .when('/403', {
        templateUrl: 'views/403.html',
        requiresLogin: false
      })
      .otherwise({
        redirectTo: '/'
      });

      //Configuracion del modulo de autenticacion
      authProvider.init({
          domain: 'santiago.auth0.com',
          clientID: 'i0RhWEgoSk87efX7sbaFtD6yOe6kDl3p',
          loginUrl: '/login'
      });

      //Se llama cuando el login es exitoso
      authProvider.on('loginSuccess', function($location, profilePromise, idToken, store, $rootScope) {
        profilePromise.then(function(profile) {
          //Tengo el perfil, seteo en localStorage profile y token
          store.set('profile', profile);
          store.set('token', idToken);
          //Variable para saber si tengo que mostrar determinas pestañas solo visibles para usuarios logueados.
          $rootScope.tengoPerfil = true;
          profile.app_metadata =  profile.app_metadata || {};
          profile.app_metadata.roles = profile.app_metadata.roles || [];
          //Verfico si el usuario logueado es o no admin.
          if (profile.app_metadata.roles.indexOf('admin') >= 0){
            $rootScope.soyAdmin = true;
          }
          else{
            $rootScope.soyAdmin = false;
          }
          //Guardo en esta variable el perfil.
          $rootScope.redirectModeProfile = profile;
        });
        $location.path('/');
      });

      //Se llama cuando el login falla
      authProvider.on('loginFailure', function() {
        $location.path('/login');
      });

      //Se llama cuando ya se esta logueado.
      authProvider.on('authenticated', function($location, profilePromise, $rootScope) {
        profilePromise.then(function(profile) {
          profile.app_metadata =  profile.app_metadata || {};
          profile.app_metadata.roles = profile.app_metadata.roles || [];
          if (profile.app_metadata !== undefined && profile.app_metadata.roles.indexOf('admin') >= 0){
            $rootScope.soyAdmin = true;
            //authProvider.soyAdmin = true;
          }
          else{
            $rootScope.soyAdmin = false;
          }
        });
      });



      //Angular HTTP Interceptor function
      jwtInterceptorProvider.tokenGetter = function(store) {
          return store.get('token');
      }
      //Push interceptor function to $httpProvider's interceptors
      $httpProvider.interceptors.push('jwtInterceptor');





  }).run(function($rootScope, auth, store, jwtHelper, $location) {
    $rootScope.$on('$locationChangeStart', function() {

      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          if (!auth.isAuthenticated) {
            //Re-authenticate user if token is valid
            auth.authenticate(store.get('profile'), token);
            $rootScope.redirectModeProfile =store.get('profile');
            $rootScope.tengoPerfil = true;

          }
        } else {
          // Either show the login page or use the refresh token to get a new idToken
          $location.path('/');
          $rootScope.tengoPerfil = false;
        }
      }
    });
  })
  .factory('MovieRestangular', function(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setRestangularFields({
      id: '_id'
    });
  });
  })
  .factory('Movie', function(MovieRestangular) {
    return MovieRestangular.service('movie');
  })

  .factory('LikeRestangular', function(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setRestangularFields({
      id: '_id'
    });
  });
  })
  .factory('Like', function(LikeRestangular) {
    return LikeRestangular.service('like');
  })
  .directive('youtube', function() {
    //Me permite tener el elemento <youtube>
    return {
      restrict: 'E',
      scope: {
        src: '='
      },
      templateUrl: 'views/youtube.html'
    };
  })
  .filter('trusted', function ($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  });
