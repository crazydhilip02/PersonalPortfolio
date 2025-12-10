import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import AdminSidebar from './AdminSidebar';
import AdminMobileNav from './AdminMobileNav';

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
            <div className="min-h-screen bg-[#050508] flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-cyan-500 font-mono animate-pulse">
                        AUTH
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-[#050508] text-white selection:bg-cyan-500/30">
            <div className="hidden lg:block">
                <AdminSidebar />
            </div>
            <div className="lg:hidden">
                <AdminMobileNav />
            </div>

            <main className="lg:pl-64 min-h-screen pt-16 lg:pt-0 transition-all duration-300">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
