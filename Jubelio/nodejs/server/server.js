'use strict';

const Hapi = require('@hapi/hapi');
const routes = require('../routes/index');
const pqsql = require('../libs/postgresql.js'); 

const server = Hapi.server({
    port: 6000,
    host: 'localhost'
});

/** Routes */
routes({server, pqsql});

exports.init = async () => {

    await server.initialize();
    return server;
};

exports.start = async () => {

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    return server;
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});