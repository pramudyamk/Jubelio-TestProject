import axios from 'axios';
import { message } from 'antd';

// axios.defaults.headers.common.ContentType = "application/json";
axios.defaults.headers.common.Accept = 'application/json';
axios.defaults.headers.common["the-key"] = 'secret-key';


const config_axios = {
  baseURL: 'http://localhost:3000',// process.env.API_URL
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
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
    if (response.status === 201) {
        message.success(response.data.message);
    }
    return response;
  },
  ({response}) => {
    // Do something with response error
    if (response.status === 400) {
        message.error(response.data.message);
    }
    if (response.status === 404) {
        message.error(response.data.message);
    }
    return Promise.reject(response.data);
  },
);

export default _axios;