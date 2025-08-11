import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import { UserContext } from "../../../contexts/UserProvider";
import { convertDateToRelevantTime, formatDateToReadable } from "../../../utils/formatDate";
import "./MessageItem.css";
import AvatarPreview from "../../../components/AvatarPreview/AvatarPreview";
import { messageServiceDeleteMessage } from "../../../service/messageService";
import { NotifyContext } from "../../../contexts/NotifyProvider";

const MessageItem = ({ currentConversationMessages, setCurrentConversationMessages, item, i }) => {
    const { cachedUsers } = useContext(UserContext);
    const { user } = useContext(AuthContext);
    const { createNotification } = useContext(NotifyContext);
    const { username, avatar } = cachedUsers[item.userId];
    const lastMessage = currentConversationMessages[i+1];
    const bSimplifyUI = lastMessage && lastMessage.userId == item.userId // whether to show less / "simplify" UI
    const bBelongsToSelf = item.userId == user.id;

    const onDeleteMessage = () => {
        const request = messageServiceDeleteMessage(item.id, user.jwt);

        if(request.error) {
            createNotification({ type: "error", msg: request.error });
        } else {
            createNotification({ type: "success", msg: "Message deleted successfully." });
            const updatedConversationMessages = currentConversationMessages.filter(f => f.id != item.id);
            setCurrentConversationMessages(updatedConversationMessages);
        }
    }

    return (
        <div className={`message-container ${bBelongsToSelf ? "self" : ""} ${bSimplifyUI ? "simplified" : ""}`} key={item.id}>
            <AvatarPreview sourceUrl={avatar} small={true} />

            <div className="message-body">
                <div className="message-header">
                    <div className="message-user">{username}</div>
                </div>
                <div className="message-content">{item.text}</div>
                <div className="message-footer">
                    <div className="message-actions">
                        {bBelongsToSelf ? <div className="message-delete" onClick={onDeleteMessage}>Delete</div> : ""}
                    </div>
                    <div className="message-timestamp">{formatDateToReadable(item.createdAt)} ({convertDateToRelevantTime(item.createdAt)})</div>
                </div>
            </div>
        </div>
    );
}

export default MessageItem;