const express = require('express');
const { Plant, User } = require('./db');

const router = express.Router();

// Route to display the user's plant list
router.get('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    // If the user is not authenticated, redirect to the login page
    res.redirect('/login');
  } else {
    try {
      // Assuming you have user authentication in place to get the actual user ID
      const userId = req.user._id; // Use the authenticated user's ID from the session
      const userWithPlants = await User.findById(userId).populate('plants');
      res.render('plant-list', { // Ensure you have a 'plant-list.hbs' view template
        title: 'My Plant List',
        plants: userWithPlants.plants
      });
    } catch (error) {
      // Handle errors, such as database errors
      res.status(500).send(error.message);
    }
  }
});

// Route to display the form for adding a new plant to the user's list
router.get('/add', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else {
    res.render('add-plants', { title: 'Add New Plant' });
  }
});

//route to handle the submission of the form for adding a new plant
router.post('/add', async (req, res) => {
  if (!req.isAuthenticated()) {
    // If the user is not authenticated, redirect to the login page
    res.redirect('/login');
  } else {
    try {
      const { nickname, species, lastWatered, nextWateringDue } = req.body;
      const userId = req.user._id; //use the authenticated user's ID from the session

      //Create a new plant with the user's ID
      const plant = new Plant({
        nickname,
        species,
        lastWatered,
        nextWateringDue,
        user: userId
      });

      //Save the new plant
      await plant.save();

      //Push the plant's ID to the user's plants array and save the user document
      await User.findByIdAndUpdate(userId, { $push: { plants: plant._id } });

      //Redirect to the list of plants
      res.redirect('/plants');
    } catch (error) {
      // Handle errors, such as database errors
      res.status(500).send(error.message);
    }
  }
});


//Route to display the user's plant list
router.get('/list', async (req, res) => {
  try {
    const userId = req.session.userId;

    const user = await User.findById(userId).populate('plants'); 
    res.render('plant-list', { 
      title: 'My Plant List',
      plants: user.plants
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to delete selected plants
router.post('/delete', async (req, res) => {
  // This route expects an array of plant IDs or a single plant ID to be sent in the body of the request
  try {
    let { selectedPlants } = req.body;
    // If selectedPlants is a string (single plant selected), convert it to an array
    if (typeof selectedPlants === 'string') {
      selectedPlants = [selectedPlants];
    }

    // Check if there are any plant IDs to delete
    if (Array.isArray(selectedPlants) && selectedPlants.length) {
      // Delete all plants with the IDs provided
      await Plant.deleteMany({ _id: { $in: selectedPlants } });

      // Redirect back to the plant list page or where appropriate
      res.redirect('/plants');
    } else {
      // If no plants selected, handle the error
      res.status(400).send('No plants selected for deletion.');
    }
  } catch (error) {
    // If an error occurs, send the error message
    res.status(500).send(error.message);
  }
});


// Route to display the form for editing an existing plant
router.get('/edit/:plantId', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else {
    try {
      const plantId = req.params.plantId;
      const plant = await Plant.findById(plantId);
      if (!plant) {
        return res.status(404).send('Plant not found');
      }
      res.render('edit-plant', { plant }); // Assuming you have a view template named 'edit-plant.hbs'
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
});

// Route to handle the submission of the form for editing an existing plant
router.post('/edit/:plantId', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else {
    try {
      const plantId = req.params.plantId;
      const { nickname, species, lastWatered, nextWateringDue } = req.body;

      // Update the plant details
      await Plant.findByIdAndUpdate(plantId, {
        nickname,
        species,
        lastWatered,
        nextWateringDue
      });

      res.redirect('/plants');
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
});



module.exports =  router;
