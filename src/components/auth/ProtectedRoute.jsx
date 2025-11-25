import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { setUser } from '../../redux/slices/authSlice';
import { authAPI } from '../api/api';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // If we have a token but no user data, fetch user profile
    if (token && !user) {
      const fetchUserProfile = async () => {
        try {
          const response = await authAPI.getProfile();
          dispatch(setUser(response.data.user));
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // If profile fetch fails, redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      };
      
      fetchUserProfile();
    }
  }, [token, user, dispatch]);

  if (!isAuthenticated || !token) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show loading spinner while fetching user data
  if (token && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-green-400">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;