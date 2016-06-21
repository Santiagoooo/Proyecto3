var Resource = require('resourcejs');

module.exports = function(app, route) {
  /*
  Setup the controller for REST;
    app es la aplicacion express
    No voy a realizar ningun anidamiento de url, asi que el segundo parametro ''
    El nombre del recurso que va ser utilizado para formar la URL a dicho recurso.
    El modelo mongoose
    rest() genera /resource - (GET) - List all resources.
                  /resource - (POST) - Create a new resource.
                  /resource/:id - (GET) - Get a specific resource.
                  /resource/:id - (PUT) - Replaces an existing resource.
                  /resource/:id - (PATCH) - Updates an existing resource.
                  /resource/:id - (DELETE) - Deletes an existing resource.
  */
  Resource(app, '', route, app.models.movie).rest();

  // Return middleware.
  return function(req, res, next) {
    next();
  };
};
