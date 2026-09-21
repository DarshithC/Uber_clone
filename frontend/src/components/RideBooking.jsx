import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import Map from './Map';
import { createRide } from '../services/api';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const RideBooking = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rideStatus, setRideStatus] = useState(null);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPickupCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }

    socket.on('ride-accepted-update', (data) => {
      setRideStatus('accepted');
    });

    return () => {
      socket.off('ride-accepted-update');
    };
  }, []);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPickupCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setPickupLocation('Current Location');
      });
    }
  };

  const handlePickupSearch = () => {
    // Simulated geocoding - In production, use a geocoding API
    setPickupCoords({ lat: 12.9716, lng: 77.5946 });
  };

  const handleDropoffSearch = () => {
    // Simulated geocoding - In production, use a geocoding API
    setDropoffCoords({ lat: 12.9352, lng: 77.6245 });
  };

  const handleBookRide = async () => {
    if (!pickupCoords || !dropoffCoords) {
      alert('Please select both pickup and dropoff locations');
      return;
    }

    setLoading(true);
    try {
      const response = await createRide({
        pickupLocation: pickupCoords,
        dropoffLocation: dropoffCoords,
      });
      
      setFare(response.data.fare);
      setRideStatus('pending');
      
      socket.emit('ride-request', response.data);
    } catch (error) {
      console.error('Error booking ride:', error);
      alert('Failed to book ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Booking Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Book Your Ride</h2>

        {!rideStatus ? (
          <>
            {/* Pickup Location */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Location
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    onBlur={handlePickupSearch}
                    placeholder="Enter pickup location"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={handleUseCurrentLocation}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  <Navigation className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Dropoff Location */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dropoff Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  onBlur={handleDropoffSearch}
                  placeholder="Enter dropoff location"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {fare && (
              <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Estimated Fare:</span>
                  <span className="text-2xl font-bold text-indigo-600">₹{fare}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleBookRide}
              disabled={loading || !pickupCoords || !dropoffCoords}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Book Ride'}
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            {rideStatus === 'pending' && (
              <>
                <div className="animate-pulse mb-4">
                  <div className="h-16 w-16 bg-indigo-600 rounded-full mx-auto flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Looking for a driver...</h3>
                <p className="text-gray-600">Please wait while we find you a ride</p>
              </>
            )}
            {rideStatus === 'accepted' && (
              <>
                <div className="mb-4">
                  <div className="h-16 w-16 bg-green-600 rounded-full mx-auto flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-600">Ride Accepted!</h3>
                <p className="text-gray-600">Your driver is on the way</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Map */}
      <div>
        <Map
          pickup={pickupCoords}
          dropoff={dropoffCoords}
          center={pickupCoords || [12.9716, 77.5946]}
        />
      </div>
    </div>
  );
};

export default RideBooking;