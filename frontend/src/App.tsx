import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from '@contexts/AuthContext';
import { BoxesProvider } from '@contexts/BoxesContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import { ToastProvider } from '@contexts/ToastContext';
import Layout from './components/layout/Layout';
import BottomNavigation from './components/BottomNavigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MyItems from './pages/MyItems';
import ItemDetails from './pages/ItemDetails';
import BoxDetails from './pages/BoxDetails'; // Keep for now for any direct links
import RegisterBox from './pages/RegisterBox'; // Keep for now for any direct links
import FlowSelection from './pages/FlowSelection';
import BoxActions from './pages/BoxActions';
import ProfileScreen from './pages/ProfileScreen';
// Keep these imports for now as they might be used in other components
import StoreItemsFlow from './pages/StoreItemsFlow';
import RequestItemsFlow from './pages/RequestItemsFlow';

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
    const location = useLocation();

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
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
  };

  // Public Route Component
  const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    console.log('PublicRoute - auth state:', { isAuthenticated, loading });

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      );
    }


    if (isAuthenticated) {
      // Get the redirect location from state or default to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      console.log('User is authenticated, redirecting to:', from);
      return <Navigate to={from} replace />;
    }

    return <>{children}</>;
  };
  return (
    <Routes>
      {/* Redirect root to login for unauthenticated users, dashboard for authenticated */}
      <Route path="/" element={
        <PublicRoute>
          <Navigate to="/login" replace />
        </PublicRoute>
      } />
      
      {/* Public Routes - Only login and signup are accessible when not authenticated */}
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
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/my-items" element={
        <ProtectedRoute>
          <Layout>
            <MyItems />
          </Layout>
        </ProtectedRoute>
      } />
      {/* Redirect old my-boxes route to my-items */}
      <Route path="/my-boxes" element={
        <Navigate to="/my-items" replace />
      } />
      {/* Keep box details route for now for any direct links */}
      <Route path="/item/:id" element={
        <ProtectedRoute>
          <Layout>
            <ItemDetails />
          </Layout>
        </ProtectedRoute>
      } />
      {/* Keep box details route for now for any direct links */}
      <Route path="/box/:id" element={
        <ProtectedRoute>
          <Layout>
            <BoxDetails />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/register-box" element={
        <ProtectedRoute>
          <Layout>
            <RegisterBox />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/store-items" element={
        <ProtectedRoute>
          <Layout>
            <StoreItemsFlow />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/request-items" element={
        <ProtectedRoute>
          <Layout>
            <RequestItemsFlow />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Redirect old routes to new ones */}
      <Route path="/box-actions" element={
        <Navigate to="/store-items" replace />
      } />
      <Route path="/flow-selection" element={
        <Navigate to="/store-items" replace />
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <ProfileScreen />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Redirect old routes to new flow */}
      <Route path="/handoff" element={
        <Navigate to="/box-actions" replace />
      } />
      <Route path="/store-box" element={
        <Navigate to="/box-actions" replace />
      } />
      <Route path="/request-pickup" element={
        <Navigate to="/box-actions" replace />
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <BoxesProvider>
              <ToastProvider>
                <div className="app">
                  <ErrorBoundary>
                    <AppContent />
                  </ErrorBoundary>
                  <ToastContainer 
                    position="top-center" 
                    autoClose={5000}
                    toastClassName="toast" 
                    bodyClassName="toast-body"
                    theme="colored"
                  />
                  <ReactQueryDevtools initialIsOpen={false} />
                </div>
              </ToastProvider>
            </BoxesProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
