const Ride = require('../models/Ride');
const { calculateDistance, calculateFare } = require('../utils/distance');

const createRide = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation } = req.body;

    // Calculate distance and fare
    const distance = calculateDistance(
      pickupLocation.lat,
      pickupLocation.lng,
      dropoffLocation.lat,
      dropoffLocation.lng
    );
    const fare = calculateFare(distance);

    const ride = Ride.create({
      userId: req.user.id,
      pickupLocation,
      dropoffLocation,
      fare
    });

    res.status(201).json(ride);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRides = async (req, res) => {
  try {
    const rides = Ride.findByUserId(req.user.id);
    res.json(rides);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRideById = async (req, res) => {
  try {
    const ride = Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    res.json(ride);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPendingRides = async (req, res) => {
  try {
    const rides = Ride.getPendingRides();
    res.json(rides);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const acceptRide = async (req, res) => {
  try {
    const { rideId } = req.body;
    const ride = Ride.acceptRide(rideId, req.user.driverId);
    
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found or already accepted' });
    }

    res.json(ride);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ride = Ride.updateStatus(req.params.id, status);
    
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    res.json(ride);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createRide,
  getRides,
  getRideById,
  getPendingRides,
  acceptRide,
  updateRideStatus
};