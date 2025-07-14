import "./Chat.css";

import { IoChatbox, IoLogOut } from "react-icons/io5";

const Chat = () => {
    return (
        <div className="chat-wrapper">
            <nav className="menu">
                <ul>
                    <a href="#">
                        <li><IoLogOut /> Logout</li>
                    </a>
                </ul>
            </nav>

            <div className="chat-container">
                <div className="conversation-list">
                    <ul>
                        <li>
                            <div className="avatar"><img src="https://cdn.discordapp.com/avatars/216221089745862656/dd2e31b14d120fee6919c32c2c80eee0.webp" alt="Avatar" /></div>
                            <div className="details">
                                <div className="username">Axel Axelsson</div>
                                <div className="latest-message">You: I sent this message some time...</div>
                            </div>
                            <div className="timestamp">20m</div>
                        </li>

                        <li>
                            <div className="avatar"><img src="https://cdn.discordapp.com/avatars/216221089745862656/dd2e31b14d120fee6919c32c2c80eee0.webp" alt="Avatar" /></div>
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
    );
}

export default Chat;