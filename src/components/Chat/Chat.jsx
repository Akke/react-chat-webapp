import { useContext, useEffect, useState } from "react";
import "./Chat.css";

import { IoChatbox, IoLogOut, IoSend } from "react-icons/io5";
import { AuthContext } from "../../contexts/AuthProvider";
import { Link } from "react-router-dom";
import InviteUser from "./InviteUser";
import { messageServiceGetConversations, messageServiceGetMessages, messageServicePostMessage } from "../../service/messageService";

const Chat = () => {
    const { clearAuth, user } = useContext(AuthContext);

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [currentConversationMessages, setCurrentConversationMessages] = useState([]);

    const getMessages = async (conversationId = null) => {
        const request = await messageServiceGetMessages(user.jwt, conversationId);
        
        if(request.error) {
            createNotification({ type: "error", msg: request.error });
        } else {
            return request;              
        }

        return null;
    }

    const getConversations = async () => {
        const request = await messageServiceGetConversations(user.jwt);
        
        if(request.error) {
            createNotification({ type: "error", msg: request.error });
        } else {
            const tempIds = [];

            for(const key in request) {
                for(const cId of request[key]) {
                    tempIds.push(cId);
                }
            }

            const conversationIds = [...new Set(tempIds)]; // prevent duplicate conversation ids

            return conversationIds;
        }

        return null;
    }

    useEffect(() => {
        const fetchData = async () => {
            const conversationIds = await getConversations();
            setConversations(conversationIds);

            const fetchMessages = await getMessages();
            setMessages(fetchMessages);
        }

        fetchData();
    }, []);

    const onChatMessageSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const message = formData.get("message");

        const sendMessage = async () => {
            const request = await messageServicePostMessage(message, activeConversation, user.jwt);
            
            if(request.error) {
                createNotification({ type: "error", msg: request.error });
            } else {
                e.target.reset();
                setCurrentConversationMessages(prevMessages => [...prevMessages, {
                    id: request.latestMessage.id,
                    text: request.latestMessage.text,
                    createdAt: Date.now(),
                    userId: user.id,
                    conversationId: request.latestMessage.conversationId
                }]);
            }
        }

        sendMessage();
    }

    const openConversation = async (id) => {
        const getAndFilterMessages = async () => {
            const msgs = await getMessages(id);
            const filtered = msgs.filter((m) => m.conversationId == id);

            setCurrentConversationMessages(filtered);
            setActiveConversation(id);
        }

        getAndFilterMessages();
    }

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
                        <InviteUser />

                        <ul>
                            {(conversations && conversations.length) ? conversations.map((id) => {
                                return (
                                    <li key={id} onClick={() => openConversation(id)}>
                                        <div className="avatar"><img src="https://avatars.githubusercontent.com/u/6265267?v=4" alt="Avatar" /></div>
                                        <div className="details">
                                            <div className="username">Axel Axelsson</div>
                                            <div className="latest-message">You: I sent this message some time...</div>
                                        </div>
                                        <div className="timestamp">20m</div>
                                    </li>
                                );
                            }) : <>No conversations found.</>}
                        </ul>
                    </div>
                </div>

                <div className="right-side-message-container">
                    {activeConversation ? <>
                        <div className="messages-list">
                            {currentConversationMessages.map((item) => {
                                return (
                                    <div className="message-container self" key={item.id}>
                                        <div className="message-avatar">
                                            <img src={user.avatar} alt="Avatar" />
                                        </div>

                                        <div className="message-body">
                                            <div className="message-header">
                                                <div className="message-user">{item.userId}</div>
                                                <div className="message-timestamp">{item.createdAt}</div>
                                            </div>
                                            <div className="message-content">{item.text}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bottom-message-input-container">
                            <form action="POST" className="message-form" onSubmit={onChatMessageSubmit}>
                                <input type="text" name="message" placeholder="Write your message here..." />
                                <button><IoSend /></button>
                            </form>
                        </div>
                    </> : <>Open a conversation to begin chatting.</>}
                    
                </div>

                
            </div>
        </div>
    );
}

export default Chat;