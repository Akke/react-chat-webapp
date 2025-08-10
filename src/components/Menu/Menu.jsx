import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import "./Menu.css";
import { Link } from "react-router-dom";
import { IoLogOut, IoPersonCircle } from "react-icons/io5";

const Menu = () => {
    const { clearAuth } = useContext(AuthContext);

    return (
        <nav className="menu">
            <ul>
                <Link to="/profile">
                    <li><IoPersonCircle /> Profile</li>
                </Link>

                <Link to="/" onClick={clearAuth} className="logout">
                    <li><IoLogOut /> Logout</li>
                </Link>
            </ul>
        </nav>
    );
}

export default Menu;