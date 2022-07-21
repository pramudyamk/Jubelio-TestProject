DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id serial4 NOT NULL,
  sku TEXT unique NOT NULL, 
  name TEXT NULL,
  description TEXT NOT NULL,
  price TEXT NULL,
  prdImage01 TEXT NULL,
  prdImage02 TEXT NULL,
  prdImage03 TEXT NULL,
  prdImage04 TEXT NULL
);