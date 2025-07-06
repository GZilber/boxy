import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiHome,
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiPlus,
  FiClock,
  FiMapPin,
  FiInfo
} from 'react-icons/fi';
import { useBoxes } from '@contexts/BoxesContext';
import styles from '../styles/MyItems.module.css';

// Define the ItemStatus type
type ItemStatus = 'stored' | 'in_transit' | 'delivered' | 'requested';

// Mock item data - in a real app, this would come from your API
const mockItems: Item[] = [
  {
    id: 'item-1',
    name: 'Winter Clothes',
    description: 'Winter jackets, sweaters, and accessories',
    status: 'stored' as ItemStatus,
    location: 'Main Storage',
    category: 'Clothing',
    lastUpdated: '2023-10-15T10:30:00Z',
    image: 'https://images.unsplash.com/photo-1441984907736-74b301e92b5c?w=300&auto=format&fit=crop',
    tags: ['seasonal', 'clothing']
  },
  {
    id: 'item-2',
    name: 'Camping Gear',
    description: 'Tent, sleeping bags, and cooking equipment',
    status: 'stored' as ItemStatus,
    location: 'Outdoor Section',
    category: 'Outdoor',
    lastUpdated: '2023-09-20T14:15:00Z',
    image: 'https://images.unsplash.com/photo-1537905569824-f89f14f79587?w=300&auto=format&fit=crop',
    tags: ['outdoor', 'recreational']
  },
  {
    id: 'item-3',
    name: 'Holiday Decorations',
    description: 'Christmas tree, ornaments, and lights',
    status: 'delivered' as ItemStatus,
    location: 'Home',
    category: 'Seasonal',
    lastUpdated: '2023-12-01T09:45:00Z',
    image: 'https://images.unsplash.com/photo-1512389142860-9c167e6e8f2a?w=300&auto=format&fit=crop',
    tags: ['seasonal', 'decor']
  },
  {
    id: 'item-4',
    name: 'Summer Sports Equipment',
    description: 'Tennis racket, beach volleyball, and snorkeling gear',
    status: 'stored' as ItemStatus,
    location: 'Sports Section',
    category: 'Sports',
    lastUpdated: '2023-08-10T16:20:00Z',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe1954c6?w=300&auto=format&fit=crop',
    tags: ['sports', 'seasonal']
  },
  {
    id: 'item-5',
    name: 'Vintage Records Collection',
    description: 'Classic vinyl records from 60s-80s',
    status: 'in_transit' as ItemStatus,
    location: 'In Transit',
    category: 'Collectibles',
    lastUpdated: '2023-11-25T11:10:00Z',
    estimatedDelivery: '2023-12-05T18:00:00Z',
    image: 'https://images.unsplash.com/photo-1505740429378-9f1cfde2f1d8?w=300&auto=format&fit=crop',
    tags: ['collectibles', 'music']
  }
];

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
}

