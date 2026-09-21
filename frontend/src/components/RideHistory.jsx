import React, { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { getRides } from '../services/api';

const RideHistory = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    try {
      const response = await getRides();
      setRides(response.data);
    } catch (error) {
      console.error('Error loading rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      started: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Loading ride history...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Ride History</h2>
      
      {rides.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No rides yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Your completed rides will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {formatDate(ride.createdAt)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-green-600 mr-2 mt-1" />
                      <div className="text-sm">
                        <p className="font-medium">Pickup</p>
                        <p className="text-gray-600">
                          {ride.pickupLocation.lat.toFixed(4)},{' '}
                          {ride.pickupLocation.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-red-600 mr-2 mt-1" />
                      <div className="text-sm">
                        <p className="font-medium">Dropoff</p>
                        <p className="text-gray-600">
                          {ride.dropoffLocation.lat.toFixed(4)},{' '}
                          {ride.dropoffLocation.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center justify-end mb-2">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-lg font-bold">₹{ride.fare}</span>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      ride.status
                    )}`}
                  >
                    {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RideHistory;