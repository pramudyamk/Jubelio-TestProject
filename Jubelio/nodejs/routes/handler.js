'use strict';

const fs = require('fs');
const config = require('config');
const _ = require('lodash');

const handleError = function (request, h, err) {
    if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
        const invalidItem = err.details[0];
        return h.response({
            statusCode: 400,
            message: 'Data Validation Error',
            errors: {
                [invalidItem.context.label]: invalidItem.message
            },
        })
            .code(400)
            .takeover();
    }

    return h.response(err)
        .takeover()
};
 
const generateFileName = (length)  => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

const handleFileUpload = (file) => {
    const namefile = generateFileName(10)+".jpg";
    return new Promise((resolve, reject) => {
        fs.writeFile(__dirname+'/../public/'+namefile, file, err => {
            if (err) {
                reject(err)
            }
            resolve({ message: 'Upload successfully!', filename: namefile })
        })
    })
};

const handleImage = (data) => {
    data.map((item) => {
        if (!_.startsWith(item.prdimage01, 'http://image.elevenia.co.id')) {
            item.prdimage01 = `http://${config.hostname}:${config.port}/${item.prdimage01}`
        }
        if (item.prdimage02 && !_.startsWith(item.prdimage02, 'http://image.elevenia.co.id')) {
            item.prdimage02 = `http://${config.hostname}:${config.port}/${item.prdimage02}`
        }
        if (item.prdimage03 && !_.startsWith(item.prdimage03, 'http://image.elevenia.co.id')) {
            item.prdimage03 = `http://${config.hostname}:${config.port}/${item.prdimage03}`
        }
        if (item.prdimage04 && !_.startsWith(item.prdimage04, 'http://image.elevenia.co.id')) {
            item.prdimage04 = `http://${config.hostname}:${config.port}/${item.prdimage04}`
        }
        return item;
    });
    return data
}

module.exports = {
    handleError,
    handleFileUpload,
    handleImage
};