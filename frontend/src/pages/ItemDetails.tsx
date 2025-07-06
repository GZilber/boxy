import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiClock, 
  FiMapPin, 
  FiTag, 
  FiCalendar, 
  FiPackage, 
  FiTruck, 
  FiCheckCircle,
  FiAlertTriangle,
  FiEdit2,
  FiTrash2,
  FiDownload
} from 'react-icons/fi';
import styles from '../styles/ItemDetails.module.css';

// Define the ItemStatus type
type ItemStatus = 'stored' | 'in_transit' | 'delivered' | 'requested';

// Define the Item interface
interface Item {
  id: string;
  name: string;
  description: string;
  status: ItemStatus;
  location: string;
  category: string;
  lastUpdated: string;
  estimatedDelivery?: string;
  image: string;
  tags: string[];
  history?: ItemHistory[];
}

interface ItemHistory {
  id: string;
  date: string;
  status: ItemStatus;
  location: string;
  description: string;
  actor?: string;
}

// Mock function to fetch item details - in a real app, this would be an API call
const fetchItemDetails = async (id: string): Promise<Item | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock data - in a real app, this would come from your API
  const mockItems: Record<string, Item> = {
    'item-1': {
      id: 'item-1',
      name: 'Winter Clothes',
      description: 'A collection of winter clothing including jackets, sweaters, and accessories. All items are in good condition and properly stored in vacuum-sealed bags to save space.',
      status: 'stored',
      location: 'Main Storage - Aisle 3, Shelf 2',
      category: 'Clothing',
      lastUpdated: '2023-10-15T10:30:00Z',
      image: 'https://images.unsplash.com/photo-1441984907736-74b301e92b5c?w=800&auto=format&fit=crop',
      tags: ['seasonal', 'clothing', 'winter'],
      history: [
        {
          id: 'event-1',
          date: '2023-10-15T10:30:00Z',
          status: 'stored',
          location: 'Main Storage',
          description: 'Item stored in climate-controlled section',
          actor: 'John D.'
        },
        {
          id: 'event-2',
          date: '2023-10-14T15:45:00Z',
          status: 'in_transit',
          location: 'In Transit',
          description: 'Picked up from residence',
          actor: 'Sarah M.'
        }
      ]
    },
    'item-2': {
      id: 'item-2',
      name: 'Camping Gear',
      description: 'Complete camping set including a 4-person tent, sleeping bags, portable stove, and cooking equipment. All items are clean and in good working condition.',
      status: 'stored',
      location: 'Outdoor Section - Aisle 5, Bin 12',
      category: 'Outdoor',
      lastUpdated: '2023-09-20T14:15:00Z',
      image: 'https://images.unsplash.com/photo-1537905569824-f89f14f79587?w=800&auto=format&fit=crop',
      tags: ['outdoor', 'recreational', 'camping'],
      history: [
        {
          id: 'event-1',
          date: '2023-09-20T14:15:00Z',
          status: 'stored',
          location: 'Outdoor Section',
          description: 'Item stored in outdoor equipment section',
          actor: 'Mike R.'
        }
      ]
    },
    'item-5': {
      id: 'item-5',
      name: 'Vintage Records Collection',
      description: 'Collection of 45 vintage vinyl records from the 60s-80s. Includes classic rock, jazz, and blues albums. All records are in protective sleeves and stored in a temperature-controlled environment.',
      status: 'in_transit',
      location: 'In Transit',
      category: 'Collectibles',
      lastUpdated: '2023-11-25T11:10:00Z',
      estimatedDelivery: '2023-12-05T18:00:00Z',
      image: 'https://images.unsplash.com/photo-1505740429378-9f1cfde2f1d8?w=800&auto=format&fit=crop',
      tags: ['collectibles', 'music', 'vintage'],
      history: [
        {
          id: 'event-1',
          date: '2023-11-25T11:10:00Z',
          status: 'in_transit',
          location: 'In Transit',
          description: 'Item picked up for delivery',
          actor: 'Delivery Team'
        },
        {
          id: 'event-2',
          date: '2023-09-15T09:20:00Z',
          status: 'stored',
          location: 'Climate-Controlled Vault',
          description: 'Item stored in temperature and humidity controlled environment',
          actor: 'Alex T.'
        }
      ]
    }
  };

  return mockItems[id] || null;
};

