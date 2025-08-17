import { IoChatboxEllipses } from "react-icons/io5";
import "./MessageList.css";
import MessageItem from "../MessageItem/MessageItem";
import MessageForm from "../MessageForm/MessageForm";
import { useEffect } from "react";

const MessageList = ({ activeConversation, messages, setMessages, onChatMessageSubmit }) => {
    const conversationMessages = messages.filter((m) => m.conversationId == activeConversation);

    return (
        <>
            <div className="messages-list">
                {conversationMessages.map((item, i) => 
                    <MessageItem
                        key={item.id}
                        item={item}
                        i={i}
                        conversationMessages={conversationMessages}
                        messages={messages}
                        setMessages={setMessages}
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