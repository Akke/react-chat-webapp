import "./ConversationList.css";
import ConversationItem from "../ConversationItem/ConversationItem";

const ConversationList = ({ isLoaded, conversations, messages, openConversation, activeConversation }) => {
    if(!isLoaded || !conversations.length) return;

    return (
        <div className="conversation-list">
            <ul>
                {conversations.map((id) => 
                    <ConversationItem
                        key={id} 
                        id={id}
                        openConversation={openConversation}
                        activeConversation={activeConversation}
                        messages={messages}
                        isLoaded={isLoaded} 
                    />
                )}
            </ul>
        </div>
    );
}  

export default ConversationList;