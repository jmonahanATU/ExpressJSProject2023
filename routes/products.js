const express = require('express');
const router = express.Router();

const getProducts = async (mysqlPool) => {
  const queryResult = await executeQuery(mysqlPool, 'SELECT * FROM product');
  return queryResult;
};

const executeQuery = (pool, sql, values) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = (mysqlPool) => {
router.get('/', (req, res) => {
  mysqlPool.query('SELECT * FROM product', (error, results) => {
    if (error) {
      console.error('Error retrieving products from MySQL:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.render('products', { products: results });
    }
  });
});

return router;
};


