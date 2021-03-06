/*jshint node: true*/
'use strict';

var authErrorFactory = require('./lib/error.js'),
    auth = require('./lib/auth.js'),
    applyHandlers = require('./lib/handlers.js');

/**
 * Auth module handles authentication. Takes the app and the auth config as params
 * and a mandatory error handler when the request is not granted with access to the
 * app.
 * 
 * @param   {express}       app
 * @param   {Object}        config
 * @param   {Function}      errorCallback
 * @returns {undefined}
 */
module.exports = function (app, config, errorCallback)
{
   
    // Register handlers in the auth object
    applyHandlers(auth, config);
    
    // Assign action name to the request
    app.use(function (req, res, next) 
    {
        var url = req.originalUrl;
        var noSlash = url.substr(1);
        var parts = noSlash.split('/');
        req.body.action = parts[1];

        next();
    });
    
    app.use(function (req, res, next) 
    {
        if (auth.hasAccess(req)) {
            next();
        } else {
            errorCallback(
                authErrorFactory.create("Access denied!", auth.getErrors(req)),
                res
            );
        }
    });
};