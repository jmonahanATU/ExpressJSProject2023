const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection configuration
const mysqlDB = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'proj2023',
});

// Connect to MySQL
mysqlDB.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// MongoDB connection configuration
const mongoURI = 'mongodb://localhost:27017/proj2023MongoDB';
const mongoClient = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
mongoClient.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
  } else {
    console.log('Connected to MongoDB');
  }
});

// Function to get managers from MongoDB
const getManagersFromMongoDB = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = mongoClient.db('proj2023MongoDB');
      const collection = db.collection('managers');
      const managers = await collection.find().toArray();
      resolve(managers);
    } catch (error) {
      console.error('Error retrieving managers from MongoDB:', error);
      reject(error);
    }
  });
};

// Function to get stores from MySQL
const getStoresFromMySQL = async () => {
  try {
    const stores = await executeQuery('SELECT * FROM store');
    return stores;
  } catch (error) {
    throw error;
  }
};

// Helper function to execute a MySQL query
const executeQuery = (sql) => {
  return new Promise((resolve, reject) => {
    mysqlDB.query(sql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Routes
const storesRouter = require('./routes/stores');
const productsRouter = require('./routes/products');
const managersRouter = require('./routes/managers');
const productStoreRouter = require('./routes/productStore');

// Use the routes
app.use('/stores', storesRouter);
app.use('/products', productsRouter);
app.use('/managers', managersRouter);
app.use('/product_store', productStoreRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = { getManagersFromMongoDB, getStoresFromMySQL };
