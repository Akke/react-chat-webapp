import ConversationList from "../../features/chat/ConversationList/ConversationList";
import InviteUser from "../../features/chat/InviteUser/InviteUser";
import MessageList from "../../features/chat/MessageList/MessageList";
import MiniProfile from "../../features/chat/MiniProfile/MiniProfile";
import "./ChatPage.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { UserContext } from "../../contexts/UserProvider";
import { messageServiceGetConversations, messageServiceGetMessages, messageServicePostMessage } from "../../service/messageService";
import { NotifyContext } from "../../contexts/NotifyProvider";
import { LoggingContext } from "../../contexts/LoggingProvider";
import { IoChatboxEllipses } from "react-icons/io5";

const ChatPage = () => {
    const { user } = useContext(AuthContext);
    const { cacheUser, cachedUsers, cacheUsers } = useContext(UserContext);
    const { createNotification } = useContext(NotifyContext);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const { createLog } = useContext(LoggingContext);

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        /*messages.forEach(msg => {
            cacheUser(msg.userId);
        })*/
       cacheUsers();
    }, [messages]);

    const loadConversations = () => {
        getConversations()
            .then((conversationIds) => {
                if(!conversationIds) return;

                setConversations(conversationIds);

                conversationIds.map((id) => {
                    getMessages(id)
                        .then((response) => {
                            setMessages(prev => {
                                const msgs = response.filter((m) => !prev.some(ex => ex.id == m.id));

                                return [...prev, ...msgs];
                            })
                        })
                        .finally(() => setIsLoaded(true))
                        .catch((e) => createLog("error", e, "error_log_get_messages_promise"));
                });
            })
            .catch((e) => createLog("error", e, "error_log_get_conversations_promise"));
    }

    const getMessages = async (conversationId = null) => {
        const request = await messageServiceGetMessages(user.jwt, conversationId);
        
        if(request.error) {
            createNotification({ type: "error", msg: request.error });
            createLog("error", request.error, "error_log_get_messages");
        } else {
            return request;              
        }

        return null;
    }

    const getConversations = async () => {
        const request = await messageServiceGetConversations(user.jwt);
        
        if(request.error) {
            createNotification({ type: "error", msg: request.error });
            createLog("error", request.error, "error_log_get_conversations");
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
                createLog("error", request.error, "error_log_on_chat_message_submit");
            } else {
                e.target.reset();
                const msgObj = {
                    id: request.latestMessage.id,
                    text: request.latestMessage.text,
                    createdAt: Date.now(),
                    userId: user.id,
                    conversationId: request.latestMessage.conversationId
                };

                setMessages(prev => [...prev, msgObj]);
            }
        }

        sendMessage();
    }

    const openConversation = async (id) => {
        setActiveConversation(id);
    }

    return (
        <div className="chat-container">
            <div className="left-side-bar">
                <MiniProfile 
                    avatar={user.avatar}
                    username={user.user} 
                />

                <InviteUser
                    setConversations={setConversations} 
                />

                <ConversationList
                    isLoaded={isLoaded}
                    conversations={conversations}
                    messages={messages}
                    openConversation={openConversation}
                    activeConversation={activeConversation} 
                />
            </div>

            <div className="right-side-message-container">
                {activeConversation ? 
                    <MessageList
                        activeConversation={activeConversation}
                        messages={messages}
                        setMessages={setMessages}
                        onChatMessageSubmit={onChatMessageSubmit}
                    /> :
                    <IoChatboxEllipses className="no-chats" />
                }
            </div>
        </div>
    );
}

export default ChatPage;