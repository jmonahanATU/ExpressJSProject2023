const express = require('express');
const { MongoClient } = require('mongodb');
const mysql = require('mysql');
const path = require('path');  // Add this line

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'));
 

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection setup
const mongoURI = 'mongodb://localhost:27017/proj2023MongoDB';
const mongoClient = new MongoClient(mongoURI);

// MySQL connection pool setup
const mysqlPool = mysql.createPool({
  connectionLimit: 15,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'proj2023',
});

// Connect to MongoDB
mongoClient.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  } else {
    console.log('Connected to MongoDB');
  }
});

// Handle MongoDB connection on exit
process.on('SIGINT', () => {
  mongoClient.close();
  process.exit();
});

// Routes
const storesRouter = require('./routes/storesRoute')(mysqlPool, mongoClient);
const productsRouter = require('./routes/products')(mysqlPool);
const managersRouter = require('./routes/managers')(mongoClient);
const productStoreRouter = require('./routes/productStore')(mysqlPool);

// Use the routes
app.use('/stores', storesRouter);
app.use('/products', productsRouter);
app.use('/managers', managersRouter);
app.use('/product_store', productStoreRouter);

// Routes
app.get('/', (req, res) => {
  res.send(`
    <h1>Home Page</h1>
    <ul>
      <li><a href="/stores">Stores</a></li>
      <li><a href="/products">Products</a></li>
      <li><a href="/product_store">Product Store</a></li> 
      <li><a href="/managers">Managers (MongoDB)</a></li>
    </ul>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
