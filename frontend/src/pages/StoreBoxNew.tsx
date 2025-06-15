import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMapPin, FiClock, FiPackage, FiSearch, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { useBoxes } from '../context/BoxesContext';
import BoxYLogo from '../components/BoxYLogo';
import { Box } from '../types';
import { TimelineEvent } from '../types/timeline';
import styles from './StoreBoxNew.module.css';

// Define BoxInput type that matches what the context expects
type BoxInput = {
  id: string;
  name: string;
  size: 'small' | 'medium' | 'large' | 'xl';
  status: 'stored' | 'transit' | 'delivered' | 'processing';
  location: string;
  lastUpdated: string;
  createdAt: string;
  description: string;
  weight: number;
  value: number;
  trackingNumber: string;
  estimatedDelivery?: string;
  notes?: string;
  pickupTime: string;
  timeline: TimelineEvent[];
};

interface StorageLocation {
  id: string;
  name: string;
  address: string;
  distance: string;
  time: string;
  availableSpots: number;
  pricePerMonth: number;
  image: string;
  rating: number;
  isOpen: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface LocationState {
  id: string;
  name: string;
  address: string;
  distance: string;
  time: string;
  availableSpots: number;
  pricePerMonth: number;
  image: string;
  rating: number;
  isOpen: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const StoreBox: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addBox } = useBoxes();
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<LocationState | null>(null);
  const [boxName, setBoxName] = useState('');
  const [boxDescription, setBoxDescription] = useState('');
  const [boxSize, setBoxSize] = useState<'small' | 'medium' | 'large' | 'xl'>('medium');
  const [boxWeight, setBoxWeight] = useState<number>(5);
  const [boxValue, setBoxValue] = useState<number>(100);
  const [boxNotes, setBoxNotes] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Get location from state if coming from StorageLocations
  useEffect(() => {
    if (location.state) {
      const state = location.state as LocationState;
      setSelectedLocation(state);
      setCurrentStep(2);
    }
  }, [location.state]);

  // Mock data for storage locations
  const [locations] = useState<StorageLocation[]>([
    {
      id: '1',
      name: 'BoxY Downtown',
      address: '123 Storage Way, Business District',
      distance: '0.8 km',
      time: '5 min',
      availableSpots: 8,
      pricePerMonth: 89,
      image: '/images/boxy-logo.png',
      rating: 4.8,
      isOpen: true,
      coordinates: { lat: 32.0853, lng: 34.7818 }
    },
    {
      id: '2',
      name: 'BoxY Metro',
      address: '456 Storage Ave, Downtown',
      distance: '1.2 km',
      time: '7 min',
      availableSpots: 5,
      pricePerMonth: 79,
      image: '/images/boxy-logo.png',
      rating: 4.9,
      isOpen: true,
      coordinates: { lat: 32.0753, lng: 34.7918 }
    },
    {
      id: '3',
      name: 'BoxY Uptown',
      address: '789 Storage Blvd, Uptown',
      distance: '1.8 km',
      time: '10 min',
      availableSpots: 3,
      pricePerMonth: 69,
      image: '/images/boxy-logo.png',
      rating: 4.7,
      isOpen: true,
      coordinates: { lat: 32.0953, lng: 34.7718 }
    },
  ]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location: ", error);
          setIsLoading(false);
        }
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = useCallback((location: StorageLocation) => {
    setSelectedLocation(prev => prev?.id === location.id ? null : location);
  }, []);

  const handleStoreBox = useCallback(() => {
    if (!selectedLocation || !boxName.trim()) return;
    
    const newBox: BoxInput = {
      id: uuidv4(),
      name: boxName,
      size: boxSize,
      status: 'stored',
      location: selectedLocation.name,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      description: boxDescription || 'No description provided',
      weight: 0,
      value: 0,
      trackingNumber: `BOX-${Math.floor(100000 + Math.random() * 900000)}`,
      pickupTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      timeline: [{
        status: 'stored',
        time: new Date().toISOString(),
        location: selectedLocation.name,
        details: 'Box stored in facility'
      }]
    };
    
    addBox(newBox);
    navigate('/my-boxes');
  }, [selectedLocation, boxName, boxDescription, boxSize, addBox, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => selectedLocation ? setSelectedLocation(null) : navigate(-1)}
            className="text-primary-500 p-2 rounded-full hover:bg-gray-100"
          >
            <FiArrowLeft size={24} />
          </button>
          <BoxYLogo size={40} showText={true} />
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </div>
      
      <main className="max-w-4xl mx-auto p-4">
        {!selectedLocation ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Find a Storage Location</h1>
              <p className="text-gray-600">Select a location to store your box</p>
            </div>
            
            <div className="mb-6">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredLocations.map((location) => (
                <div 
                  key={location.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-primary-200 transition-colors cursor-pointer"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{location.name}</h3>
                      <p className="text-sm text-gray-600">{location.address}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <FiMapPin className="mr-1" />
                        <span>{location.distance} away</span>
                        <span className="mx-2">•</span>
                        <FiClock className="mr-1" />
                        <span>{location.time} walk</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">${location.pricePerMonth}<span className="text-sm font-normal text-gray-500">/mo</span></div>
                      <div className="text-sm text-green-600">{location.availableSpots} spots left</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-6">Store a New Box</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Box Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="E.g., Winter Clothes, Books, etc."
                  value={boxName}
                  onChange={(e) => setBoxName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Add any details about the box contents..."
                  value={boxDescription}
                  onChange={(e) => setBoxDescription(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Box Size</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'small', label: 'Small', description: 'Up to 10kg' },
                    { value: 'medium', label: 'Medium', description: 'Up to 20kg' },
                    { value: 'large', label: 'Large', description: 'Up to 30kg' },
                  ].map((size) => (
                    <button
                      key={size.value}
                      type="button"
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        boxSize === size.value
                          ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setBoxSize(size.value as 'small' | 'medium' | 'large')}
                    >
                      <div className="font-medium">{size.label}</div>
                      <div className="text-sm text-gray-500 mt-1">{size.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Storage Location</h3>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="font-medium">{selectedLocation.name}</div>
                  <div className="text-sm text-gray-600">{selectedLocation.address}</div>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <FiMapPin className="mr-1" />
                    <span>{selectedLocation.distance} away</span>
                    <span className="mx-2">•</span>
                    <FiClock className="mr-1" />
                    <span>{selectedLocation.time} walk</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleStoreBox}
                disabled={!boxName.trim()}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center ${
                  boxName.trim()
                    ? 'bg-primary-500 hover:bg-primary-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <FiPackage className="mr-2" />
                Store My Box
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StoreBox;
