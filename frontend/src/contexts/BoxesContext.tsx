import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import type { Box, CreateBoxInput, UpdateBoxInput } from '../types/box';
import { useAuth } from './AuthContext';

interface BoxesContextType {
  boxes: Box[];
  loading: boolean;
  error: string | null;
  fetchBoxes: () => Promise<void>;
  updateBox: (id: string, updates: UpdateBoxInput) => Promise<boolean>;
  createBox: (box: CreateBoxInput) => Promise<Box>;
  deleteBox: (id: string) => Promise<boolean>;
}

const BoxesContext = createContext<BoxesContextType | undefined>(undefined);

export function BoxesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  console.log('BoxesProvider initializing. User:', user ? `ID: ${user.id}` : 'No user');
  
  const [boxes, setBoxes] = React.useState<Box[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const fetchBoxes = useCallback(async (): Promise<void> => {
    console.log('=== FETCH BOXES CALLED ===');
    console.log('Current user ID:', user?.id);
    
    if (!user?.id) {
      console.log('No user ID available, skipping fetchBoxes');
      setBoxes([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Generating dummy boxes for user:', user.id);
      // Simulate API call with dummy data
      console.log('Creating dummy boxes...');
      const dummyBoxes: Box[] = [
        {
          id: '1',
          name: 'Winter Clothes',
          size: 'medium',
          status: 'stored',
          location: 'Rothschild Storage',
          locationId: 'tlv-rs-123',
          ownerId: user.id,
          description: 'Winter jackets and sweaters',
          contents: ['Winter jacket', 'Sweaters', 'Scarves'],
          value: 300,
          weight: 5,
          trackingNumber: 'TRK123456',
          timeline: [
            {
              status: 'stored',
              time: new Date().toISOString(),
              location: 'Rothschild Storage',
              details: 'Box stored in Rothschild facility',
            }
          ],
          pickupTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          lastUpdated: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Summer Clothes',
          size: 'large',
          status: 'stored',
          location: 'Dizengoff Storage',
          locationId: 'tlv-dz-456',
          ownerId: user.id,
          description: 'Summer t-shirts and shorts',
          contents: ['T-shirts', 'Shorts', 'Swimwear'],
          value: 200,
          weight: 4,
          trackingNumber: 'TRK789012',
          timeline: [
            {
              status: 'stored',
              time: new Date().toISOString(),
              location: 'Dizengoff Storage',
              details: 'Box stored in Dizengoff facility',
            }
          ],
          pickupTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          lastUpdated: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Electronics',
          size: 'small',
          status: 'transit',
          location: 'In Transit',
          locationId: 'tlv-tr-789',
          ownerId: user.id,
          description: 'Laptop and accessories',
          contents: ['Laptop', 'Charger', 'Mouse'],
          value: 1500,
          weight: 3,
          trackingNumber: 'TRK345678',
          timeline: [
            {
              status: 'transit',
              time: new Date(Date.now() - 3600000).toISOString(),
              location: 'Distribution Center',
              details: 'Out for delivery',
            }
          ],
          pickupTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          lastUpdated: new Date().toISOString(),
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      console.log('Dummy boxes created for user:', user.id, dummyBoxes);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('=== GENERATED DUMMY BOXES ===');
      console.log('Boxes count:', dummyBoxes.length);
      console.log('Boxes data:', JSON.stringify(dummyBoxes, null, 2));
      
      setBoxes(dummyBoxes);
      
      // Log the current state after setting
      console.log('Boxes state after setBoxes:', {
        boxesCount: dummyBoxes.length,
        user: user.id,
        loading: false,
        error: null
      });
      
      console.log('Boxes state updated with dummy data');
    } catch (err) {
      console.error('Failed to fetch boxes:', err);
      setError('Failed to fetch boxes');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const updateBox = useCallback(async (id: string, updates: UpdateBoxInput) => {
    try {
      setBoxes(prev => {
        const updatedBoxes = prev.map(box => {
          if (box.id === id) {
            // Preserve required fields that shouldn't be overridden
            const { id: _, ...safeUpdates } = updates;
            
            // Handle timeline updates - merge with existing timeline
            const timelineUpdates = safeUpdates.timeline || [];
            const existingTimeline = box.timeline || [];
            
            return { 
              ...box, 
              ...safeUpdates,
              // Only update timeline if new events are provided
              ...(timelineUpdates.length > 0 && {
                timeline: [...existingTimeline, ...timelineUpdates]
              }),
              lastUpdated: new Date().toISOString() 
            };
          }
          return box;
        });
        
        console.log('Updated boxes:', updatedBoxes);
        return updatedBoxes;
      });
      
      return true;
    } catch (err) {
      console.error('Failed to update box:', err);
      setError('Failed to update box');
      throw err;
    }
  }, []);

  interface CreateBoxInput {
    name: string;
    size: string;
    location: string;
    description: string;
    contents: string | string[];
    value?: number;
    weight?: number;
    customFields?: Record<string, any>;
  }

  const createBox = useCallback(async (boxData: CreateBoxInput) => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      // Create a new box with all required properties
      const newBox: Box = {
        id: Math.random().toString(36).substr(2, 9),
        locationId: 'default-location',
        ownerId: user.id,
        status: 'stored',
        trackingNumber: `TRK${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        value: boxData.value || 0,
        weight: boxData.weight || 0,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        timeline: [
          {
            status: 'stored',
            time: new Date().toISOString(),
            location: boxData.location || 'Default Location',
            details: 'Box created and stored',
          },
        ],
        pickupTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        // Add any missing required fields with default values
        customFields: boxData.customFields || {},
        name: boxData.name,
        size: boxData.size,
        location: boxData.location,
        description: boxData.description,
        contents: boxData.contents,
      };
      setBoxes(prev => [...prev, newBox]);
      return newBox;
    } catch (err) {
      setError('Failed to create box');
      throw err;
    }
  }, []);

  const deleteBox = useCallback(async (id: string): Promise<boolean> => {
    try {
      setBoxes(prev => prev.filter(box => box.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete box');
      return false;
    }
  }, []);

  // Automatically fetch boxes when the component mounts or when the user changes
  React.useEffect(() => {
    console.log('BoxesProvider - Checking authentication state:', { 
      hasUser: !!user, 
      userId: user?.id 
    });
    
    const loadBoxes = async () => {
      if (user?.id) {
        console.log('User authenticated, fetching boxes...');
        try {
          await fetchBoxes();
        } catch (error) {
          console.error('Error loading boxes:', error);
          setError('Failed to load boxes');
        }
      } else {
        console.log('No user or user not authenticated, clearing boxes');
        setBoxes([]);
      }
    };
    
    loadBoxes();
  }, [user?.id, fetchBoxes]);

  return (
    <BoxesContext.Provider 
      value={{ 
        boxes, 
        loading, 
        error, 
        fetchBoxes, 
        updateBox, 
        createBox, 
        deleteBox 
      }}
    >
      {children}
    </BoxesContext.Provider>
  );
}

export function useBoxes() {
  const context = useContext(BoxesContext);
  if (context === undefined) {
    throw new Error('useBoxes must be used within a BoxesProvider');
  }
  return context;
}
