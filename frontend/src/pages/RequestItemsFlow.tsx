import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AddressStep,
  ScheduleStep,
  ConfirmationStep,
  type Address,
  type Item
} from '../components/flow-steps/FlowSteps';
import { 
  FiPackage, 
  FiMapPin, 
  FiCheck, 
  FiArrowLeft,
  FiTruck,
  FiChevronRight,
  FiSearch,
  FiX,
  FiClock,
  FiCalendar,
  FiPlus,
  FiMinus,
  FiAlertCircle
} from 'react-icons/fi';
import BottomNavigation from '../components/BottomNavigation';
import styles from './RequestItemsFlow.module.css';

interface StoredItem extends Item {
  id: string;
  name: string;
  description: string;
  size: 'small' | 'medium' | 'large';
  storedAt: string;
  location: string;
  image?: string;
  category?: string;
  selected?: boolean;
  quantity?: number;
}

const RequestItemsFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState<StoredItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState<Address | null>(null);
  const [deliveryTime, setDeliveryTime] = useState<string>('asap');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Sample stored items - in a real app, these would come from an API
  const storedItems: StoredItem[] = useMemo(() => [
    {
      id: 'item-1',
      name: 'Winter Clothes',
      description: 'Box of winter clothes and jackets',
      size: 'large',
      storedAt: '2023-10-15',
      location: 'A12-45',
      image: 'https://images.unsplash.com/photo-1441984907736-74b301e92b5c?w=300&auto=format&fit=crop',
      category: 'Clothing',
      quantity: 1
    },
    {
      id: 'item-2',
      name: 'Books Collection',
      description: 'Collection of books and magazines',
      size: 'medium',
      storedAt: '2023-09-20',
      location: 'B07-12',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop',
      category: 'Books',
      quantity: 1
    },
    {
      id: 'item-3',
      name: 'Electronics',
      description: 'Old laptops and tablets',
      size: 'medium',
      storedAt: '2023-11-05',
      location: 'C15-08',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop',
      category: 'Electronics',
      quantity: 1
    },
    {
      id: 'item-4',
      name: 'Camping Gear',
      description: 'Tent, sleeping bags, and cooking equipment',
      size: 'large',
      storedAt: '2023-08-12',
      location: 'D22-19',
      image: 'https://images.unsplash.com/photo-1537905569824-f89f14f79587?w=300&auto=format&fit=crop',
      category: 'Outdoor',
      quantity: 1
    },
    {
      id: 'item-5',
      name: 'Holiday Decorations',
      description: 'Christmas tree, ornaments, and lights',
      size: 'medium',
      storedAt: '2023-12-01',
      location: 'E05-33',
      image: 'https://images.unsplash.com/photo-1512389142860-9c167e6e8f2a?w=300&auto=format&fit=crop',
      category: 'Seasonal',
      quantity: 1
    },
    {
      id: 'item-6',
      name: 'Vintage Records',
      description: 'Collection of vinyl records from the 70s and 80s',
      size: 'small',
      storedAt: '2023-07-18',
      location: 'F14-07',
      image: 'https://images.unsplash.com/photo-1505740429378-9f1cfde2f1d8?w=300&auto=format&fit=crop',
      category: 'Collectibles',
      quantity: 1
    }
  ], []);

  // Sample addresses - in a real app, these would come from the user's profile
  const addresses: Address[] = [
    {
      id: 'address-1',
      name: 'Home',
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      postalCode: '10001',
      isDefault: true,
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 'address-2',
      name: 'Work',
      address: '456 Business Ave',
      city: 'New York',
      country: 'USA',
      postalCode: '10017',
      coordinates: { lat: 40.7505, lng: -73.9766 }
    }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return storedItems.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [storedItems, searchQuery, selectedCategory]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    storedItems.forEach(item => {
      if (item.category) {
        uniqueCategories.add(item.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [storedItems]);

  const toggleItemSelection = useCallback((item: StoredItem) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(i => i.id === item.id);
      if (isSelected) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  }, []);

  const updateItemQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setSelectedItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  }, []);

  const getItemSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return 'Small';
      case 'medium': return 'Medium';
      case 'large': return 'Large';
      default: return size;
    }
  };

  // Calculate total items and estimated delivery time
  const totalItems = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [selectedItems]);

  const getEstimatedDeliveryTime = useCallback((timeOption: string) => {
    const now = new Date();
    switch(timeOption) {
      case 'asap':
        now.setHours(now.getHours() + 2);
        return `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      case 'morning':
        return 'Tomorrow, 9:00 AM - 12:00 PM';
      case 'afternoon':
        return 'Tomorrow, 1:00 PM - 5:00 PM';
      case 'evening':
        return 'Tomorrow, 6:00 PM - 9:00 PM';
      default:
        return 'Within 2 hours';
    }
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!deliveryAddress) {
      setError('Please select a delivery address');
      return;
    }
    
    if (selectedItems.length === 0) {
      setError('Please select at least one item to request');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would call your API here
      console.log('Requesting items:', { 
        items: selectedItems, 
        deliveryAddress, 
        deliveryTime,
        estimatedDelivery: getEstimatedDeliveryTime(deliveryTime)
      });
      
      // Move to confirmation step
      setCurrentStep(4);
    } catch (err) {
      setError('Failed to process your request. Please try again.');
      console.error('Error requesting items:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedItems, deliveryAddress, deliveryTime, getEstimatedDeliveryTime]);

  // Handle navigation between steps
  const handleNext = useCallback(() => {
    if (currentStep === 1 && selectedItems.length === 0) {
      setError('Please select at least one item to continue');
      return;
    }
    
    if (currentStep === 2 && !deliveryAddress) {
      setError('Please select a delivery address');
      return;
    }
    
    setError(null);
    setCurrentStep(prev => Math.min(prev + 1, 4));
  }, [currentStep, selectedItems.length, deliveryAddress]);

  const handleBack = useCallback(() => {
    setError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  // Fix line-clamp CSS lint warning by adding standard property
  const lineClampFix = {
    // This is just to satisfy the linter - the actual CSS is in the module
    display: '-webkit-box',
    WebkitLineClamp: 2,
    lineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <h2>Select Items to Request</h2>
              <p>Choose which items you'd like to have delivered</p>
            </div>
            
            {/* Search and Filter */}
            <div className={styles.searchContainer}>
              <div className={styles.searchBox}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className={styles.clearSearchButton}
                    aria-label="Clear search"
                  >
                    <FiX size={18} />
                  </button>
                )}
              </div>
              
              <div className={styles.categoryFilter}>
                <button
                  className={`${styles.categoryButton} ${!selectedCategory ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All Items
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Selected Items Preview */}
            {selectedItems.length > 0 && (
              <div className={styles.selectedItemsPreview}>
                <h3>Selected Items ({selectedItems.length})</h3>
                <div className={styles.selectedItemsList}>
                  {selectedItems.map(item => (
                    <div key={item.id} className={styles.selectedItem}>
                      <div 
                        className={styles.selectedItemImage} 
                        style={{ backgroundImage: `url(${item.image})` }} 
                      />
                      <div className={styles.selectedItemDetails}>
                        <h4>{item.name}</h4>
                        <div className={styles.quantitySelector}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateItemQuantity(item.id, (item.quantity || 1) - 1);
                            }}
                            className={styles.quantityButton}
                            disabled={(item.quantity || 1) <= 1}
                          >
                            <FiMinus size={14} />
                          </button>
                          <span>{item.quantity || 1}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateItemQuantity(item.id, (item.quantity || 1) + 1);
                            }}
                            className={styles.quantityButton}
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleItemSelection(item);
                        }}
                        className={styles.removeItemButton}
                        aria-label="Remove item"
                      >
                        <FiX size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Items Grid */}
            <div className={styles.itemsGrid}>
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <div 
                    key={item.id} 
                    className={`${styles.itemCard} ${selectedItems.some(i => i.id === item.id) ? styles.selected : ''}`}
                    onClick={() => toggleItemSelection(item)}
                  >
                    <div 
                      className={styles.itemImage}
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className={styles.itemInfo}>
                      <h3>{item.name}</h3>
                      <p className={styles.itemDescription}>{item.description}</p>
                      <div className={styles.itemMeta}>
                        <span className={`${styles.sizeBadge} ${styles[item.size]}`}>
                          {getItemSizeLabel(item.size)}
                        </span>
                        <span className={styles.location}>
                          <FiMapPin size={12} /> {item.location}
                        </span>
                      </div>
                      {item.category && (
                        <span className={styles.categoryBadge}>
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className={styles.checkbox}>
                      {selectedItems.some(i => i.id === item.id) && (
                        <div className={styles.checkmark}>
                          <FiCheck size={18} />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>
                  <FiPackage size={48} className={styles.noResultsIcon} />
                  <h3>No items found</h3>
                  <p>Try adjusting your search or filters</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                    }}
                    className={styles.clearFiltersButton}
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
            
            <div className={styles.buttonGroup}>
              <button 
                className={styles.secondaryButton}
                onClick={() => navigate('/my-boxes')}
              >
                Cancel
              </button>
              <button 
                className={styles.primaryButton}
                onClick={() => setCurrentStep(2)}
                disabled={selectedItems.length === 0}
              >
                Continue to Delivery
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <AddressStep
            addresses={addresses}
            onSelect={(address: Address) => {
              setDeliveryAddress(address);
              setCurrentStep(3);
            }}
            onBack={() => setCurrentStep(1)}
            isPickupFlow={false}
          />
        );
        
      case 3:
        return (
          <ScheduleStep
            selectedTime={deliveryTime}
            onTimeSelect={setDeliveryTime}
            onConfirm={handleSubmit}
            onBack={() => setCurrentStep(2)}
            isLoading={isLoading}
            isPickupFlow={false}
          />
        );
        
      case 4:
        if (!deliveryAddress || selectedItems.length === 0) return null;
        
        return (
          <ConfirmationStep
            item={selectedItems[0]}
            address={deliveryAddress}
            pickupTime={deliveryTime}
            onDone={() => navigate('/my-boxes')}
            isPickupFlow={false}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <button 
          onClick={() => navigate(-1)}
          className={styles.backButton}
        >
          <FiArrowLeft size={20} /> Back
        </button>
        <h2>Request Items</h2>
      </div>
      
      <div className={styles.stepContent}>
        {error && (
          <div className={styles.errorMessage}>
            <FiAlertCircle className={styles.errorIcon} />
            <div className={styles.errorContent}>
              <h4>Error</h4>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {renderStep()}
      </div>
      
      {/* Bottom Navigation */}
      <div className={styles.bottomNav}>
        {currentStep > 1 ? (
          <button 
            onClick={handleBack}
            className={`${styles.navButton} ${styles.backButton}`}
            disabled={isLoading}
          >
            <FiArrowLeft size={18} /> Back
          </button>
        ) : (
          <button
            onClick={() => navigate(-1)}
            className={`${styles.navButton} ${styles.backButton}`}
            disabled={isLoading}
          >
            <FiArrowLeft size={18} /> Back
          </button>
        )}
        
        <button
          onClick={currentStep === 4 ? handleSubmit : handleNext}
          className={`${styles.navButton} ${styles.nextButton}`}
          disabled={isLoading || (currentStep === 1 && selectedItems.length === 0) || 
                   (currentStep === 2 && !deliveryAddress)}
        >
          {currentStep === 4 ? 'Submit Request' : 'Continue'}
          {currentStep < 4 && <FiChevronRight size={18} />}
        </button>
      </div>
      
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
        </div>
      )}
    </div>
  );
};

export default RequestItemsFlow;
