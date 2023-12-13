const express = require('express');
const router = express.Router();

module.exports = (mongoClient) => {
  router.get('/', async (req, res) => {
    try {
      const managers = await getManagers(mongoClient);
      res.json(managers);
    } catch (error) {
      console.error('Error retrieving managers from MongoDB:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
};

const getManagers = async (mongoClient) => {
  const db = mongoClient.db('proj2023MongoDB');
  const collection = db.collection('managers');
  const managers = await collection.find().toArray();
  return managers;
};
