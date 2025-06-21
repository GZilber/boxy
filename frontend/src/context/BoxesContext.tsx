import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Box } from '../types';
import { TimelineEvent } from '../types/timeline';

type BoxInput = Omit<Box, 'id' | 'createdAt' | 'lastUpdated' | 'timeline'> & {
  pickupTime: string;
};

interface FilterOptions {
  status?: string;
  location?: string;
  // Add more filter options as needed
}

interface BoxesContextType {
  boxes: Box[];
  filteredBoxes: Box[];
  loading: boolean;
  error: string | null;
  addBox: (box: Omit<Box, 'id' | 'createdAt' | 'lastUpdated' | 'timeline'>) => void;
  updateBox: (id: string, updates: Partial<Box>) => void;
  removeBox: (id: string) => void;
  refreshBoxes: () => void;
  setFilter: (filter: FilterOptions) => void;
  currentFilter: FilterOptions;
}

const BoxesContext = createContext<BoxesContextType | undefined>(undefined);

export const BoxesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [filteredBoxes, setFilteredBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<FilterOptions>({});

  // Mock data for development
  const mockBoxes: Box[] = [
    {
      id: '1',
      name: 'Winter Clothes',
      size: 'medium',
      status: 'stored',
      location: 'Warehouse A',
      locationId: 'warehouse-a',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date('2025-01-15').toISOString(),
      pickupTime: '2025-01-15T10:00:00Z',
      description: 'Winter jackets and sweaters',
      weight: 5.5,
      value: 250,
      trackingNumber: 'TRK12345678',
      ownerId: "1", // Added ownerId
      availableForPickup: false,
      timeline: [
        {
          status: 'stored',
          time: new Date('2025-01-15').toISOString(),
          location: 'Warehouse A',
          locationId: 'warehouse-a',
          details: 'Box stored in warehouse'
        }
      ]
    } as Box,
    {
      id: '2',
      name: 'Books Collection',
      size: 'large',
      status: 'transit',
      location: 'In Transit',
      locationId: 'in-transit',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date('2025-02-20').toISOString(),
      pickupTime: '2025-02-20T14:30:00Z',
      description: 'Personal book collection',
      weight: 8.2,
      value: 150,
      trackingNumber: 'TRK23456789',
      estimatedDelivery: '2025-06-01T12:00:00Z',
      ownerId: "1", // Added ownerId
      courierName: 'John Doe',
      courierPhone: '+1234567890',
      availableForPickup: true,
      lastLocation: {
        lat: 37.7749,
        lng: -122.4194
      },
      timeline: [
        {
          status: 'stored',
          time: new Date('2025-02-19').toISOString(),
          location: 'Warehouse B',
          locationId: 'warehouse-b',
          details: 'Box stored in warehouse'
        },
        {
          status: 'picked_up',
          time: new Date('2025-02-20').toISOString(),
          location: 'Warehouse B',
          locationId: 'warehouse-b',
          details: 'Picked up by courier: John Doe'
        },
        {
          status: 'in_transit',
          time: new Date().toISOString(),
          location: 'In Transit',
          locationId: 'in-transit',
          details: 'On the way to destination'
        }
      ]
    } as Box,
    {
      id: '3',
      name: 'Electronics',
      size: 'small',
      status: 'delivered',
      location: '123 Main St',
      locationId: 'delivered-location',
      lastUpdated: new Date('2025-03-10').toISOString(),
      createdAt: new Date('2025-03-01').toISOString(),
      pickupTime: '2025-03-01T09:15:00Z',
      description: 'Spare electronics and cables',
      weight: 3.1,
      value: 400,
      trackingNumber: 'TRK34567890',
      ownerId: "1", // Added ownerId
      courierName: 'Jane Smith',
      courierPhone: '+1987654321',
      availableForPickup: false,
      lastLocation: {
        lat: 37.7749,
        lng: -122.4194
      },
      timeline: [
        {
          status: 'stored',
          time: new Date('2025-02-28').toISOString(),
          location: 'Warehouse C',
          locationId: 'warehouse-c',
          details: 'Box stored in warehouse'
        },
        {
          status: 'picked_up',
          time: new Date('2025-03-01').toISOString(),
          location: 'Warehouse C',
          locationId: 'warehouse-c',
          details: 'Picked up by courier: Jane Smith'
        },
        {
          status: 'in_transit',
          time: new Date('2025-03-05').toISOString(),
          location: 'In Transit',
          locationId: 'in-transit',
          details: 'On the way to destination'
        },
        {
          status: 'out_for_delivery',
          time: new Date('2025-03-10T09:00:00Z').toISOString(),
          location: 'Local Facility',
          locationId: 'local-facility',
          details: 'Out for delivery with courier: Jane Smith'
        },
        {
          status: 'delivered',
          time: new Date('2025-03-10T14:30:00Z').toISOString(),
          location: '123 Main St',
          locationId: 'delivered-location',
          details: 'Delivered to customer by Jane Smith'
        }
      ]
    } as Box,
    {
      id: '4',
      name: 'Kitchenware',
      size: 'medium',
      status: 'processing',
      location: 'Processing Center',
      locationId: 'processing-center',
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      pickupTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      description: 'Kitchen utensils and small appliances',
      weight: 6.8,
      value: 320,
      trackingNumber: 'TRK45678901',
      ownerId: "1", // Added ownerId
      availableForPickup: false,
      timeline: [
        {
          status: 'processing',
          time: new Date().toISOString(),
          location: 'Processing Center',
          locationId: 'processing-center',
          details: 'Box is being processed for storage'
        }
      ]
    } as Box
  ];

  const applyFilters = (boxesToFilter: Box[], filter: FilterOptions) => {
    return boxesToFilter.filter(box => {
      if (filter.status && box.status !== filter.status) {
        return false;
      }
      if (filter.location && box.location !== filter.location) {
        return false;
      }
      return true;
    });
  };

  const loadBoxes = useCallback(async () => {
    setLoading(true);
    try {
      const loadedBoxes = mockBoxes;
      setBoxes(loadedBoxes);
      setFilteredBoxes(applyFilters(loadedBoxes, currentFilter));
      setError(null);
    } catch (err) {
      console.error('Failed to load boxes:', err);
      setError('Failed to load boxes. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentFilter]);

  useEffect(() => {
    setFilteredBoxes(applyFilters(boxes, currentFilter));
  }, [currentFilter, boxes]);

  useEffect(() => {
    loadBoxes();
  }, [loadBoxes]);

  const addBox = (boxData: Omit<Box, 'id' | 'createdAt' | 'lastUpdated' | 'timeline'>) => {
    // Ensure locationId is provided or use a default
    const boxWithLocation = {
      ...boxData,
      locationId: (boxData as any).locationId || 'default-location'
    };
    
    const newBox: Box = {
      ...boxWithLocation,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      timeline: [] // Add empty timeline array
    } as Box;
    
    setBoxes(prev => [...prev, newBox]);
  };

  const updateBox = (id: string, updates: Partial<Box>) => {
    setBoxes(prevBoxes =>
      prevBoxes.map(box => {
        if (box.id === id) {
          // Create a new object with the updates
          const updatedBox = { 
            ...box, 
            ...updates, 
            lastUpdated: new Date().toISOString() 
          } as Box;
          return updatedBox;
        }
        return box;
      })
    );
  };

  const removeBox = (id: string) => {
    setBoxes(prev => prev.filter(box => box.id !== id));
  };

  const setFilter = (filter: FilterOptions) => {
    setCurrentFilter(filter);
  };

  const value = {
    boxes,
    filteredBoxes,
    loading,
    error,
    addBox,
    updateBox,
    removeBox,
    refreshBoxes: loadBoxes,
    setFilter,
    currentFilter,
  };

  return (
    <BoxesContext.Provider value={value}>
      {children}
    </BoxesContext.Provider>
  );
};

export const useBoxes = (): BoxesContextType => {
  const context = useContext(BoxesContext);
  if (context === undefined) {
    throw new Error('useBoxes must be used within a BoxesProvider');
  }
  return context;
};
