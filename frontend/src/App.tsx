import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BoxesProvider } from './context/BoxesContext';
import { ThemeProvider } from './context/ThemeContext';
import BottomNavigation from './components/BottomNavigation';
import Layout from './components/layout/Layout';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MyBoxes from './pages/MyBoxes';
import BoxDetails from './pages/BoxDetails';
import RegisterBox from './pages/RegisterBox';
import RequestPickup from './pages/RequestPickup';
import Scan from './pages/Scan';
import ScanScreen from './pages/ScanScreen';
import ProfileScreen from './pages/ProfileScreen';
import StorageLocations from './pages/StorageLocations';

// Create a client
const queryClient = new QueryClient();

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    console.error('Error caught by boundary:', error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Something went wrong</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            We're sorry, but an unexpected error occurred.
          </p>
          <button 
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = '/';
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--primary-500)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-600)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-500)';
            }}
          >
            Return to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent = () => {
  // Protected Route Component
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    console.log('ProtectedRoute - auth state:', { isAuthenticated, loading });

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      );
    }


    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
    }

    return <>{children}</>;
  };

  // Public Route Component
  const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    console.log('PublicRoute - auth state:', { isAuthenticated, loading });

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      );
    }

    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
  };
  return (
    <div className="app-container" style={{ paddingBottom: '80px' }}>
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          {/* Keep old /register route as a redirect for backward compatibility */}
          <Route path="/register" element={
            <PublicRoute>
              <Navigate to="/signup" replace />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/my-boxes" element={
            <ProtectedRoute>
              <MyBoxes />
            </ProtectedRoute>
          } />
          <Route path="/box/:id" element={
            <ProtectedRoute>
              <BoxDetails />
            </ProtectedRoute>
          } />
          <Route path="/register-box" element={
            <ProtectedRoute>
              <RegisterBox />
            </ProtectedRoute>
          } />
          <Route path="/request-pickup" element={
            <ProtectedRoute>
              <RequestPickup />
            </ProtectedRoute>
          } />
          <Route path="/scan" element={
            <ProtectedRoute>
              <Scan />
            </ProtectedRoute>
          } />
          <Route path="/scan-screen" element={
            <ProtectedRoute>
              <ScanScreen />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileScreen />
            </ProtectedRoute>
          } />
          <Route path="/storage-locations" element={
            <ProtectedRoute>
              <StorageLocations />
            </ProtectedRoute>
          } />
          <Route path="/store-box" element={
            <ProtectedRoute>
              <RegisterBox />
            </ProtectedRoute>
          } />
        </Routes>
        <ToastContainer position="top-right" autoClose={5000} />
        <ReactQueryDevtools initialIsOpen={false} />
      </main>
      <BottomNavigation />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <BoxesProvider>
              <div className="app">
                <AppContent />
                <ToastContainer 
                  position="top-center" 
                  autoClose={5000}
                  toastClassName="toast" 
                  bodyClassName="toast-body"
                  theme="colored"
                />
                <ReactQueryDevtools initialIsOpen={false} />
              </div>
            </BoxesProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
