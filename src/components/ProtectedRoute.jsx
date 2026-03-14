import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';


const ProtectedRoute = ({ children }) => {
    // Note: We need react-firebase-hooks for a better auth state experience.
    // However, I will implement a simple version first to avoid too many dependencies.
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    if (loading) {
        return (
            <div style={{ background: '#030712', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                <div className="loader" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