const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItem = async () => {
      if (!id) {
        setError('No item ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchItemDetails(id);
        if (!data) {
          setError('Item not found');
        } else {
          setItem(data);
        }
      } catch (err) {
        console.error('Error fetching item details:', err);
        setError('Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  const getStatusDetails = (status: ItemStatus) => {
    const statuses = {
      stored: { 
        label: 'In Storage', 
        color: '#4CAF50', 
        bg: 'rgba(76, 175, 80, 0.1)',
        icon: <FiPackage size={18} />
      },
      in_transit: { 
        label: 'In Transit', 
        color: '#2196F3', 
        bg: 'rgba(33, 150, 243, 0.1)',
        icon: <FiTruck size={18} />
      },
      delivered: { 
        label: 'Delivered', 
        color: '#9C27B0', 
        bg: 'rgba(156, 39, 176, 0.1)',
        icon: <FiCheckCircle size={18} />
      },
      requested: { 
        label: 'Requested', 
        color: '#FF9800', 
        bg: 'rgba(255, 152, 0, 0.1)',
        icon: <FiClock size={18} />
      }
    };
    
    return statuses[status] || { 
      label: status, 
      color: '#666', 
      bg: 'rgba(0, 0, 0, 0.05)',
      icon: <FiAlertTriangle size={18} />
    };
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatRelativeDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks === 1) return '1 week ago';
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths === 1) return '1 month ago';
    if (diffInMonths < 12) return `${diffInMonths} months ago`;
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
  };

  const handleRequestItem = () => {
    // In a real app, this would open a request form or flow
    console.log('Requesting item:', item?.id);
    // For now, just show an alert
    alert(`Request submitted for ${item?.name}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className={styles.errorContainer}>
        <FiAlertTriangle size={48} className={styles.errorIcon} />
        <h2>Item Not Found</h2>
        <p>We couldn't find the item you're looking for.</p>
        <button 
          onClick={() => navigate(-1)} 
          className={styles.backButton}
        >
          <FiArrowLeft /> Back to My Storage
        </button>
      </div>
    );
  }

  const statusInfo = getStatusDetails(item.status);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button 
          onClick={() => navigate(-1)} 
          className={styles.backButton}
        >
          <FiArrowLeft /> Back
        </button>
        <div className={styles.headerActions}>
          <button className={styles.actionButton}>
            <FiEdit2 size={20} />
          </button>
          <button className={styles.actionButton}>
            <FiTrash2 size={20} />
          </button>
        </div>
      </div>

      {/* Item Image */}
      <div className={styles.imageContainer}>
        <img 
          src={item.image} 
          alt={item.name} 
          className={styles.itemImage}
        />
      </div>

      {/* Item Details */}
      <div className={styles.detailsContainer}>
        <div className={styles.statusBadge} style={{ 
          backgroundColor: statusInfo.bg,
          color: statusInfo.color,
          borderColor: statusInfo.color
        }}>
          {statusInfo.icon}
          <span>{statusInfo.label}</span>
        </div>

        <h1 className={styles.itemName}>{item.name}</h1>
        <p className={styles.itemDescription}>{item.description}</p>

        <div className={styles.metaSection}>
          <h3>Details</h3>
          <div className={styles.metaItem}>
            <FiMapPin className={styles.metaIcon} />
            <div>
              <div className={styles.metaLabel}>Location</div>
              <div className={styles.metaValue}>{item.location}</div>
            </div>
          </div>
          
          <div className={styles.metaItem}>
            <FiTag className={styles.metaIcon} />
            <div>
              <div className={styles.metaLabel}>Category</div>
              <div className={styles.metaValue}>{item.category}</div>
            </div>
          </div>
          
          <div className={styles.metaItem}>
            <FiCalendar className={styles.metaIcon} />
            <div>
              <div className={styles.metaLabel}>Last Updated</div>
              <div className={styles.metaValue}>
                {formatDate(item.lastUpdated)}
                <span className={styles.relativeDate}>({formatRelativeDate(item.lastUpdated)})</span>
              </div>
            </div>
          </div>

          {item.estimatedDelivery && (
            <div className={styles.metaItem}>
              <FiClock className={styles.metaIcon} />
              <div>
                <div className={styles.metaLabel}>Estimated Delivery</div>
                <div className={styles.metaValue}>
                  {formatDate(item.estimatedDelivery)}
                  <span className={styles.relativeDate}>(in {formatRelativeDate(item.estimatedDelivery)})</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className={styles.tagsSection}>
            <h3>Tags</h3>
            <div className={styles.tagsContainer}>
              {item.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        {item.history && item.history.length > 0 && (
          <div className={styles.historySection}>
            <h3>Item History</h3>
            <div className={styles.timeline}>
              {item.history.map((event, index) => {
                const eventStatus = getStatusDetails(event.status);
                return (
                  <div key={event.id} className={styles.timelineItem}>
                    <div className={styles.timelineDot} style={{ backgroundColor: eventStatus.color }}></div>
                    {index < item.history!.length - 1 && (
                      <div className={styles.timelineLine}></div>
                    )}
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <span className={styles.timelineTitle} style={{ color: eventStatus.color }}>
                          {eventStatus.label}
                        </span>
                        <span className={styles.timelineDate}>
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <p className={styles.timelineDescription}>{event.description}</p>
                      {event.actor && (
                        <div className={styles.timelineActor}>
                          <span className={styles.actorBadge}>
                            {event.actor}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className={styles.actionBar}>
        <button 
          className={styles.primaryButton}
          onClick={handleRequestItem}
          disabled={item.status === 'in_transit'}
        >
          <FiDownload size={20} />
          {item.status === 'stored' ? 'Request Item' : 
           item.status === 'in_transit' ? 'Item in Transit' : 
           item.status === 'delivered' ? 'Item Delivered' : 'Request Item'}
        </button>
      </div>
    </div>
  );
};

export default ItemDetails;
