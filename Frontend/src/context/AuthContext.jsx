
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        user: null,
        token: localStorage.getItem('token'),
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    // Verify token if needed, or trust local storage for initial load
                    // In real prod, call /me
                    setAuthState({
                        user: JSON.parse(savedUser),
                        token: token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    logout();
                }
            } else {
                setAuthState(prev => ({ ...prev, isLoading: false }));
            }
        };

        checkAuth();
    }, []);

    const login = (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
        });
    };

    const updateUser = (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        setAuthState(prev => ({ ...prev, user }));
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
