import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { registerUser, loginUser, socialLogin } from '../api/authAPI';
import { useNotification } from './NotificationContext';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Register with email and password
  const register = async (name, email, password, image) => {
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Register user in our backend
      const userData = {
        name,
        email,
        password,
        image
      };
      
      const response = await registerUser(userData);
      
      // Save token to localStorage
      localStorage.setItem('token', response.token);
      
      // Update current user state
      setCurrentUser({
        ...response.user,
        firebaseUid: user.uid
      });
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  // Login with email and password
  const login = async (email, password) => {
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Login to our backend
      const response = await loginUser({ email, password });
      
      // Save token to localStorage
      localStorage.setItem('token', response.token);
      
      // Update current user state
      setCurrentUser({
        ...response.user,
        firebaseUid: user.uid
      });
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  // Login with Google
  const loginWithGoogle = async () => {
    try {
      // Use the configured Google provider
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Login/register with our backend
      const userData = {
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
        firebaseUid: user.uid // Include Firebase UID
      };
      
      const response = await socialLogin(userData);
      
      // Save token to localStorage
      localStorage.setItem('token', response.token);
      
      // Also save user data for persistence
      localStorage.setItem('userData', JSON.stringify(response.user));
      
      // Update current user state
      setCurrentUser({
        ...response.user,
        firebaseUid: user.uid
      });
      
      return response;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };
  
  // Logout
  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear token from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      
      // Clear current user state
      setCurrentUser(null);
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };
  
  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };
  
  // Check if user is agent
  const isAgent = () => {
    return currentUser?.role === 'agent';
  };
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };
  
  // Check if user is fraud
  const isFraud = () => {
    return currentUser?.isFraud === true;
  };
  
  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is signed in
          const token = localStorage.getItem('token');
          
          if (token) {
            // We have a token, try to get user data from our backend
            try {
              // This would be a call to get current user from backend
              // For now, we'll just use what we have in localStorage
              const userDataString = localStorage.getItem('userData');
              if (userDataString) {
                try {
                  const userData = JSON.parse(userDataString);
                  setCurrentUser({
                    ...userData,
                    firebaseUid: user.uid
                  });
                } catch (parseError) {
                  console.error('Error parsing user data:', parseError);
                  // If there's an error parsing, clear token and user data
                  localStorage.removeItem('userData');
                  // Don't set currentUser to null yet, as we might still have a valid token
                }
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
              // If there's an error, clear token and user data
              localStorage.removeItem('token');
              localStorage.removeItem('userData');
              setCurrentUser(null);
            }
          } else {
            // No token, user needs to login again
            setCurrentUser(null);
          }
        } else {
          // User is signed out
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          setCurrentUser(null);
        }
      } finally {
        setLoading(false);
      }
    });
    
    return unsubscribe;
  }, []);
  
  const value = {
    currentUser,
    register,
    login,
    loginWithGoogle,
    logout,
    isAdmin,
    isAgent,
    isAuthenticated,
    isFraud,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 