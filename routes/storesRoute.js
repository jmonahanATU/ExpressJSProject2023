const express = require('express');
const router = express.Router();

const executeQuery = (pool, sql, values) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Add this function to retrieve store details by ID
const getStoreById = async (mysqlPool, storeId) => {
  console.log('Requested Store ID:', storeId); // Add this line for debugging

  try {
    const queryResult = await executeQuery(mysqlPool, 'SELECT * FROM store WHERE sid = ?', [storeId]);

    if (queryResult.length > 0) {
      return queryResult[0];
    } else {
      return null; // No store found with the given ID
    }
  } catch (error) {
    throw error;
  }
};

module.exports = (mysqlPool, mongoClient) => {
  // Handle GET request to retrieve stores
  router.get('/', async (req, res) => {
    try {
      const stores = await executeQuery(mysqlPool, 'SELECT * FROM store', []);
      res.render('stores', { stores });
    } catch (error) {
      console.error('Error retrieving stores from MySQL:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // Add this route for displaying the Add Store page
router.get('/add', (req, res) => {
  res.render('addStore'); // Assuming you have an addStore.ejs file
});

// Add this route for handling the form submission when adding a new store
router.post('/add', async (req, res) => {
  try {
    // Implement the logic to add a new store to the MySQL database
    const addQuery = 'INSERT INTO store (location, mgrid) VALUES (?, ?)';
    const addValues = [req.body.location, req.body.mgrid];

    mysqlPool.query(addQuery, addValues, (error, results) => {
      if (error) {
        console.error('Error adding store:', error);
        res.status(500).send('Internal Server Error');
      } else {
        // Redirect the user back to the stores page after adding a store
        res.redirect('/stores');
      }
    });
  } catch (error) {
    console.error('Error adding store:', error);
    res.status(500).send('Internal Server Error');
  }
});


  // Handle GET request to retrieve store by ID
router.get('/edit/:sid', async (req, res) => {
  const storeId = req.params.sid;

  try {
    // Fetch store details based on the provided storeId
    const store = await getStoreById(mysqlPool, storeId);

    if (!store) {
      return res.status(404).send('Store not found');
    }

    // Render the Edit Store Page with the store details
    res.render('editStore', { store, managerError: null }); // Pass managerError as null initially
  } catch (error) {
    console.error('Error retrieving store details from MySQL:', error);
    res.status(500).send('Internal Server Error');
  }
});

  // Handle POST request to update a store
  router.post('/edit/:sid', async (req, res) => {
    try {
      const storeId = req.params.sid;
      const updatedLocation = req.body.location;
      const updatedManagerId = req.body.mgrid;

      // Validate input
      if (updatedLocation.length < 1) {
        return res.status(400).send('Location should be a minimum of 1 character.');
      }

      if (updatedManagerId.length !== 4) {
        return res.status(400).send('Manager ID should be 4 characters.');
      }

      // Check if Manager ID is assigned to another store
      const assignedStore = await getStoreByManagerId(mysqlPool, updatedManagerId, storeId);

      if (assignedStore) {
        return res.status(400).send('Manager ID is already assigned to another store.');
      }

      // Check if Manager ID exists in MongoDB
      const managerExists = await checkManagerExists(mongoClient, updatedManagerId, storeId);

      if (!managerExists) {
        return res.status(400).send('Manager ID does not exist in MongoDB.');
      }

      // Implement the logic to update the store in the MySQL database
      const updateQuery = 'UPDATE store SET location = ?, mgrid = ? WHERE sid = ?';
      const updateValues = [updatedLocation, updatedManagerId, storeId];

      mysqlPool.query(updateQuery, updateValues, (error, results) => {
        if (error) {
          console.error('Error updating store:', error);
          res.status(500).send('Internal Server Error');
        } else {
          // Redirect the user back to the stores page after the update
          res.redirect('/stores');
        }
      });
    } catch (error) {
      console.error('Error updating store:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
};

const getStoreByManagerId = async (mysqlPool, managerId, currentStoreId) => {
  try {
    const queryResult = await executeQuery(mysqlPool, 'SELECT * FROM store WHERE mgrid = ? AND sid != ?', [managerId, currentStoreId]);
    return queryResult.length > 0 ? queryResult : null;
  } catch (error) {
    throw error;
  }
};


const checkManagerExists = async (mongoClient, managerId) => {
  try {
    const db = mongoClient.db('proj2023MongoDB');
    const collection = db.collection('managers');
    const manager = await collection.findOne({ _id: managerId });
    console.log('Manager exists in MongoDB:', !!manager);
    return !!manager;
  } catch (error) {
    throw error;
  }
};


