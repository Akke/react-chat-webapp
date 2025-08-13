import { Outlet } from "react-router-dom";
import SideNav from "../../components/SideNav/SideNav";
import "./MainLayout.css";

const MainLayout = () => {
    return (
        <div className="main-wrapper">
            <SideNav />

            <Outlet />
        </div>
    );
}

export default MainLayout;