import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Thermometer, Droplets, Mountain } from 'lucide-react';
import LocationSelector from './LocationSelector';

interface Tree {
  _id: string;
  name: string;
  scientificName: string;
  image: string;
  description: string;
  watering: string;
  sunlight: string;
  specialCare: string;
  location?: {
    district: string;
    city: string;
    state: string;
  };
}

interface Location {
  _id: string;
  district: string;
  city: string;
  state: string;
  country: string;
  climate?: string;
}

export default function LocationBasedTrees() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const fetchTreesByLocation = async (locationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/api/locations/${locationId}/trees`);
      setTrees(response.data.trees);
    } catch (error) {
      console.error('Error fetching trees by location:', error);
      setError('Failed to fetch trees for this location');
    } finally {
      setLoading(false);
    }
  };

  const fetchTreesByGPS = async (coords: { latitude: number; longitude: number }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVER}/api/locations/nearby-trees`, {
        latitude: coords.latitude,
        longitude: coords.longitude,
        radius: 50000 // 50km radius
      });
      setTrees(response.data.trees);
      setGpsCoords(coords);
    } catch (error) {
      console.error('Error fetching nearby trees:', error);
      setError('Failed to fetch trees for your location');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: Location | null) => {
    setSelectedLocation(location);
    setGpsCoords(null);
    if (location) {
      fetchTreesByLocation(location._id);
    } else {
      setTrees([]);
    }
  };

  const handleGPSLocation = (coords: { latitude: number; longitude: number }) => {
    setSelectedLocation(null);
    fetchTreesByGPS(coords);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          🌍 Location-Based Tree Recommendations
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover trees that are perfectly suited for your local climate and growing conditions.
          Get personalized recommendations based on your location.
        </p>
      </div>

      <LocationSelector 
        onLocationSelect={handleLocationSelect}
        onGPSLocation={handleGPSLocation}
      />

      {/* Location Info Display */}
      {(selectedLocation || gpsCoords) && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-800">
              {selectedLocation 
                ? `${selectedLocation.district}, ${selectedLocation.city}, ${selectedLocation.state}`
                : `GPS Location (${gpsCoords?.latitude.toFixed(4)}, ${gpsCoords?.longitude.toFixed(4)})`
              }
            </h3>
          </div>
          
          {selectedLocation?.climate && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Thermometer className="h-5 w-5" />
              <span>Climate: {selectedLocation.climate}</span>
            </div>
          )}
        </div>
      )}

      {/* Trees Display */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <Loader className="h-6 w-6 animate-spin" />
            <span className="text-lg">Finding trees for your location...</span>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      ) : trees.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            🌳 Recommended Trees ({trees.length} found)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trees.map((tree) => (
              <div
                key={tree._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={tree.image}
                  alt={tree.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {tree.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 italic">
                    {tree.scientificName}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {tree.description}
                  </p>
                  
                  {/* Care Information */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-600">
                        <strong>Watering:</strong> {tree.watering}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4 text-yellow-500" />
                      <span className="text-gray-600">
                        <strong>Sunlight:</strong> {tree.sunlight}
                      </span>
                    </div>
                  </div>

                  {tree.location && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>
                          Also found in: {tree.location.district}, {tree.location.state}
                        </span>
                      </div>
                    </div>
                  )}

                  <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (selectedLocation || gpsCoords) ? (
        <div className="text-center py-12">
          <Mountain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No trees found for this location yet.
          </p>
          <p className="text-gray-400 mt-2">
            Our database is constantly growing. Check back soon!
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Please select your location to see recommended trees
          </p>
        </div>
      )}
    </div>
  );
}