import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            try {
                return jwtDecode(storedToken);
            } catch (error) {
                console.error('Invalid token:', error);
                return null;
            }
        }
        return null;
    });

    const login = (newToken) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
        try {
            const decoded = jwtDecode(newToken);
            setUser(decoded);
        } catch (error) {
            console.error('Invalid token:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        if (token && !user) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (error) {
                console.error('Failed to decode token:', error);
                setUser(null);
            }
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};