import express from 'express';
import { Plant, User } from './db.mjs';

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

// Route to handle the submission of the form for adding a new plant
// Route to handle the submission of the form for adding a new plant
router.post('/add', async (req, res) => {
  if (!req.isAuthenticated()) {
    // If the user is not authenticated, redirect to the login page
    res.redirect('/login');
  } else {
    try {
      const { nickname, species, lastWatered, nextWateringDue } = req.body;
      const userId = req.user._id; // Use the authenticated user's ID from the session

      // Create a new plant with the user's ID
      const plant = new Plant({
        nickname,
        species,
        lastWatered,
        nextWateringDue,
        user: userId
      });

      // Save the new plant
      await plant.save();

      // Push the plant's ID to the user's plants array and save the user document
      await User.findByIdAndUpdate(userId, { $push: { plants: plant._id } });

      // Redirect to the list of plants
      res.redirect('/plants');
    } catch (error) {
      // Handle errors, such as database errors
      res.status(500).send(error.message);
    }
  }
});


// Route to display the user's plant list
router.get('/list', async (req, res) => {
  try {
    // This also assumes you have user authentication in place to get the actual user ID
    // Replace with your actual logic for getting the authenticated user's ID
    const userId = req.session.userId;

    const user = await User.findById(userId).populate('plants'); // Make sure 'plants' matches your User schema
    res.render('plant-list', { // You need to create 'plant-list.hbs' for this
      title: 'My Plant List',
      plants: user.plants
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export { router as PlantRouter };
