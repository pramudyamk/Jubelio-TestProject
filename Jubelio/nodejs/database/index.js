const { migrate } = require('postgres-migrations');
const client = require('../libs/postgresql');

try {
    migrate({ client }, __dirname + "/migrations/")
}
catch (e) {
    console.log(e)
}