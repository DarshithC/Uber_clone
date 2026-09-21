const { v4: uuidv4 } = require('uuid');

const rides = [];

class Ride {
  constructor(userId, pickupLocation, dropoffLocation, fare) {
    this.id = uuidv4();
    this.userId = userId;
    this.driverId = null;
    this.pickupLocation = pickupLocation;
    this.dropoffLocation = dropoffLocation;
    this.fare = fare;
    this.status = 'pending'; // pending, accepted, started, completed, cancelled
    this.createdAt = new Date();
    this.acceptedAt = null;
    this.completedAt = null;
  }

  static create(rideData) {
    const ride = new Ride(
      rideData.userId,
      rideData.pickupLocation,
      rideData.dropoffLocation,
      rideData.fare
    );
    rides.push(ride);
    return ride;
  }

  static findById(id) {
    return rides.find(ride => ride.id === id);
  }

  static findByUserId(userId) {
    return rides.filter(ride => ride.userId === userId);
  }

  static findByDriverId(driverId) {
    return rides.filter(ride => ride.driverId === driverId);
  }

  static getPendingRides() {
    return rides.filter(ride => ride.status === 'pending');
  }

  static acceptRide(rideId, driverId) {
    const ride = rides.find(r => r.id === rideId);
    if (ride && ride.status === 'pending') {
      ride.driverId = driverId;
      ride.status = 'accepted';
      ride.acceptedAt = new Date();
    }
    return ride;
  }

  static updateStatus(rideId, status) {
    const ride = rides.find(r => r.id === rideId);
    if (ride) {
      ride.status = status;
      if (status === 'completed') {
        ride.completedAt = new Date();
      }
    }
    return ride;
  }

  static getAll() {
    return rides;
  }
}

module.exports = Ride;