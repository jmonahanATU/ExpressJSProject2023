const express = require('express');
const router = express.Router();

const getProductStoreData = async (mysqlPool) => {
  const queryResult = await executeQuery(mysqlPool, 'SELECT * FROM product_store');
  return queryResult;
};

module.exports = (mysqlPool) => {
  router.get('/', (req, res) => {
    mysqlPool.query('SELECT * FROM product_store', (error, results) => {
      if (error) {
        console.error('Error retrieving product_store from MySQL:', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.render('product_store_page', { productStore: results });
      }
    });
  });

  return router;
};



const executeQuery = (pool, sql) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};
