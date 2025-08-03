import { Navigate, Outlet } from "react-router";

const PublicRoute = ({ isAuthenticated }) => {
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
 
export default PublicRoute;