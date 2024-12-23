import React, { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactNode; // Define the type for children
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        // Instead of redirecting to /login, we show the AuthModal
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;