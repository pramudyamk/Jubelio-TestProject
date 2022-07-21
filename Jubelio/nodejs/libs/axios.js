'use strict';

const axios = require('axios');
const config = require('config');

axios.defaults.headers.common.AcceptCharset = "utf-8";
axios.defaults.headers.common.ContentType = "application/xml"; 


const config_axios = {
  baseURL: config.elevenia_url,
  headers: {
    'openapikey': config.elevenia_api_key
  } 
};


const _axios = axios.create(config_axios);

_axios.interceptors.request.use(
  (config_axios) =>
    // Do something before request is sent
    config_axios,
  (error) =>
    // Do something with request error
    Promise.reject(error),
);

// Add a response interceptor
_axios.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response;
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error);
  },
);

module.exports = _axios