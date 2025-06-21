import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// Import types directly from box.ts to avoid any circular dependencies
import type { Box, BoxStatus } from '../types/box';
import { 
  FiPackage, 
  FiMapPin, 
  FiCalendar, 
  FiPlus, 
  FiTruck, 
  FiCheckCircle,
  FiClock,
  FiHome,
  FiSearch,
  FiFilter,
  FiGrid,
  FiList
} from 'react-icons/fi';
import { useBoxes } from '@contexts/BoxesContext';
import BoxCard from '../components/BoxCard';
import styles from '../styles/MyBoxes.module.css';

const MyBoxes: React.FC = () => {
  const { boxes, loading, error } = useBoxes();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');
  
  // Filter boxes by status from URL
  const filteredBoxes = useMemo<Box[]>(() => {
    if (!statusFilter) return boxes;
    return boxes.filter((box) => {
      // Ensure status is properly typed as BoxStatus
      const boxStatus: BoxStatus = box.status as BoxStatus;
      return boxStatus === statusFilter;
    });
  }, [boxes, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    );
  }
  // Get box icon and label based on size
  interface BoxSizeInfo {
    emoji: string;
    label: string;
    size: string;
  }

  const getBoxSizeInfo = (size: string): BoxSizeInfo => {
    const sizeLower = size.toLowerCase();
    const sizes: Record<string, BoxSizeInfo> = {
      small: { emoji: 'S', label: 'Small', size: '16x12x10"' },
      medium: { emoji: 'M', label: 'Medium', size: '18x14x12"' },
      large: { emoji: 'L', label: 'Large', size: '22x16x15"' },
      xl: { emoji: 'XL', label: 'Extra Large', size: '24x18x18"' }
    };
    return sizes[sizeLower] || { emoji: '📦', label: size, size: 'Varies' };
  };
  // Get status details
  type StatusKey = BoxStatus | string;
  
  interface StatusDetails {
    label: string;
    color: string;
    bg: string;
  }

  const getStatusDetails = (status: StatusKey): StatusDetails => {
    const statuses: Record<BoxStatus, StatusDetails> = {
      stored: { label: 'In Storage', color: '#4CAF50', bg: 'rgba(76, 175, 80, 0.1)' },
      transit: { label: 'In Transit', color: '#2196F3', bg: 'rgba(33, 150, 243, 0.1)' },
      delivered: { label: 'Delivered', color: '#9C27B0', bg: 'rgba(156, 39, 176, 0.1)' },
      processing: { label: 'Processing', color: '#FF9800', bg: 'rgba(255, 152, 0, 0.1)' }
    };
    
    return statuses[status as BoxStatus] || { 
      label: status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()), 
      color: '#666', 
      bg: 'rgba(0, 0, 0, 0.05)' 
    };
  };
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: '2-digit', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter boxes by search query
  const filteredBySearch = useMemo<Box[]>(() => {
    if (!searchQuery) return filteredBoxes;
    const query = searchQuery.toLowerCase();
    return filteredBoxes.filter((box) => {
      const name = box.name ? String(box.name).toLowerCase() : '';
      const contents = Array.isArray(box.contents) 
        ? box.contents.join(' ').toLowerCase()
        : box.contents 
          ? String(box.contents).toLowerCase()
          : '';
      const id = String(box.id).toLowerCase();
      
      return (
        name.includes(query) ||
        contents.includes(query) ||
        id.includes(query)
      );
    });
  }, [filteredBoxes, searchQuery]);

  return (
    <div className={styles.myBoxesContainer}>
      {/* Header */}
      <div className={styles.boxesHeader}>
        <div className={styles.headerContent}>
          <h1>My Storage</h1>
          <p className={styles.subtitle}>Manage your stored items and track deliveries</p>
        </div>
        
        {/* Search and Filters */}
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search boxes..."
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
        
        {/* Status Filter */}
        <div className={styles.statusFilters}>
          <button
            className={`${styles.statusFilter} ${!statusFilter ? styles.active : ''}`}
            onClick={() => navigate('.', { replace: true })}
          >
            <FiPackage className={styles.filterIcon} />
            <span>All Boxes</span>
            <span className={styles.count}>{boxes.length}</span>
          </button>
          
          <button
            className={`${styles.statusFilter} ${statusFilter === 'stored' ? styles.active : ''}`}
            onClick={() => navigate('?status=stored', { replace: true })}
          >
            <FiHome className={styles.filterIcon} />
            <span>In Storage</span>
            <span className={styles.count}>
              {boxes.filter(box => box.status === 'stored').length}
            </span>
          </button>
          
          <button
            className={`${styles.statusFilter} ${statusFilter === 'transit' ? styles.active : ''}`}
            onClick={() => navigate('?status=transit', { replace: true })}
          >
            <FiTruck className={styles.filterIcon} />
            <span>In Transit</span>
            <span className={styles.count}>
              {boxes.filter(box => box.status === 'transit').length}
            </span>
          </button>
          
          <button
            className={`${styles.statusFilter} ${statusFilter === 'delivered' ? styles.active : ''}`}
            onClick={() => navigate('?status=delivered', { replace: true })}
          >
            <FiCheckCircle className={styles.filterIcon} />
            <span>Delivered</span>
            <span className={styles.count}>
              {boxes.filter(box => box.status === 'delivered').length}
            </span>
          </button>
        </div>
      </div>
      
      {/* Box List */}
      <div className={`${styles.boxContainer} ${styles[viewMode]}`}>
        {filteredBySearch.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FiPackage size={64} className="text-muted" />
            </div>
            <h3>No boxes found</h3>
            <p>Get started by registering your first box</p>
            <button 
              className={styles.primaryButton}
              onClick={() => navigate('/register-box')}
            >
              <FiPlus size={18} /> Add Box
            </button>
          </div>
        ) : (
          <div className={styles[`box${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}`]}>
            {filteredBySearch.map((box) => (
              <BoxCard 
                key={box.id} 
                box={box} 
                viewMode={viewMode}
                onClick={() => navigate(`/box/${box.id}`)}
                getBoxSizeInfo={getBoxSizeInfo}
                getStatusDetails={getStatusDetails}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Floating Action Button */}
      <button 
        className={styles.fab}
        onClick={() => navigate('/register-box')}
        aria-label="Register new box"
      >
        <FiPlus size={24} />
      </button>
    </div>
  );
};
export default MyBoxes;
