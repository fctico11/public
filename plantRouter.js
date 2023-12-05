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

      //push the plant's ID to the user's plants array and save the user document
      await User.findByIdAndUpdate(userId, { $push: { plants: plant._id } });
      //redirect to the list of plants
      res.redirect('/plants');
    } catch (error) {
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
  try {
    let { selectedPlants } = req.body;
    //if selectedPlants is a string (single plant selected), convert it to an array
    if (typeof selectedPlants === 'string') {
      selectedPlants = [selectedPlants];
    }

    // check if there are any plant IDs to delete
    if (Array.isArray(selectedPlants) && selectedPlants.length) {
      //delete all plants with the IDs provided
      await Plant.deleteMany({ _id: { $in: selectedPlants } });
      res.redirect('/plants');
    } else {
      res.status(400).send('No plants selected for deletion.');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//route to display the form for editing an existing plant
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
      res.render('edit-plant', { plant }); 
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
});

//route to handle the submission of the form for editing an existing plant
router.post('/edit/:plantId', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else {
    try {
      const plantId = req.params.plantId;
      const { nickname, species, lastWatered, nextWateringDue } = req.body;

      //update the plant details
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

module.exports = router;
