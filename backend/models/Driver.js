const { v4: uuidv4 } = require('uuid');

const drivers = [];

class Driver {
  constructor(userId, vehicleType, vehicleNumber, license) {
    this.id = uuidv4();
    this.userId = userId;
    this.vehicleType = vehicleType;
    this.vehicleNumber = vehicleNumber;
    this.license = license;
    this.isAvailable = true;
    this.currentLocation = null;
    this.rating = 5.0;
    this.totalRides = 0;
    this.createdAt = new Date();
  }

  static create(driverData) {
    const driver = new Driver(
      driverData.userId,
      driverData.vehicleType,
      driverData.vehicleNumber,
      driverData.license
    );
    drivers.push(driver);
    return driver;
  }

  static findByUserId(userId) {
    return drivers.find(driver => driver.userId === userId);
  }

  static findById(id) {
    return drivers.find(driver => driver.id === id);
  }

  static getAvailableDrivers() {
    return drivers.filter(driver => driver.isAvailable);
  }

  static updateLocation(driverId, location) {
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      driver.currentLocation = location;
    }
    return driver;
  }

  static updateAvailability(driverId, isAvailable) {
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      driver.isAvailable = isAvailable;
    }
    return driver;
  }
}

module.exports = Driver;