const express = require('express');
const router = express.Router();

module.exports = (mysqlPool) => {
  router.get('/', async (req, res) => {
    try {
      const productStoreData = await getProductStoreData(mysqlPool);
      res.json(productStoreData);
    } catch (error) {
      console.error('Error retrieving product_store data:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
};

const getProductStoreData = async (mysqlPool) => {
  const queryResult = await executeQuery(mysqlPool, 'SELECT * FROM product_store');
  return queryResult;
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
