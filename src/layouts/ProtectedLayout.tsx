import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks';

const ProtectedLayout = () => {
    const { signedIn, checkSession } = useAuth();

    if (checkSession) return null;
    if (!signedIn) return <Navigate to='/login' replace />;

    return <Outlet />;
};

export default ProtectedLayout;
