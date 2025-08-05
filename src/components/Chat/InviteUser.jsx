import { useContext, useState } from "react";
import "./InviteUser.css";
import { IoAdd, IoClose } from "react-icons/io5";
import { userServiceInvite } from "../../service/userService";
import { NotifyContext } from "../../contexts/NotifyProvider";
import { AuthContext } from "../../contexts/AuthProvider";

const InviteUser = () => {
    const { createNotification } = useContext(NotifyContext);
    const { user } = useContext(AuthContext);
    const [visible, setVisible] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const userId = formData.get("userId");

        const sendForm = async () => {
            const request = await userServiceInvite(userId, user.jwt);

            console.log(request)
            
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
            <button className="invite-button" onClick={() => setVisible(true)}>Invite User</button>

            {visible ? <>
                <div className="chat-invite-overlay"></div>
                <div className="chat-invite-user">
                    <div className="title">
                        <h2>Invite a user</h2>
                        <div className="close" onClick={() => setVisible(false)}><IoClose /></div>
                    </div>

                    <p>You can invite another user to start a conversation with them, all you need is their unique identifier.</p>
                    <form action="POST" className="chat-invite-user-form" onSubmit={onSubmit}>
                        <input type="text" name="userId" placeholder="Enter a User ID" />
                        <button type="submit"><IoAdd /></button>
                    </form>
                </div>
            </> : <></>}
            
        </div>
    );
};

export default InviteUser;