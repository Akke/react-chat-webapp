import { useContext } from "react";
import "./Chat.css";

import { IoChatbox, IoLogOut } from "react-icons/io5";
import { AuthContext } from "../../contexts/AuthProvider";
import { Link } from "react-router-dom";

const Chat = () => {
    const { clearAuth, user } = useContext(AuthContext);

    return (
        <div className="chat-wrapper">
            <nav className="menu">
                <ul>
                    <Link to="/" onClick={clearAuth}>
                        <li><IoLogOut /> Logout</li>
                    </Link>
                </ul>
            </nav>

            <div className="chat-container">
                <div className="left-side-bar">
                    <div className="mini-profile-container">
                        <div className="mini-profile">
                            <div className="avatar">
                                <img src={user.avatar} alt="Avatar" />
                            </div>

                            <div className="username">{user.user}</div>
                        </div>
                    </div>

                    <div className="conversation-list">
                        <ul>
                            <li>
                                <div className="avatar"><img src="https://avatars.githubusercontent.com/u/6265267?v=4" alt="Avatar" /></div>
                                <div className="details">
                                    <div className="username">Axel Axelsson</div>
                                    <div className="latest-message">You: I sent this message some time...</div>
                                </div>
                                <div className="timestamp">20m</div>
                            </li>

                            <li>
                                <div className="avatar"><img src="https://avatars.githubusercontent.com/u/6265267?v=4" alt="Avatar" /></div>
                                <div className="details">
                                    <div className="username">Axel Axelsson</div>
                                    <div className="latest-message">You: I sent this message some time...</div>
                                </div>
                                <div className="timestamp">20m</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;