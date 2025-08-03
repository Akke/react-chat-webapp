import { Outlet } from "react-router";
import Login from "../components/Login/Login";

const ProtectedRoute = ({ isAuthenticated }) => {
    return isAuthenticated ? <Outlet /> : <Login />;
}

export default ProtectedRoute;