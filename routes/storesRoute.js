const express = require('express');
const router = express.Router();

const getStores = async (mysqlPool) => {
    const queryResult = await executeQuery(mysqlPool, 'SELECT * FROM store');
    return queryResult;
  };

module.exports = (mysqlPool) => {
  // Route to send JSON data
  // router.get('/', async (req, res) => {
  //   try {
  //     const stores = await getStores(mysqlPool);
  //     res.json(stores);
  //   } catch (error) {
  //     console.error('Error retrieving stores:', error);
  //     res.status(500).send('Internal Server Error');
  //   }
  // });

  // Route to render the EJS view
  router.get('/', (req, res) => {
    mysqlPool.query('SELECT * FROM store', (error, results) => {
      if (error) {
        console.error('Error retrieving stores from MySQL:', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.render('stores', { stores: results });
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
