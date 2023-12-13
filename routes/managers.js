const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// MongoDB connection configuration
const url = 'mongodb://localhost:27017';
const dbName = 'proj2023MongoDB';

// Function to get managers from MongoDB
const getManagers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();

      const db = client.db(dbName);
      const collection = db.collection('managers'); // Make sure to use the correct collection name

      const managers = await collection.find().toArray();

      client.close();

      resolve(managers);
    } catch (error) {
      console.error('Error retrieving managers from MongoDB:', error);
      reject(error);
    }
  });
};

// Route to retrieve and display managers from MongoDB using async/await
router.get('/', async (req, res) => {
  try {
    const managers = await getManagers();
    res.json(managers);
  } catch (error) {
    console.error('Error retrieving managers from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
