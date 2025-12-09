import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

const AdminLayout = () => {
    const { isAuthenticated, loading } = useContent();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/admin/login');
        }
    }, [isAuthenticated, loading, navigate]);

    // Show loading while checking auth state
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-cyan-400 text-xl">Checking authentication...</div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div>
            {/* Admin-specific header or sidebar could go here */}
            <Outlet />
        </div>
    );
};

export default AdminLayout;
