const axios = require('../../libs/axios');
const parser = require('xml2js');
const pqsql = require('../../libs/postgresql');

const getProducts = (page = 1) => {
    let startPage = page;
    (
        async () => {
            const { data } = await axios.get(`rest/prodservices/product/listing?page=${page}`);
            const { Products } = await parser.parseStringPromise(data);
            if (Products.product) {
                const products = Products.product

                const arr_products = products
                    .map(async (item) => {
                        const { rows } = await pqsql.query('SELECT sku FROM products WHERE sku=$1', [arrayToValue(item.prdNo)]);

                        if (rows.length === 0) {
                            const { data } = await axios.get(`rest/prodservices/product/details/${arrayToValue(item.prdNo)}`)
                            const { Product } = await parser.parseStringPromise(data);

                            const result = await pqsql.query('INSERT INTO products(sku, name, description, price, prdimage01, prdimage02 ,prdimage03 ,prdimage04) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [
                                arrayToValue(Product.prdNo),
                                arrayToValue(Product.prdNm),
                                arrayToValue(Product.htmlDetail),
                                arrayToValue(Product.selPrc),
                                arrayToValue(Product.prdImage01),
                                arrayToValue(Product.prdImage02),
                                arrayToValue(Product.prdImage03),
                                arrayToValue(Product.prdImage04),
                            ]);
                            console.log(`PrdNo ${arrayToValue(Product.prdNo)} saved`)
                        } else {
                            console.log(`PrdNo ${arrayToValue(item.prdNo)} is exist`)
                        }

                        return rows;
                    });

                Promise.all(arr_products)
                    .then((e) => {
                        startPage++;
                        getProducts(startPage);
                    })
                    .catch(err => {
                        startPage++;
                        getProducts(startPage);
                    })
            } else {
                console.log('End...')
            }
        })()
        .catch(e => {
            console.error(e)
        })
}

function arrayToValue(params) {
    return params ? params[0].trim() : null
}

getProducts();

module.exports = getProducts;
