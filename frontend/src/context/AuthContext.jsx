import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const initUser = () => {
    try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) return JSON.parse(storedUser);
    } catch { /* ignore */ }
    return null;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(initUser);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading: false }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
