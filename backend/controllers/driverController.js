const Driver = require('../models/Driver');
const Ride = require('../models/Ride');

const registerDriver = async (req, res) => {
  try {
    const { vehicleType, vehicleNumber, license } = req.body;

    // Check if driver already exists
    const existingDriver = Driver.findByUserId(req.user.id);
    if (existingDriver) {
      return res.status(400).json({ error: 'Driver profile already exists' });
    }

    const driver = Driver.create({
      userId: req.user.id,
      vehicleType,
      vehicleNumber,
      license
    });

    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getDriverProfile = async (req, res) => {
  try {
    const driver = Driver.findByUserId(req.user.id);
    if (!driver) {
      return res.status(404).json({ error: 'Driver profile not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const driver = Driver.findByUserId(req.user.id);
    
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const updatedDriver = Driver.updateLocation(driver.id, { lat, lng });
    res.json(updatedDriver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    const driver = Driver.findByUserId(req.user.id);
    
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const updatedDriver = Driver.updateAvailability(
      driver.id,
      !driver.isAvailable
    );
    res.json(updatedDriver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getDriverRides = async (req, res) => {
  try {
    const driver = Driver.findByUserId(req.user.id);
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const rides = Ride.findByDriverId(driver.id);
    res.json(rides);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerDriver,
  getDriverProfile,
  updateLocation,
  toggleAvailability,
  getDriverRides
};