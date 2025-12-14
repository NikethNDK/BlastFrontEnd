import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../../store/slices/userSlice';
import Login from './Login';

/**
 * AuthGuard component that:
 * 1. On mount, checks if user has valid session by calling /me/
 * 2. Shows loading spinner while checking auth
 * 3. If authenticated, renders Login component (which will render the appropriate app)
 * 4. If not authenticated, Login component shows the login form
 */
const AuthGuard = () => {
    const dispatch = useDispatch();
    const { isLoading, isAuthenticated, user } = useSelector((state) => state.user);

    useEffect(() => {
        // On mount, try to fetch current user from server
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid #e0e0e0',
                    borderTop: '4px solid #c5ea31',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <p style={{ color: '#666', fontSize: '16px' }}>Loading...</p>
                <style>
                    {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
                </style>
            </div>
        );
    }

    // Pass authentication state to Login component
    // Login will use Redux state to determine what to render
    return <Login initialAuthState={{ isAuthenticated, user }} />;
};

export default AuthGuard;
