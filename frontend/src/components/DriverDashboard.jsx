import React, { useState, useEffect } from 'react';
import { Car, MapPin, Clock, DollarSign } from 'lucide-react';
import {
  registerDriver,
  getDriverProfile,
  toggleDriverAvailability,
  getPendingRides,
  acceptRide,
  updateRideStatus,
} from '../services/api';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const DriverDashboard = () => {
  const [driverProfile, setDriverProfile] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [pendingRides, setPendingRides] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [formData, setFormData] = useState({
    vehicleType: 'sedan',
    vehicleNumber: '',
    license: '',
  });

  useEffect(() => {
    checkDriverProfile();
    
    socket.on('new-ride-request', (ride) => {
      setPendingRides((prev) => [...prev, ride]);
    });

    return () => {
      socket.off('new-ride-request');
    };
  }, []);

  const checkDriverProfile = async () => {
    try {
      const response = await getDriverProfile();
      setDriverProfile(response.data);
      setIsRegistered(true);
      loadPendingRides();
    } catch (error) {
      setIsRegistered(false);
    }
  };

  const loadPendingRides = async () => {
    try {
      const response = await getPendingRides();
      setPendingRides(response.data);
    } catch (error) {
      console.error('Error loading rides:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerDriver(formData);
      checkDriverProfile();
    } catch (error) {
      alert('Failed to register as driver');
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const response = await toggleDriverAvailability();
      setDriverProfile(response.data);
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const handleAcceptRide = async (rideId) => {
    try {
      const response = await acceptRide(rideId);
      setActiveRide(response.data);
      setPendingRides((prev) => prev.filter((r) => r.id !== rideId));
      socket.emit('ride-accepted', response.data);
    } catch (error) {
      alert('Failed to accept ride');
    }
  };

  const handleStartRide = async () => {
    try {
      await updateRideStatus(activeRide.id, 'started');
      setActiveRide({ ...activeRide, status: 'started' });
    } catch (error) {
      console.error('Error starting ride:', error);
    }
  };

  const handleCompleteRide = async () => {
    try {
      await updateRideStatus(activeRide.id, 'completed');
      setActiveRide(null);
      loadPendingRides();
    } catch (error) {
      console.error('Error completing ride:', error);
    }
  };

  if (!isRegistered) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Register as Driver</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type
            </label>
            <select
              value={formData.vehicleType}
              onChange={(e) =>
                setFormData({ ...formData, vehicleType: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="hatchback">Hatchback</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Number
            </label>
            <input
              type="text"
              value={formData.vehicleNumber}
              onChange={(e) =>
                setFormData({ ...formData, vehicleNumber: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="KA-01-AB-1234"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Number
            </label>
            <input
              type="text"
              value={formData.license}
              onChange={(e) =>
                setFormData({ ...formData, license: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="DL1234567890"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Driver Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Driver Dashboard</h2>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center">
                <Car className="h-5 w-5 mr-2" />
                {driverProfile?.vehicleType} - {driverProfile?.vehicleNumber}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Rating: {driverProfile?.rating}/5
              </div>
            </div>
          </div>
          <button
            onClick={handleToggleAvailability}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              driverProfile?.isAvailable
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            {driverProfile?.isAvailable ? 'Available' : 'Offline'}
          </button>
        </div>
      </div>

      {/* Active Ride */}
      {activeRide && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Active Ride</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-green-600 mr-3 mt-1" />
              <div>
                <p className="font-medium">Pickup</p>
                <p className="text-sm text-gray-600">
                  Lat: {activeRide.pickupLocation.lat}, Lng:{' '}
                  {activeRide.pickupLocation.lng}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-red-600 mr-3 mt-1" />
              <div>
                <p className="font-medium">Dropoff</p>
                <p className="text-sm text-gray-600">
                  Lat: {activeRide.dropoffLocation.lat}, Lng:{' '}
                  {activeRide.dropoffLocation.lng}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-lg font-semibold">₹{activeRide.fare}</span>
              {activeRide.status === 'accepted' && (
                <button
                  onClick={handleStartRide}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Start Ride
                </button>
              )}
              {activeRide.status === 'started' && (
                <button
                  onClick={handleCompleteRide}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Complete Ride
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pending Rides */}
      {!activeRide && driverProfile?.isAvailable && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Available Rides</h3>
          {pendingRides.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No rides available at the moment
            </p>
          ) : (
            <div className="space-y-4">
              {pendingRides.map((ride) => (
                <div
                  key={ride.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm">
                          Pickup: {ride.pickupLocation.lat.toFixed(4)},{' '}
                          {ride.pickupLocation.lng.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-sm">
                          Dropoff: {ride.dropoffLocation.lat.toFixed(4)},{' '}
                          {ride.dropoffLocation.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-indigo-600">
                      ₹{ride.fare}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAcceptRide(ride.id)}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Accept Ride
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;