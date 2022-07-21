'use strict';

const Boom = require('@hapi/boom');
const Joi = require('joi');
const config = require('config');
const _ = require('lodash');

const { handleError, handleFileUpload, handleImage} = require('./handler');

module.exports = ({ server, pqsql }) => {

    server.route({
        method: 'GET',
        path: '/api/products',
        options: {
            // cors: true,
            validate: {
                query: Joi.object({
                    page: Joi.number().integer().min(1).max(100).default(1)
                }),
            },
        },
        handler: async (request, h) => {
            try {
                if (request.headers['the-key'] !== config.api_key) {
                    return Boom.forbidden("You are restricted to use this API");
                }


                const { page } = request.query
                let limit = 12;
                let offset = !page ? 0 : ((page - 1) * limit );

                const { rows } = await pqsql.query('SELECT id, sku, name, description, price, prdImage01, prdImage02, prdImage03, prdImage04 FROM products ORDER BY update_at DESC  LIMIT $1 OFFSET $2', [limit, offset])
                const data = handleImage(rows);
                const result = await pqsql.query('SELECT COUNT(id) FROM products')

                return h.response({
                    statusCode: 200,
                    data: data,
                    total: result.rows ? parseInt(result.rows[0].count) : 0,
                    current_page: !page ? 0 : page,

                }).code(200);
            } catch (error) {
                return Boom.badRequest(error.message, { statusCode: 400 })
            }
        },
    });

    server.route({
        method: 'GET',
        path: '/api/product/{id}',
        handler: async (request, h) => {
            if (request.headers['the-key'] !== config.api_key) {
                return Boom.forbidden("You are restricted to use this API");
            }

            const { rows } = await pqsql.query('SELECT * FROM products WHERE id=$1', [request.params.id])

            if (rows.length === 0) {
                return Boom.badRequest("Data not Found", { statusCode: 400 })
            }

            const data = handleImage(rows)

            return h.response({
                statusCode: 200,
                data: data[0]
            }).code(200);
        }
    })
    server.route({
        method: 'POST',
        path: '/api/product',
        options: {
            validate: {
                payload: Joi.object({
                    sku: Joi.number().required(),
                    price: Joi.number().required(),
                    name: Joi.string().required().max(50),
                    description: Joi.string().required(),
                    image1: Joi.any()
                        .meta({swaggerType: 'file'})
                        .optional()
                        .allow('')
                        .description('image file 01'),
                    image2: Joi.any()
                        .meta({swaggerType: 'file'})
                        .optional()
                        .allow('')
                        .description('image file 02'),
                    image3: Joi.any()
                        .meta({swaggerType: 'file'})
                        .optional()
                        .allow('')
                        .description('image file 03'),
                    image4: Joi.any()
                        .meta({swaggerType: 'file'})
                        .optional()
                        .allow('')
                        .description('image file 04'),
                }),
                failAction: handleError
            },
            payload: {
                multipart: true,
                output: 'data',
            },
        },
        handler: async (request, h) => {
            try {
                if (request.headers['the-key'] !== config.api_key) {
                    return Boom.forbidden("You are restricted to use this API");
                }

                const payload = request.payload;

                const check = await pqsql.query('SELECT id, sku FROM products WHERE sku=$1', [payload.sku]);
                if (check.rows.length !== 0) {
                    return Boom.badRequest("SKU not unique", { statusCode: 400 });
                }

                var image1, image2, image3, image4 = null;
                if (payload.image1) {
                    const { filename } = await handleFileUpload(payload.image1);
                    image1 = filename;
                }
                if (payload.image2) {
                    const { filename } = await handleFileUpload(payload.image2);
                    image2 = filename;
                }
                if (payload.image3) {
                    const { filename } = await handleFileUpload(payload.image3);
                    image2 = filename;
                }
                if (payload.image4) {
                    const { filename } = await handleFileUpload(payload.image4);
                    image4 = filename;
                }

                await pqsql.query('INSERT INTO products(sku, name, description, price, prdimage01, prdimage02, prdimage03, prdimage04, create_at, update_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW());', 
                    [
                        payload.sku,
                        payload.name,
                        payload.description,
                        payload.price,
                        image1,
                        image2,
                        image3,
                        image4
                    ])

                return h.response({
                    statusCode: 201,
                    message: 'Data barhasil ditambahkan',
                }).code(201);

            } catch (error) {
                return Boom.badRequest(error.message, { statusCode: 400 })
            }
        }
    })

    server.route({
        method: 'PUT',
        path: '/api/product/{id}',
        options: {
            validate: {
                payload: Joi.object({
                    sku: Joi.number().required(),
                    price: Joi.number().required(),
                    name: Joi.string().required().max(50),
                    description: Joi.string().required(),
                    image1: Joi.any()
                        .meta({swaggerType: 'file'})
                        .optional()
                        .allow('')
                        .description('image file 01'),
                    image2: Joi.any()
                        .meta({swaggerType: 'file'})
                        .optional()
                        .allow('')
                        .description('image file 02'),
                    image3: Joi.any()
                        .meta({swaggerType: 'file'})
                        .optional()
                        .allow('')
                        .description('image file 03'),
                    image4: Joi.any()
                        .meta({swaggerType: 'file'})
                        .optional()
                        .allow('')
                        .description('image file 04'),
                }),
                failAction: handleError
            },
            payload: {
                multipart: true,
                output: 'data',
            },
        },
        handler: async (request, h) => {
            try {
                if (request.headers['the-key'] !== config.api_key) {
                    return Boom.forbidden("You are restricted to use this API");
                }

                const { rows } = await pqsql.query('SELECT id, sku, prdimage01, prdimage02, prdimage03, prdimage04 FROM products WHERE id=$1', [request.params.id])
                if (rows.length === 0) {
                    return Boom.badRequest("Data not Found", { statusCode: 400 })
                }
                var { id, sku, prdimage01, prdimage02, prdimage03, prdimage04 } = rows[0];

                const payload = request.payload;
                const check = await pqsql.query('SELECT id, sku FROM products WHERE sku=$1', [payload.sku]);
                if (check.rows.length !== 0) {
                    if (check.rows[0].sku != sku && check.rows[0].id != id) {
                        return Boom.badRequest("SKU not unique", { statusCode: 400 });
                    }
                }

                if (payload.image1) {
                    const { filename } = await handleFileUpload(payload.image1);
                    prdimage01 = filename;
                }
                if (payload.image2) {
                    const { filename } = await handleFileUpload(payload.image2);
                    prdimage02 = filename;
                }
                if (payload.image3) {
                    const { filename } = await handleFileUpload(payload.image3);
                    prdimage03 = filename;
                }
                if (payload.image4) {
                    const { filename } = await handleFileUpload(payload.image4);
                    prdimage04 = filename;
                }

                await pqsql.query('UPDATE products SET sku=$2, name=$3, description=$4, price=$5, prdimage01=$6, prdimage02=$7, prdimage03=$8, prdimage04=$9, update_at=NOW()  WHERE id=$1', [
                    request.params.id,
                    payload.sku,
                    payload.name,
                    payload.description,
                    payload.price,
                    prdimage01,
                    prdimage02,
                    prdimage03, 
                    prdimage04
                ])
                
                return h.response({
                    statusCode: 201,
                    message: 'Data barhasil diupdate'
                }).code(201);

            } catch (error) {
                return Boom.badRequest(error.message, { statusCode: 400 })
            }
        }
    })

    server.route({
        method: 'DELETE',
        path: '/api/product/{id}',
        handler: async (request, h) => {
            try {
                if (request.headers['the-key'] !== config.api_key) {
                    return Boom.forbidden("You are restricted to use this API");
                }

                const { rows } = await pqsql.query('SELECT sku FROM products WHERE id=$1', [request.params.id])
                if (rows.length === 0) {
                    return Boom.badRequest("Data not Found", { statusCode: 400 })
                }

                await pqsql.query('DELETE FROM products WHERE id=$1', [request.params.id])

                return h.response({
                    statusCode: 201,
                    message: 'Data deleted successfully'
                }).code(201);
            } catch (error) {
                return Boom.badRequest(error.message, { statusCode: 400 })
            }
        }
    })

    return server;
}