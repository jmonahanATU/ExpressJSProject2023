const express = require('express');
const router = express.Router();

module.exports = (mysqlPool) => {
  router.get('/', async (req, res) => {
    try {
      const stores = await getStores(mysqlPool);
      res.json(stores);
    } catch (error) {
      console.error('Error retrieving stores:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
};

const getStores = async (mysqlPool) => {
  const queryResult = await executeQuery(mysqlPool, 'SELECT * FROM store');
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
