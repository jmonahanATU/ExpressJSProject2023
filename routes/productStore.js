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

// Route to retrieve and display product_store data from the MySQL database using async/await
router.get('/', async (req, res) => {
  try {
    const productStoreData = await getProductStoreData();
    res.json(productStoreData);
  } catch (error) {
    console.error('Error retrieving product_store data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Helper function to get product_store data using async/await
const getProductStoreData = async () => {
  try {
    const queryResult = await executeQuery('SELECT * FROM product_store');
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
        console.error('Error executing query:', error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = router;
