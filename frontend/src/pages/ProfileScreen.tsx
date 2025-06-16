import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/hooks/useToast';
import BoxYLogo from '../components/BoxYLogo';

interface UserAddress {
  id: string;
  name: string;
  address: string;
  isDefault: boolean;
}

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  
  // Mock user data - in a real db, this would come from your auth context or API
  const [user] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: '👤',
    joinedDate: 'Member since March 2024'
  });

  const [addresses, setAddresses] = useState<UserAddress[]>([
    { id: '1', name: 'Home', address: '123 Main St\nAnytown, 12345\nUSA', isDefault: true },
    { id: '2', name: 'Work', address: '456 Business Ave\nAnytown, 12345\nUSA', isDefault: false },
  ]);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newAddress, setNewAddress] = useState({ name: '', address: '', isDefault: false });

  // Menu items for the profile screen
  const menuItems = [
    { id: 'orders', icon: '📦', label: 'My Orders', onClick: () => navigate('/my-boxes') },
    { id: 'addresses', icon: '🏠', label: 'My Addresses', onClick: () => document.getElementById('addresses-section')?.scrollIntoView() },
    { id: 'payments', icon: '💳', label: 'Payment Methods', onClick: () => {} },
    { id: 'promo', icon: '🎁', label: 'Promo Codes', onClick: () => {} },
    { id: 'help', icon: '❓', label: 'Help', onClick: () => {} },
    { id: 'settings', icon: '⚙️', label: 'Settings', onClick: () => {} },
  ];

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    // TODO: Implement password change API call
    console.log('Changing password...');
    success('Password changed successfully');
    setShowPasswordForm(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    // If this is set as default, unset any existing default
    const updatedAddresses = newAddress.isDefault
      ? addresses.map(addr => ({ ...addr, isDefault: false }))
      : [...addresses];
    
    const addressToAdd = {
      ...newAddress,
      id: Date.now().toString(),
    };
    
    setAddresses([...updatedAddresses, addressToAdd]);
    setNewAddress({ name: '', address: '', isDefault: false });
    setShowAddressForm(false);
    success('Address added successfully');
  };

  const setAsDefaultAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const deleteAddress = (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
      success('Address deleted');
    }
  };

  return (
    <div className="profile-screen">
      {/* App Header with Logo */}
      <div className="app-header">
        <BoxYLogo size={40} showText={true} />
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar">{user.avatar}</span>
        </div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <p className="text-muted">{user.joinedDate}</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="profile-menu">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item" onClick={item.onClick}>
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
            <span className="menu-arrow">›</span>
          </div>
        ))}
      </div>

      {/* Account Security Section */}
      <div className="profile-section">
        <div className="section-header">
          <h2>Account Security</h2>
          <button 
            className="btn text-button"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>
        
        {showPasswordForm && (
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn primary">
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Addresses Section */}
      <div id="addresses-section" className="profile-section">
        <div className="section-header">
          <h2>Saved Addresses</h2>
          <button 
            className="btn text-button"
            onClick={() => setShowAddressForm(!showAddressForm)}
          >
            {showAddressForm ? 'Cancel' : 'Add New'}
          </button>
        </div>

        {showAddressForm && (
          <form onSubmit={handleAddAddress} className="address-form">
            <div className="form-group">
              <label htmlFor="addressName">Address Name (e.g., Home, Work)</label>
              <input
                type="text"
                id="addressName"
                value={newAddress.name}
                onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Full Address</label>
              <textarea
                id="address"
                value={newAddress.address}
                onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                required
                rows={3}
              />
            </div>
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="isDefault"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
              />
              <label htmlFor="isDefault">Set as default address</label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn primary">
                Save Address
              </button>
            </div>
          </form>
        )}

        <div className="addresses-list">
          {addresses.map((address) => (
            <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
              <div className="address-header">
                <h3>{address.name} {address.isDefault && <span className="default-badge">Default</span>}</h3>
                <div className="address-actions">
                  {!address.isDefault && (
                    <button 
                      className="btn text-button"
                      onClick={() => setAsDefaultAddress(address.id)}
                    >
                      Set as Default
                    </button>
                  )}
                  <button 
                    className="btn text-button text-danger"
                    onClick={() => deleteAddress(address.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="address-text">{address.address.replace(/\n/g, '<br />')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="signout-section">
        <button 
          className="signout-button"
          onClick={() => { /* Implement sign out */ }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;
