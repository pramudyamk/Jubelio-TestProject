import { observable, action, reaction, runInAction, entries, makeObservable, computed, keys, values } from 'mobx';
import * as _ from 'lodash';
import * as productService from '../services/product';

export class ProductStore {
  isLoading = false;
  page = 1;
  total = 0;
  productRegistry = observable.map()
  hasMore = true;
  hasChildren = false;
  form = {

  };
  visibleModal = false;

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      page: observable,
      total: observable,
      productRegistry: observable,
      visibleModal: observable,
      form: observable,
      products: computed,
      loadProducts: action,
      loadProduct: action,
      createProduct: action,
      updateProduct: action,
      deleteProduct: action,
      getProduct: action,
      showModal: action,
      closeModal: action,
      updateForm: action,
    })
    // makeAutoObservable(this)
  }

  get products() {
    return entries(this.productRegistry);
  }

  clear() {
    this.productRegistry.clear();
    this.page = 1;
  }

  getProduct(id) {
    return this.productRegistry.get(id);
  }

  setPage(page) {
    this.page = page;
  }

  loadProducts(clear) {
    this.isLoading = true;

    if (clear) {  
      this.productRegistry.clear();
    }

    return productService.getProducts(this.page)
      .then(action(({ data }) => {
        if (!_.isEmpty(data.data)) {

          const products = data.data;
          this.total = data.total;

          if (this.products.length !== data.total || products.length !== 0) {
            this.hasMore = true;
            products.forEach(product => {
              if (!this.getProduct(product.id)) {
                this.productRegistry.set(product.id, product);
              }
            });
            this.page = data.current_page + 1;
          } else {
            this.hasMore = false;
          }

          return products;
        }

        return [];
      }))
      .finally(action(() => this.isLoading = false))
  }

  loadProduct(id, { acceptCached = false } = {}) {
    if (acceptCached) {
      const product = this.getProduct(id);
      if (product) return Promise.resolve(product);
    }
    return productService.getProduct(id)
      .then(action(({ data }) => {
        this.isLoading = true;
        const product = data.data;
        this.productRegistry.set(product.id, product);
        return product;
      }))
      .finally(action(() => this.isLoading = false))
  }

  createProduct(product) {

    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    }

    let data = new FormData();
    data.append('sku', product.sku);
    data.append('name', product.name);
    data.append('price', product.price);
    data.append('description', product.description);
    data.append('image1', product.image[0].originFileObj, product.image[0].name);

    return productService.storeProduct(data, config)
      .then(action(() => {
        this.page = 1;
        this.loadProducts(true);
      }))
      .finally(() => { this.closeModal() });
  }

  updateProduct() {
    const { form } = this

    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    }
    let data = new FormData();
    data.append('sku', form.sku);
    data.append('name', form.name);
    data.append('price', form.price);
    data.append('description', form.description);
    data.append('image1', form.image[0].originFileObj, form.image[0].name);

    return productService.updateProduct(form.id, data, config)
      .then(action(() => {
        this.page = 1;
        this.loadProducts(true); 
      }))
      .finally(() => { this.closeModal() });
  }

  deleteProduct(id) {
    this.productRegistry.delete(id);

    return productService.deleteProduct(id)
      .then(() => {
        this.clear();
        this.page = 1;
        this.loadProducts(true);
      })
      .catch(action(err => { 
        this.clear();
        throw err; 
      }));
  }

  showModal(id) {
    var form = {
      name: '',
      price: '',
      description: '',
      sku: '',
      image: []
    }

    if (id) {
      const result = this.getProduct(id);
      form = {...result, image: []};
    }
    this.form = form;
    this.visibleModal = true;
    return Promise.resolve(form);
  }

  closeModal () {
    this.visibleModal = false;
    this.form = {
      name: '',
      price: '',
      description: '',
      sku: '',
      image: [],
    };
  }

  updateForm(field, val) {
    const form = this.form;
    this.form = {...form, [field]: val}
  }
}

export default new ProductStore();