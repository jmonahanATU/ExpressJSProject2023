const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// MySQL connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'proj2023',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Route to retrieve and display products from the MySQL database using async/await
router.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    // Close the MySQL connection
    db.end();
  }
});

// Helper function to get products using async/await
const getProducts = async () => {
  try {
    const queryResult = await executeQuery('SELECT * FROM product');
    return queryResult;
  } catch (error) {
    throw error;
  }
};

// Helper function to execute a query
const executeQuery = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = router;
