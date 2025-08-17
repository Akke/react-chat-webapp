import { useContext, useRef, useState } from "react";
import "./InviteUser.css";
import { userServiceGetUserFromId, userServiceInvite } from "../../../service/userService";
import { NotifyContext } from "../../../contexts/NotifyProvider";
import { AuthContext } from "../../../contexts/AuthProvider";
import Modal from "../../../components/Modal/Modal";
import MiniProfile from "../MiniProfile/MiniProfile";
import { LoggingContext } from "../../../contexts/LoggingProvider";

const InviteUser = ({ setConversations }) => {
    const { createNotification } = useContext(NotifyContext);
    const { user } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [invitedUser, setInvitedUser] = useState(null);
    const inviteButton = useRef(null);
    const { createLog } = useContext(LoggingContext);

    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const userId = formData.get("userId");

        const getInvitedUserData = async () => {
            const request = await userServiceGetUserFromId(userId, user.jwt);
            console.log(request)
            if(request.error) {
                createNotification({ type: "error", msg: request.error });
                createLog("error", request.error, "error_log_get_invited_user_data");
            } else {
                setInvitedUser(request);
                inviteButton.current.innerText = "Send Invite";
            }
        }

        const sendForm = async () => {
            const guid = crypto.randomUUID();
            const request = await userServiceInvite(userId, guid, user.jwt);

            if(request.error) {
                createNotification({ type: "error", msg: request.error });
                createLog("error", request.error, "error_log_invite_user_send_form");
            } else {
                createNotification({ type: "success", msg: request.message });
                setConversations(prev => ([...prev, guid]));
                e.target.reset();
            }
        }

        // server doesnt handle this error for some reason
        if(!userId) {
            createNotification({ type: "error", msg: "Enter a user ID." });
        } else {
            if(!invitedUser) {
                getInvitedUserData();
            } else {
                sendForm();
            }
        }
    }

    return (
        <div className="chat-invite-user-container">
            <Modal
                isVisible={modalVisible}
                title={"Invite a user"}
                content={(<>
                    <p>You can invite another user to start a conversation with them, all you need is their unique identifier. Enter their user ID to preview the user before inviting them.</p>
                    
                    {invitedUser ? 
                        <MiniProfile 
                            avatar={invitedUser.avatar}
                            username={invitedUser.username}
                        /> 
                    : <></> }

                    <form action="POST" className="chat-invite-user-form" onSubmit={onSubmit}>
                        <input type="text" name="userId" placeholder="Enter a User ID" />
                        <button type="submit" ref={inviteButton}>Preview User</button>
                    </form>
                </>)}
                onHandleClose={() => setModalVisible(false)}
            />
            <button className="invite-button" onClick={() => setModalVisible(true)}>Invite User</button>
        </div>
    );
};

export default InviteUser;