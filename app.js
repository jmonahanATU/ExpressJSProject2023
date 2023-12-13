const express = require('express');
const { MongoClient } = require('mongodb');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection setup
const mongoURI = 'mongodb://localhost:27017/proj2023MongoDB';
const mongoClient = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// MySQL connection pool setup
const mysqlPool = mysql.createPool({
  connectionLimit: 10,
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

// Mock data for demonstration purposes
const mockStores = [
    { id: 1, name: 'Store A', location: 'Location A' },
    { id: 2, name: 'Store B', location: 'Location B' },
    // Add more store data as needed
  ];
// Routes
app.get('/', (req, res) => {
    res.send(`
      <h1>Home Page</h1>
      <ul>
        <li><a href="/stores">Stores</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/managers">Managers (MongoDB)</a></li>
      </ul>
    `);
  });

  app.get('/stores', (req, res) => {
    // Render the Stores page with details of all stores
    res.send(`
      <h1>Stores Page</h1>
      <ul>
        ${mockStores.map(store => `
          <li>
            ${store.name} - ${store.location}
            | <a href="/stores/update/${store.id}">Update</a>
          </li>`).join('')}
      </ul>
      <p><a href="/stores/add">Add Store</a></p>
    `);
  });

// Routes
const storesRouter = require('./routes/stores')(mysqlPool);
const productsRouter = require('./routes/products')(mysqlPool);
const managersRouter = require('./routes/managers')(mongoClient);
const productStoreRouter = require('./routes/productStore')(mysqlPool);

// Use the routes
app.use('/stores', storesRouter);
app.use('/products', productsRouter);
app.use('/managers', managersRouter);
app.use('/product_store', productStoreRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
