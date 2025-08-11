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

const ChatPage = () => {
    const { user } = useContext(AuthContext);
    const { cacheUser, cachedUsers } = useContext(UserContext);
    const { createNotification } = useContext(NotifyContext);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [currentConversationMessages, setCurrentConversationMessages] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

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
            cacheUser(msg.userId);
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
    
    return (
        <div className="chat-container">
            <div className="left-side-bar">
                <MiniProfile 
                    avatar={user.avatar}
                    username={user.user} 
                />

                <InviteUser />

                <ConversationList
                    isLoaded={isLoaded}
                    conversations={conversations}
                    messages={messages}
                    openConversation={openConversation}
                    activeConversation={activeConversation} 
                />
            </div>

            <div className="right-side-message-container">
                <MessageList
                    activeConversation={activeConversation}
                    currentConversationMessages={currentConversationMessages} 
                    setCurrentConversationMessages={setCurrentConversationMessages}
                    onChatMessageSubmit={onChatMessageSubmit}
                />
            </div>
        </div>
    );
}

export default ChatPage;