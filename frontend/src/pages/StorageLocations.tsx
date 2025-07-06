import { Search, Star, Loader2, Move } from 'lucide-react';
import { FiArrowLeft } from 'react-icons/fi';
import { MapPinIcon, BoxWithArrowIcon, StorageIcon, InfoIcon } from '../components/icons';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BoxSelectionModal from '../components/BoxSelectionModal';
import { useBoxes } from '../contexts/BoxesContext';
import type { Box } from '../types/box';
import type { CreateCourierRequestInput } from '../types/courier';
import styles from './StorageLocations.module.css';
import { v4 as uuidv4 } from 'uuid';

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
  availableSpace: number;
  pricePerDay: number;
}

const sampleLocations: StorageLocation[] = [
  {
    id: 'warehouse-a',
    name: 'Downtown Storage',
    address: '123 Main St, New York, NY',
    distance: '0.5 miles',
    time: '5 min',
    availableSpots: 12,
    pricePerMonth: 29.99,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.7,
    isOpen: true,
    coordinates: { lat: 40.7128, lng: -74.0060 },
    availableSpace: 10,
    pricePerDay: 2.99,
  },
  {
    id: 'warehouse-b',
    name: 'Uptown Storage',
    address: '456 Park Ave, New York, NY',
    distance: '1.2 miles',
    time: '8 min',
    availableSpots: 8,
    pricePerMonth: 34.99,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.5,
    isOpen: true,
    coordinates: { lat: 40.7580, lng: -73.9855 },
    availableSpace: 5,
    pricePerDay: 3.49,
  },
  {
    id: 'warehouse-c',
    name: 'Central Storage',
    address: '789 Broadway, New York, NY',
    distance: '0.8 miles',
    time: '6 min',
    availableSpots: 0,
    pricePerMonth: 27.99,
    image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.3,
    isOpen: true,
    coordinates: { lat: 40.7328, lng: -73.9872 },
    availableSpace: 0,
    pricePerDay: 2.49,
  },
];

const StorageLocations: React.FC = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'hasSpace'>('all');
  const [filteredLocations, setFilteredLocations] = useState<StorageLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<StorageLocation | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedBoxes, setSelectedBoxes] = useState<string[]>([]);
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);
  const [isMovingBoxes, setIsMovingBoxes] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { boxes, updateBox } = useBoxes();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!searchQuery && filterType === 'all') {
      setFilteredLocations(sampleLocations);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = sampleLocations.filter((location) => {
      const matchesSearch = location.name.toLowerCase().includes(query) || location.address.toLowerCase().includes(query);

      if (filterType === 'hasSpace') {
        return matchesSearch && location.availableSpace > 0;
      }

      return matchesSearch;
    });

    setFilteredLocations(filtered);
  }, [searchQuery, filterType]);

  const handleLocationSelect = useCallback((location: StorageLocation) => {
    setSelectedLocation(location);
    setIsMoveModalOpen(true);
  }, []);

  const handleBoxSelect = useCallback((boxId: string) => {
    setSelectedBoxes((prev) => (prev.includes(boxId) ? prev.filter((id) => id !== boxId) : [...prev, boxId]));
  }, []);

  const handleMoveBoxes = useCallback(async (request: CreateCourierRequestInput) => {
    if (!selectedLocation) return;
    
    setIsMovingBoxes(true);
    try {
      console.log('Moving boxes to location:', selectedLocation.id, 'with request:', request);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccess(true);
      handleCloseModal();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error moving boxes:', error);
    } finally {
      setIsMovingBoxes(false);
    }
  }, [selectedLocation]);

  const handleCloseModal = useCallback(() => {
    setIsMoveModalOpen(false);
    setSelectedLocation(null);
    setSelectedBoxes([]);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.loadingSpinner} size={32} />
        <p>Loading locations...</p>
      </div>
    );
  }

  const availableBoxes = boxes.filter((box: Box) => box.status === 'stored');

  return (
    <div className={styles.pageContainer}>
      <div className={styles.step}>
        <div className={styles.stepHeader}>
          <h2>Storage Locations</h2>
          <p>Choose a storage location for your items</p>
        </div>

      {isMoveModalOpen && selectedLocation && (
        <BoxSelectionModal
          isOpen={isMoveModalOpen}
          onClose={handleCloseModal}
          onMove={handleMoveBoxes}
          boxes={availableBoxes}
          selectedBoxes={selectedBoxes}
          onBoxSelect={handleBoxSelect}
          locationName={selectedLocation?.name || ''}
          locationAddress={selectedLocation?.address || ''}
        />
      )}

      {showSuccess && (
        <div className={styles.successOverlay}>
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <div>Boxes moved successfully!</div>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search storage locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className={`${styles.filterButton} ${filterType === 'hasSpace' ? styles.active : ''}`}
            onClick={() => setFilterType('hasSpace')}
          >
            Has Space
          </button>
        </div>

        {filteredLocations.length > 0 ? (
          <div className={styles.locationsGrid}>
            {filteredLocations.map((location) => (
              <div key={location.id} className={styles.locationCard}>
                <img 
                  src={location.image} 
                  alt={location.name} 
                  className={styles.locationImage} 
                />
                <div className={styles.locationContent}>
                  <div className={styles.locationHeader}>
                    <h3 className={styles.locationName}>{location.name}</h3>
                    <span className={styles.locationRating}>
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      {location.rating}
                    </span>
                  </div>
                  
                  <div className={styles.locationInfo}>
                    <div className={styles.locationDetail}>
                      <MapPinIcon size={16} className={styles.locationIcon} />
                      <span>{location.address}</span>
                    </div>
                    <div className={styles.locationMeta}>
                      <span className={styles.metaItem}>
                        <InfoIcon size={14} className={styles.metaIcon} />
                        {location.availableSpots} spots available
                      </span>
                      <span className={styles.metaItem}>
                        <MapPinIcon size={14} className={styles.metaIcon} />
                        {location.distance} • {location.time} away
                      </span>
                    </div>

                  </div>

                  <div className={styles.locationAction}>
                    <button 
                      className={`${styles.actionButton} ${!location.isOpen || location.availableSpots === 0 ? styles.disabled : ''}`}
                      onClick={() => location.isOpen && location.availableSpots > 0 && handleLocationSelect(location)}
                      disabled={!location.isOpen || location.availableSpots === 0}
                    >
                      <BoxWithArrowIcon size={18} className="mr-2" />
                      {location.availableSpots > 0 ? 'Move Boxes Here' : 'No Space Available'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <h3>No locations found</h3>
            <p>Try adjusting your search or filters</p>
            <button
              className={styles.actionButton}
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className={styles.bottomNav}>
        <button
          onClick={() => navigate('/dashboard')}
          className={`${styles.navButton} ${styles.backButton}`}
        >
          <FiArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default StorageLocations;
