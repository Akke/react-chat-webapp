import { useContext, useState } from "react";
import "./InviteUser.css";
import { userServiceInvite } from "../../../service/userService";
import { NotifyContext } from "../../../contexts/NotifyProvider";
import { AuthContext } from "../../../contexts/AuthProvider";
import Modal from "../../../components/Modal/Modal";

const InviteUser = () => {
    const { createNotification } = useContext(NotifyContext);
    const { user } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const userId = formData.get("userId");

        const sendForm = async () => {
            const request = await userServiceInvite(userId, user.jwt);

            if(request.error) {
                createNotification({ type: "error", msg: request.error });
            } else {
                createNotification({ type: "success", msg: request.message });

                e.target.reset();
            }
        }

        // server doesnt handle this error for some reason
        if(!userId) {
            createNotification({ type: "error", msg: "Enter a user ID." });
        } else {
            sendForm();
        }
    }

    return (
        <div className="chat-invite-user-container">
            <Modal
                isVisible={modalVisible}
                title={"Invite a user"}
                content={(<>
                    <p>You can invite another user to start a conversation with them, all you need is their unique identifier.</p>
                    <form action="POST" className="chat-invite-user-form" onSubmit={onSubmit}>
                        <input type="text" name="userId" placeholder="Enter a User ID" />
                        <button type="submit">Send Invite</button>
                    </form>
                </>)}
                onHandleClose={() => setModalVisible(false)}
            />
            <button className="invite-button" onClick={() => setModalVisible(true)}>Invite User</button>
        </div>
    );
};

export default InviteUser;