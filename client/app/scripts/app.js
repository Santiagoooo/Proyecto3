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
        controllerAs: 'main'
      })
      .when('/login', {
        controller: 'LoginCtrl',
        templateUrl: 'views/login.html',
        pageTitle: 'Login'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/movies', {
        templateUrl: 'views/movies.html',
        controller: 'MoviesCtrl',
        requiresLogin: true
      })
      .when('/create/movie', {
        templateUrl: 'views/movie-add.html',
        controller: 'MovieAddCtrl',
      })
      .when('/movie/:id', {
        templateUrl: 'views/movie-view.html',
        controller: 'MovieViewCtrl',
      })
      .when('/movie/:id/delete', {
        templateUrl: 'views/movie-delete.html',
        controller: 'MovieDeleteCtrl',
      })
      .when('/movie/:id/edit', {
        templateUrl: 'views/movie-edit.html',
        controller: 'MovieEditCtrl',
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/likes', {
        templateUrl: 'views/likes.html',
        controller: 'LikesCtrl',
        controllerAs: 'likes'
      })
      .otherwise({
        redirectTo: '/'
      });


      authProvider.init({
          domain: 'santiago.auth0.com',
          clientID: 'i0RhWEgoSk87efX7sbaFtD6yOe6kDl3p',
          loginUrl: '/login'
      });

      //Called when login is successful
      authProvider.on('loginSuccess', function($location, profilePromise, idToken, store, $rootScope) {
        console.log("Login Success");
        profilePromise.then(function(profile) {
          store.set('profile', profile);
          store.set('token', idToken);
          $rootScope.tengoPerfil = true;
          $rootScope.redirectModeProfile = profile;

        });
        $location.path('/');
      });

      //Called when login fails
      authProvider.on('loginFailure', function() {
        console.log("Error logging in");
        $location.path('/login');
      });

      authProvider.on('authenticated', function($location) {
        console.log("Authenticated");

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

  .factory('likeRestangular', function(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setRestangularFields({
      id: '_id'
    });
  });
  })
  .factory('like', function(likeRestangular) {
    return likeRestangular.service('like');
  })
  .factory('UserRestangular', function(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setRestangularFields({
      id: '_id'
    });
  });
  })
  .factory('User', function(UserRestangular) {
    return UserRestangular.service('user');
  })
  .directive('youtube', function() {
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
