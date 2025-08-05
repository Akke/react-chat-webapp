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
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        getConversations()
            .then((conversationIds) => {
                setConversations(conversationIds);

                conversationIds.map((id) => {
                    getMessages(id)
                        .then((response) => setMessages(prev => ([...prev, ...response])))
                        .finally(() => setIsLoaded(true))
                        .catch((e) => console.error(e));
                });
            })
            .catch((e) => console.error(e));
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
            const msgs = await getMessages(id); // fetch fresh when opening conversation
            const filtered = msgs.filter((m) => m.conversationId == id);

            setCurrentConversationMessages(filtered);
            setActiveConversation(id);
        }

        getAndFilterMessages();
    }

    const getLatestConversationMessage = (id) => {
        if(!isLoaded) return;
        
        const filteredAndSorted = messages.filter((m) => m.conversationId == id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return filteredAndSorted[0];
    }

    const formatMessagePreview = (text) => {
        const limit = 40;
        let trunc = text.slice(0, limit);
        if(trunc.length == limit) trunc += "...";
        return trunc;
    }

    const formatMessageTimestamp = (timestamp) => {
        const units = {
            year: 24 * 60 * 60 * 1000 * 365,
            month: 24 * 60 * 60 * 1000 * 365/12,
            day: 24 * 60 * 60 * 1000,
            hour: 60 * 60 * 1000,
            minute: 60 * 1000,
            second: 1000
        }

        const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto", style: "narrow" });
        const elapsed = new Date(timestamp) - new Date();
        for(const unit in units) {
            if(Math.abs(elapsed) > units[unit] || unit == "second") {
                const time = Math.round(elapsed / units[unit]);
                return rtf.format(time, unit)
            }
        }
    }

    const getConversationParticipantsExceptSelf = (id) => {
        const participants = [];

        const filteredAndSorted = messages.filter((m) => {
            if(m.conversationId == id && m.userId != user.id && !participants.includes(m.userId)) {
                participants.push(m.userId);
            }
        });


        return participants.length ? participants : [user.id];
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
                            {(isLoaded && conversations && conversations.length) ? conversations.map((id) => {
                                const conversationData = getLatestConversationMessage(id);

                                const participants = getConversationParticipantsExceptSelf(id);
                                const participantsUsernames = participants.map((p) => {
                                    const temp = [];
                                    temp.push(cachedUsernames[p]);
                                    return temp.join(",");
                                });

                                if(conversationData) {
                                    const username = cachedUsernames[conversationData.userId];
                                    
                                    if(username) {
                                        return (
                                            <li key={id} onClick={() => openConversation(id)}>
                                                <div className="avatar"><img src={user.avatar} alt="Avatar" /></div>
                                                <div className="details">
                                                    <div className="username">{participantsUsernames}</div>
                                                    <div className="latest-message">
                                                        {conversationData.userId == user.id ? "You: " : `${username}: `} 
                                                        {formatMessagePreview(conversationData.text)}
                                                    </div>
                                                </div>
                                                <div className="timestamp">{formatMessageTimestamp(conversationData.createdAt)}</div>
                                            </li>
                                        );
                                    }
                                } else {
                                    return (
                                            <li key={id} onClick={() => openConversation(id)}>
                                                <div className="avatar"><img src={user.avatar} alt="Avatar" /></div>
                                                <div className="details">
                                                    <div className="latest-message">
                                                        No Messages
                                                    </div>
                                                </div>
                                            </li>
                                        );
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