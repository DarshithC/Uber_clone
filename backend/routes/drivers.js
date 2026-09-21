const express = require('express');
const router = express.Router();
const {
  registerDriver,
  getDriverProfile,
  updateLocation,
  toggleAvailability,
  getDriverRides
} = require('../controllers/driverController');
const auth = require('../middleware/auth');

router.post('/register', auth, registerDriver);
router.get('/profile', auth, getDriverProfile);
router.post('/location', auth, updateLocation);
router.post('/toggle-availability', auth, toggleAvailability);
router.get('/rides', auth, getDriverRides);

module.exports = router;