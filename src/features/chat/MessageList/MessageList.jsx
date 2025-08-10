import { IoChatboxEllipses } from "react-icons/io5";
import "./MessageList.css";
import MessageItem from "../MessageItem/MessageItem";
import MessageForm from "../MessageForm/MessageForm";

const MessageList = ({ activeConversation, currentConversationMessages, onChatMessageSubmit }) => {
    if(!activeConversation) return <IoChatboxEllipses className="no-chats" />;

    return (
        <>
            <div className="messages-list">
                {currentConversationMessages.map((item, i) => 
                    <MessageItem
                        key={item.id}
                        currentConversationMessages={currentConversationMessages}
                        item={item}
                        i={i}
                    />
                )}
            </div>

            <MessageForm
                onChatMessageSubmit={onChatMessageSubmit}
            />
        </>
    );
}

export default MessageList;