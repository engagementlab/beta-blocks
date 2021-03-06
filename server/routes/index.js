const keystone = global.keystone;
const express = require('express');
var router = express.Router();
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('render', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
    api: importRoutes('./api')
};
let routeIncludes = [keystone.middleware.api, keystone.middleware.cors];

// Setup Route Bindings 
// CORS
router.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD, PUT');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method");
    
    if(req.method === 'OPTIONS')
        res.sendStatus(200);
    else
        next();

});

router.get('/api/data/get', routeIncludes, routes.api.data.get);
router.get('/api/data/set', routeIncludes, routes.api.data.set);

router.get('/api/exhibit/get/:current?', routeIncludes, routes.api.exhibit.get);
router.get('/api/events/get/:eventbrite?', routeIncludes, routes.api.events.get);

router.get('/api/people/get', routeIncludes, routes.api.people.get);
router.get('/api/tech/get', routeIncludes, routes.api.tech.get);
router.get('/api/zones/get', routeIncludes, routes.api.zones.get);
router.get('/api/tool/get', routeIncludes, routes.api.tool.get);

router.post('/api/contact', routeIncludes, routes.api.contact.send);

module.exports = router;