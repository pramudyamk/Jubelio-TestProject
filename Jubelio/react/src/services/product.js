import axios from '../libs/axios';

export const getProducts = async (page) => await axios.get(`/api/products?page=${page}`);

export const storeProduct = async (params, config) => await axios.post('/api/product', params, config);

export const updateProduct = async (id, params) => await axios.put(`/api/product/${id}`, params)

export const getProduct = async (id) => await axios.get(`/api/product/${id}`)

export const deleteProduct = async (id) => await axios.delete(`/api/product/${id}`)