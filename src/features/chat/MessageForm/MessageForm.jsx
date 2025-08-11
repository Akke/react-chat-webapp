import { IoSend } from "react-icons/io5";
import "./MessageForm.css";

const MessageForm = ({ onChatMessageSubmit }) => {
    return (
        <div className="bottom-message-input-container">
            <form action="POST" className="message-form" onSubmit={onChatMessageSubmit}>
                <input type="text" name="message" placeholder="Write your message here..." autoComplete="off" />
                <button><IoSend /></button>
            </form>
        </div>
    );
}

export default MessageForm;