import { useContext, useEffect, useState } from "react";
import "./Chat.css";

import { IoChatbox, IoLogOut, IoSend } from "react-icons/io5";
import { AuthContext } from "../../contexts/AuthProvider";
import { Link } from "react-router-dom";
import InviteUser from "./InviteUser";
import { messageServiceGetConversations, messageServiceGetMessages, messageServicePostMessage } from "../../service/messageService";
import { UserContext } from "../../contexts/UserProvider";

const Chat = () => {
    const { clearAuth, user } = useContext(AuthContext);
    const { cacheUsernameFromId, cachedUsernames } = useContext(UserContext);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [currentConversationMessages, setCurrentConversationMessages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const conversationIds = await getConversations();
            setConversations(conversationIds);

            const fetchMessages = await getMessages();
            setMessages(fetchMessages);
        }

        fetchData();
    }, []);

    useEffect(() => {
        messages.forEach(msg => {
            cacheUsernameFromId(msg.userId);
        })
    }, [messages]);

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

    const getLatestConversationMessage = (id) => {
        const filteredAndSorted = messages.filter((m) => m.conversationId == id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return filteredAndSorted[0];
    }

    const formatMessagePreview = (text) => {
        const limit = 40;
        let trunc = text.slice(0, limit);
        if(trunc.length == limit) trunc += "...";
        return trunc;
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
                                const conversationData = getLatestConversationMessage(id);
                                if(conversationData) {
                                    const username = cachedUsernames[conversationData.userId];
                                    
                                    if(username) {
                                        return (
                                            <li key={id} onClick={() => openConversation(id)}>
                                                <div className="avatar"><img src="https://avatars.githubusercontent.com/u/6265267?v=4" alt="Avatar" /></div>
                                                <div className="details">
                                                    <div className="username">{username}</div>
                                                    <div className="latest-message">
                                                        {conversationData.userId == user.id ? "You: " : `${user.id}: `} 
                                                        {formatMessagePreview(conversationData.text)}
                                                    </div>
                                                </div>
                                                <div className="timestamp">20m</div>
                                            </li>
                                        );
                                    }
                                }
                            }) : <></>}
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