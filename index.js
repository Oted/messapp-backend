var Hapi        = require('hapi');
var DbWrapper   = require('./lib/dbwrapper');
var Router      = require('./lib/router'),
    dbWrapper,
    routeWrapper,
    server;

process.env.MONGO_URL = 'mongodb://188.166.45.196:27017/messapp';

//callback of db connection
dbWrapper = new DbWrapper(process.env.MONGO_URL, function() {
    console.log('Connectied to DB!');
    
    server = new Hapi.Server();
    server.connection({
        'host': 'localhost',
        'port': 3000,
	    'routes': { cors: true }
    });

    server.state('session', {
        ttl: 24 * 60 * 60 * 1000 * 730,     // Two years lol
        encoding: 'base64json'
    });

    //start da server
    server.start(function() {
        console.log('Server running at:', server.info.uri);
        routeWrapper = new Router(server, dbWrapper);
    });
});

//on exit, close db
process.on('exit', function(code) {
    DbWrapper.close();
});

module.exports = server;
