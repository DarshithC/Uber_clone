// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance; // Distance in km
};

const toRad = (value) => {
  return (value * Math.PI) / 180;
};

// Calculate fare based on distance
const calculateFare = (distance) => {
  const baseFare = 50; // Base fare in rupees
  const perKmRate = 15; // Rate per km
  const fare = baseFare + (distance * perKmRate);
  return Math.round(fare);
};

module.exports = { calculateDistance, calculateFare };