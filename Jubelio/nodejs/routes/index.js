'use strict';

const products = require('./product');

module.exports = ({ server, pqsql }) => {
    
    products({server, pqsql});

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello Jubelio';
        }
    });
 
    return server;
}