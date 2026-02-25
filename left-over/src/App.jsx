import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages - IMPORT EACH PAGE ONLY ONCE
import Home from "./pages/Home";
import About from "./pages/About";  // Only import this ONCE
import MapView from "./pages/MapView";
import HostDashboard from "./pages/HostDashboard";
import NGODashboard from "./pages/NGODashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import PrivateRoute from "./components/common/PrivateRoute";
import Loader from "./components/common/Loader";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
// Remove these if you haven't created them yet
import ForgotPassword from "./components/auth/ForgotPassword";
// import RoleSelector from "./components/auth/RoleSelector";

function App() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/map" element={<MapView />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} /> : <Login />
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} /> : <Register />
            } />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route path="/host/dashboard" element={
              <PrivateRoute allowedRoles={['host']}>
                <HostDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/ngo/dashboard" element={
              <PrivateRoute allowedRoles={['ngo']}>
                <NGODashboard />
              </PrivateRoute>
            } />
            
            <Route path="/volunteer/dashboard" element={
              <PrivateRoute allowedRoles={['volunteer']}>
                <VolunteerDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;