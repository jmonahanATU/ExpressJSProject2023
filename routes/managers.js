const express = require('express');
const router = express.Router();

module.exports = (mongoClient) => {
  router.get('/', async (req, res) => {
    try {
      const managers = await getManagers(mongoClient);
      res.render('managers', { managers }); // Assuming your EJS file is named "managers.ejs"
    } catch (error) {
      console.error('Error retrieving managers from MongoDB:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  const getManagers = async (mongoClient) => {
    try {
      const db = mongoClient.db('proj2023MongoDB');
      const collection = db.collection('managers');
      const managers = await collection.find().toArray();
      return managers;
    } catch (error) {
      throw error;
    }
  };

  return router;
};
