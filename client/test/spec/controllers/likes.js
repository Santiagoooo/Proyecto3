'use strict';

describe('Controller: LikesCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var LikesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LikesCtrl = $controller('LikesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LikesCtrl.awesomeThings.length).toBe(3);
  });
});
