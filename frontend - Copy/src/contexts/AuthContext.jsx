import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import api from '../utils/axios';
import { showToast } from '../utils/toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get fresh token
          const token = await firebaseUser.getIdToken(true);
          
          try {
            // Verify with backend
            const response = await api.post('/auth/google', {
              token,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              image: firebaseUser.photoURL
            });

            if (!response.data.success) {
              throw new Error(response.data.message || 'Authentication failed');
            }

            // Set user data and token
            const { user: userData, token: customToken } = response.data;
            setUser(userData);
            
            // Store the token
            localStorage.setItem('token', customToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${customToken}`;
          } catch (backendError) {
            console.error('Backend verification failed:', backendError);
            setUser(null);
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            await auth.signOut();
          }
        } else {
          // Clear auth state if no Firebase user
          setUser(null);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    });

    // Set up token refresh interval
    const tokenRefreshInterval = setInterval(async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken(true);
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Token refresh error:', error);
      }
    }, 10 * 60 * 1000); // Refresh token every 10 minutes

    return () => {
      unsubscribe();
      clearInterval(tokenRefreshInterval);
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      showToast.success('Logged in successfully');
    } catch (error) {
      console.error('Login error:', error);
      showToast.error(error.message || 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, password, name }) => {
    try {
      setLoading(true);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await firebaseUser.updateProfile({ displayName: name });
      
      // Get token and verify with backend
      const token = await firebaseUser.getIdToken();
      const response = await api.post('/auth/google', {
        token,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        image: firebaseUser.photoURL
      });

      // Set user data and token
      const { user: userData, token: jwtToken } = response.data;
      setUser(userData);
      localStorage.setItem('token', jwtToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
      
      showToast.success('Account created successfully');
    } catch (error) {
      console.error('Registration error:', error);
      showToast.error(error.message || 'Failed to register');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      setLoading(true);

      // Create a new provider instance for each login attempt
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      
      // Sign in with popup
      console.log('Opening Google sign-in popup...');
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign-in successful');
      
      // Get the ID token
      console.log('Getting ID token...');
      const token = await result.user.getIdToken();
      
      try {
        // Verify with backend
        console.log('Sending token to backend...');
        const response = await api.post('/auth/google', {
          token,
          email: result.user.email,
          name: result.user.displayName,
          image: result.user.photoURL
        });
        console.log('Backend verification successful:', response.data);

        if (!response.data.success) {
          throw new Error(response.data.message || 'Authentication failed');
        }

        // Set user data and token
        const { user: userData, token: customToken } = response.data;
        setUser(userData);
        
        // Store the token
        localStorage.setItem('token', customToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${customToken}`;
        
        showToast.success('Logged in with Google successfully');
      } catch (backendError) {
        console.error('Backend verification failed:', backendError);
        if (backendError.response?.data) {
          console.log('Backend error details:', backendError.response.data);
        }
        
        // Sign out from Firebase if backend verification fails
        await auth.signOut();
        
        // Show more specific error message
        const errorMessage = backendError.response?.data?.message || backendError.message;
        showToast.error(`Authentication failed: ${errorMessage}`);
        
        throw backendError;
      }
    } catch (error) {
      console.error('Google login error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        showToast.error('Login cancelled');
        return;
      }
      if (error.code === 'auth/popup-blocked') {
        showToast.error('Popup was blocked. Please allow popups for this site.');
        return;
      }
      
      showToast.error(error.message || 'Failed to login with Google');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      showToast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      showToast.error('Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (formData) => {
    try {
      setLoading(true);
      
      // Handle photo/image field
      if (formData.get('photo')) {
        const photoFile = formData.get('photo');
        formData.delete('photo');
        formData.append('image', photoFile);
      }

      // Update profile in backend
      const response = await api.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update user state with new data
      const updatedUser = response.data;
      setUser(updatedUser);

      // If there's a Firebase user, update their profile too
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        const updates = {
          displayName: formData.get('name') || user.name
        };
        
        // If there's a new image, upload it and get URL
        if (formData.get('image')) {
          // Get the full URL for the image
          const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
          updates.photoURL = `${baseUrl}${updatedUser.image}`;
        }
        
        try {
          await updateFirebaseProfile(firebaseUser, updates);
        } catch (firebaseError) {
          console.error('Firebase profile update error:', firebaseError);
          // Continue even if Firebase update fails
        }
      }

      showToast.success('Profile updated successfully');
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      showToast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    googleLogin,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 