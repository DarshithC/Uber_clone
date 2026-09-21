const express = require('express');
const router = express.Router();
const {
  createRide,
  getRides,
  getRideById,
  getPendingRides,
  acceptRide,
  updateRideStatus
} = require('../controllers/rideController');
const auth = require('../middleware/auth');

router.post('/', auth, createRide);
router.get('/', auth, getRides);
router.get('/pending', auth, getPendingRides);
router.get('/:id', auth, getRideById);
router.post('/accept', auth, acceptRide);
router.patch('/:id/status', auth, updateRideStatus);

module.exports = router;