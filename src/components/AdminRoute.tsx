import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-navy">
        <div className="text-gold-light text-center">
          <div className="h-10 w-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-heading font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not logged in
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  
  // Redirect to home if logged in but not admin
  if (!user.isAdmin) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

export default AdminRoute;
