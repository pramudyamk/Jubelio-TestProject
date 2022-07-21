'use strict';

const Hapi = require('@hapi/hapi');
const config = require('config');
const pqsql = require('./libs/postgresql.js'); 
const routes = require('./routes/index');
const Path = require('path');
 
const init = async () => {
    const server = Hapi.server({
        port: config.port,
        host: config.hostname,
        routes: {
            cors: {
                origin: ['*'],
                headers: ['Accept', 'Authorization', 'Content-Type', 'Access-Control-Allow-Headers', 'the-key'],
            },
            files: {
                relativeTo: Path.join(__dirname, 'public')
            },
        },
    });

    await server.register(require('@hapi/inert'));
    server.route({
        method: 'GET',
        path: '/{filename}',
        handler: {
            file: function (request) {
                return request.params.filename;
            }
        }
    });
    
    /** Routes */
    routes({server, pqsql});

    await server.start();
    console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
})

init();