import { Outlet } from "react-router-dom";
import Menu from "../../components/Menu/Menu";
import "./MainLayout.css";

const MainLayout = () => {
    return (
        <div className="main-wrapper">
            <Menu />

            <Outlet />
        </div>
    );
}

export default MainLayout;