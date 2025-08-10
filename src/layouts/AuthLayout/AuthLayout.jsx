import { Outlet } from "react-router-dom";
import Copyright from "../../components/Copyright/Copyright";
import AuthBanner from "../../components/AuthBanner";
import "./AuthLayout.css";

const AuthLayout = () => {
    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <AuthBanner />
                
                <Outlet />
            </div>

            <Copyright />
        </div>
    );
}

export default AuthLayout;