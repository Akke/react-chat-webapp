import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import { UserContext } from "../../../contexts/UserProvider";
import formatDate from "../../../utils/formatDate";
import "./MessageItem.css";
import AvatarPreview from "../../../components/AvatarPreview/AvatarPreview";

const MessageItem = ({ currentConversationMessages, item, i }) => {
    const { cachedUsers } = useContext(UserContext);
    const { user } = useContext(AuthContext);

    const { username, avatar } = cachedUsers[item.userId];
    const prevMessage = currentConversationMessages[i-1];

    let bSimplifyUI = prevMessage && prevMessage.userId == item.userId // whether to show less / "simplify" UI

    return (
        <div className={`message-container ${item.userId == user.id ? "self" : ""} ${bSimplifyUI ? "simplified" : ""}`} key={item.id}>
            <AvatarPreview sourceUrl={avatar} small={true} />

            <div className="message-body">
                <div className="message-header">
                    <div className="message-user">{username}</div>
                    <div className="message-timestamp">{formatDate(item.createdAt)}</div>
                    <div className="message-actions">Delete</div>
                </div>
                <div className="message-content">{item.text}</div>
            </div>
        </div>
    );
}

export default MessageItem;