import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { UserContext } from "../../contexts/UserProvider";
import formatDate from "../../utils/formatDate";

const ConversationItem = ({ id, openConversation, activeConversation, isLoaded, messages }) => {
    const { user } = useContext(AuthContext);
    const { cachedUsers } = useContext(UserContext);

    const latestMessage = messages.filter((m) => m.conversationId == id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    if(!latestMessage) return (
        <li key={id} onClick={() => openConversation(id)}>
            <div className="avatar"><img src={user.avatar} alt="Avatar" /></div>
            <div className="details">
                <div className="latest-message">
                    <div className="empty-conversation-notice">(Contains no messages. Be the first one to say hello!)</div>
                </div>
            </div>
        </li>
    );

    if(!cachedUsers[latestMessage.userId]) return null;

    const getParticipants = () => {
        const userIds = new Set();

        const filteredAndSorted = messages.forEach((m) => {
            if(m.conversationId == id && m.userId != user.id) {
                userIds.add(m.userId);
            }
        });

        return userIds;
    }

    const participants = Array.from(getParticipants()).map((pId) => cachedUsers[pId] && cachedUsers[pId].username).join(",") || user.user;

    const { username, avatar } = cachedUsers[latestMessage.userId];
    
    return (
        <li onClick={() => openConversation(id)} className={activeConversation == id ? "active" : ""}>
            <div className="avatar"><img src={avatar} alt="Avatar" /></div>
            <div className="details">
                <div className="username">{participants}</div>
                <div className="latest-message">
                    {latestMessage.userId == user.id ? "You: " : `${username}: `} 
                    {latestMessage.text.slice(0, 15)}...
                </div>
            </div>
            <div className="timestamp">{formatDate(latestMessage.createdAt)}</div>
        </li>
    );
}

export default ConversationItem;