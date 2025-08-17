import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import "./SideNav.css";
import { Link } from "react-router-dom";
import { IoChatbox, IoChevronBack, IoChevronForward, IoLogOut, IoPersonCircle } from "react-icons/io5";

const SideNav = () => {
    const { clearAuth } = useContext(AuthContext);
    const [isToggled, setIsToggled] = useState(true);

    return (
        <nav className={`side-nav ${!isToggled ? "minimized" : ""}`}>
            <div className="side-header">
                <div className="toggle-button" onClick={() => setIsToggled(!isToggled)}>
                    {isToggled ?
                        <IoChevronBack />
                    :   <IoChevronForward />
                    }
                </div>
                <span className="logo">Chatify</span>
            </div>

            <ul>
                <Link to="/">
                    <li><IoChatbox /> <span>Chat</span></li>
                </Link>

                <Link to="/profile">
                    <li><IoPersonCircle /> <span>Profile</span></li>
                </Link>

                <Link to="/" onClick={clearAuth} className="logout">
                    <li><IoLogOut /> <span>Logout</span></li>
                </Link>
            </ul>
        </nav>
    );
}

export default SideNav;