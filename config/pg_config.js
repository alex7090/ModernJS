const pg = require('pg');

const pgConfig = {
    user: 'postgres',
    host: '51.210.8.156',
    database: 'postgres',
    password: 'azertyuiop',
    port: 5432,
};
const pool = new pg.Pool(pgConfig);

module.exports = pool;