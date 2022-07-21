'use strict';

const config = require('config');

const Pool = require('pg').Pool
const pool = new Pool({
  user: config.pqsql_user,
  host: config.pqsql_host,
  database: config.pqsql_database,
  password: config.pqsql_password,
  port: config.pqsql_port,
})

module.exports = pool;