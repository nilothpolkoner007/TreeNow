import React, { useState, useEffect } from 'react';
import { MapPin, Search, Loader } from 'lucide-react';
import axios from 'axios';

interface Location {
  _id: string;
  district: string;
  city: string;
  state: string;
  country: string;
  climate?: string;
}

interface LocationSelectorProps {
  onLocationSelect: (location: Location | null) => void;
  onGPSLocation: (coords: { latitude: number; longitude: number }) => void;
}

export default function LocationSelector({ onLocationSelect, onGPSLocation }: LocationSelectorProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/api/locations`);
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      fetchLocations();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/api/locations/search/${query}`);
      setLocations(response.data);
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        onGPSLocation(coords);
        setGpsLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please select manually.');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocations(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        📍 Select Your Location
      </h3>
      
      <div className="space-y-4">
        {/* GPS Location Button */}
        <button
          onClick={getCurrentLocation}
          disabled={gpsLoading}
          className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {gpsLoading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <MapPin className="h-5 w-5" />
          )}
          <span>{gpsLoading ? 'Getting Location...' : 'Use Current Location (GPS)'}</span>
        </button>

        <div className="text-center text-gray-500">or</div>

        {/* Manual Location Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by district, city, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Location Results */}
        {loading ? (
          <div className="text-center py-4">
            <Loader className="h-6 w-6 animate-spin mx-auto text-gray-400" />
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
            {locations.length > 0 ? (
              locations.map((location) => (
                <button
                  key={location._id}
                  onClick={() => handleLocationSelect(location)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                    selectedLocation?._id === location._id ? 'bg-green-50 border-green-200' : ''
                  }`}
                >
                  <div className="font-medium text-gray-900">
                    {location.district}, {location.city}
                  </div>
                  <div className="text-sm text-gray-500">
                    {location.state}, {location.country}
                    {location.climate && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {location.climate}
                      </span>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                {searchTerm ? 'No locations found for your search' : 'No locations available'}
              </div>
            )}
          </div>
        )}

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800">Selected Location:</h4>
            <p className="text-green-700">
              {selectedLocation.district}, {selectedLocation.city}, {selectedLocation.state}
            </p>
            {selectedLocation.climate && (
              <p className="text-sm text-green-600 mt-1">
                Climate: {selectedLocation.climate}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}