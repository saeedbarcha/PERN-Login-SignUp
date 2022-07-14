const Pool = require('pg').Pool;

const pool = new Pool({
    user: "saeed",
    password: "1122",
    host: "localhost",
    port: 5432,
    database: "pern_login_signup"

});

module.exports = pool;