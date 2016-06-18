'use strict';


angular.module('clientApp')
  .controller( 'LoginCtrl', function ( $scope, auth, store, $location, $rootScope) {

    $scope.auth = auth;



  /*  $scope.checkStorage = function checkStorage() {
      if (store.get('profile') === true){
        $rootScope.tengoPerfil = true;
      }
      else{
        $rootScope.tengoPerfil = false;
      }
    }*/

    $scope.logout = function() {
      auth.signout();
      store.remove('profile');
      store.remove('token');
      $location.path('/login');
      //limpia la variable que mantenia el profile
      $rootScope.tengoPerfil = false;
    }

    $scope.resetPassword = function(){
     auth.reset({
        connection: 'Username-Password-Authentication'
      });
    };
});
