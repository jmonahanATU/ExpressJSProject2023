const express = require('express');
const router = express.Router();

module.exports = (mysqlPool) => {
  // router.get('/', async (req, res) => {
  //   try {
  //     const products = await getProducts(mysqlPool);
  //     res.json(products);
  //   } catch (error) {
  //     console.error('Error retrieving products:', error);
  //     res.status(500).send('Internal Server Error');
  //   }
  // });
// Route to render the EJS view
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

const getProducts = async (mysqlPool) => {
  const queryResult = await executeQuery(mysqlPool, 'SELECT * FROM product');
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