const MyItems: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // In a real app, this would come from your context/API
  const items: Item[] = mockItems;

  // Filter items by status from URL
  const filteredItems = useMemo<Item[]>(() => {
    let result = [...items];
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(item => item.status === statusFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [items, statusFilter, searchQuery]);

  // Get status details
  const getStatusDetails = (status: ItemStatus) => {
    const statuses = {
      stored: { label: 'In Storage', color: '#4CAF50', bg: 'rgba(76, 175, 80, 0.1)' },
      in_transit: { label: 'In Transit', color: '#2196F3', bg: 'rgba(33, 150, 243, 0.1)' },
      delivered: { label: 'Delivered', color: '#9C27B0', bg: 'rgba(156, 39, 176, 0.1)' },
      requested: { label: 'Requested', color: '#FF9800', bg: 'rgba(255, 152, 0, 0.1)' }
    };
    
    return statuses[status] || { label: status, color: '#666', bg: 'rgba(0, 0, 0, 0.05)' };
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get count of items by status
  const getItemCountByStatus = (status: ItemStatus) => {
    return items.filter(item => item.status === status).length;
  };

  // Render item card for grid view
  const handleItemClick = (item: Item) => {
    navigate(`/item/${item.id}`);
  };

  const renderItemCard = (item: Item) => {
    const statusInfo = getStatusDetails(item.status);
    
    return (
      <div 
        key={item.id} 
        className={styles.itemCard}
        onClick={() => handleItemClick(item)}
      >
        <div className={styles.itemImage} style={{ backgroundImage: `url(${item.image})` }}>
          <div 
            className={styles.statusBadge}
            style={{ 
              backgroundColor: statusInfo.bg,
              color: statusInfo.color,
              borderColor: statusInfo.color
            }}
          >
            {statusInfo.label}
          </div>
        </div>
        
        <div className={styles.itemContent}>
          <h3>{item.name}</h3>
          <p className={styles.itemDescription}>{item.description}</p>
          
          <div className={styles.itemMeta}>
            <div className={styles.metaItem}>
              <FiMapPin size={14} className={styles.metaIcon} />
              <span>{item.location}</span>
            </div>
            <div className={styles.metaItem}>
              <FiClock size={14} className={styles.metaIcon} />
              <span>{formatDate(item.lastUpdated)}</span>
            </div>
            {item.estimatedDelivery && item.status === 'in_transit' && (
              <div className={styles.metaItem}>
                <FiTruck size={14} className={styles.metaIcon} />
                <span>Est. delivery: {formatDate(item.estimatedDelivery)}</span>
              </div>
            )}
          </div>
          
          <div className={styles.itemTags}>
            {item.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render item row for list view
  const renderItemRow = (item: Item) => {
    const statusInfo = getStatusDetails(item.status);
    
    return (
      <div 
        key={item.id} 
        className={styles.itemRow}
        onClick={() => navigate(`/item/${item.id}`)}
      >
        <div 
          className={styles.itemRowImage}
          style={{ backgroundImage: `url(${item.image})` }}
        ></div>
        
        <div className={styles.itemRowContent}>
          <div className={styles.itemRowHeader}>
            <h3>{item.name}</h3>
            <div 
              className={styles.statusBadge}
              style={{ 
                backgroundColor: statusInfo.bg,
                color: statusInfo.color,
                borderColor: statusInfo.color
              }}
            >
              {statusInfo.label}
            </div>
          </div>
          
          <p className={styles.itemRowDescription}>{item.description}</p>
          
          <div className={styles.itemRowMeta}>
            <div className={styles.metaItem}>
              <FiMapPin size={14} className={styles.metaIcon} />
              <span>{item.location}</span>
            </div>
            <div className={styles.metaItem}>
              <FiClock size={14} className={styles.metaIcon} />
              <span>{formatDate(item.lastUpdated)}</span>
            </div>
            {item.estimatedDelivery && item.status === 'in_transit' && (
              <div className={styles.metaItem}>
                <FiTruck size={14} className={styles.metaIcon} />
                <span>Est. delivery: {formatDate(item.estimatedDelivery)}</span>
              </div>
            )}
          </div>
          
          <div className={styles.itemTags}>
            <span className={styles.tag}>{item.category}</span>
            {item.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>My Storage</h1>
          <p className={styles.subtitle}>View and manage your stored items</p>
        </div>
        
        {/* Search and View Controls */}
        <div className={styles.controls}>
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
                className={styles.clearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          
          <div className={styles.viewControls}>
            <button 
              className={`${styles.viewToggle} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <FiGrid size={18} />
            </button>
            <button 
              className={`${styles.viewToggle} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <FiList size={18} />
            </button>
          </div>
        </div>
        
        {/* Status Filters */}
        <div className={styles.statusFilters}>
          <button
            className={`${styles.statusFilter} ${!statusFilter ? styles.active : ''}`}
            onClick={() => navigate('.', { replace: true })}
          >
            <FiPackage className={styles.filterIcon} />
            <span>All Items</span>
            <span className={styles.count}>{items.length}</span>
          </button>
          
          <button
            className={`${styles.statusFilter} ${statusFilter === 'stored' ? styles.active : ''}`}
            onClick={() => navigate('?status=stored', { replace: true })}
          >
            <FiHome className={styles.filterIcon} />
            <span>In Storage</span>
            <span className={styles.count}>
              {getItemCountByStatus('stored')}
            </span>
          </button>
          
          <button
            className={`${styles.statusFilter} ${statusFilter === 'in_transit' ? styles.active : ''}`}
            onClick={() => navigate('?status=in_transit', { replace: true })}
          >
            <FiTruck className={styles.filterIcon} />
            <span>In Transit</span>
            <span className={styles.count}>
              {getItemCountByStatus('in_transit')}
            </span>
          </button>
          
          <button
            className={`${styles.statusFilter} ${statusFilter === 'delivered' ? styles.active : ''}`}
            onClick={() => navigate('?status=delivered', { replace: true })}
          >
            <FiCheckCircle className={styles.filterIcon} />
            <span>Delivered</span>
            <span className={styles.count}>
              {getItemCountByStatus('delivered')}
            </span>
          </button>
          
          <button
            className={`${styles.statusFilter} ${statusFilter === 'requested' ? styles.active : ''}`}
            onClick={() => navigate('?status=requested', { replace: true })}
          >
            <FiClock className={styles.filterIcon} />
            <span>Requested</span>
            <span className={styles.count}>
              {getItemCountByStatus('requested')}
            </span>
          </button>
        </div>
      </div>
      
      {/* Items List/Grid */}
      <div className={`${styles.itemsContainer} ${viewMode === 'grid' ? styles.gridView : styles.listView}`}>
        {filteredItems.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FiPackage size={64} className="text-muted" />
            </div>
            <h3>No items found</h3>
            <p>Get started by storing your first items</p>
            <button 
              className={styles.primaryButton}
              onClick={() => navigate('/store-items')}
            >
              <FiPlus size={18} /> Store Items
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className={styles.itemsGrid}>
            {filteredItems.map(item => renderItemCard(item))}
          </div>
        ) : (
          <div className={styles.itemsList}>
            {filteredItems.map(item => renderItemRow(item))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyItems;
