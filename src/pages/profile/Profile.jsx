import { IoSave, IoWarning } from "react-icons/io5";
import "./Profile.css";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import AvatarPreview from "../../components/AvatarPreview/AvatarPreview";
import { userServiceDeleteUser, userServiceLogin, userServiceUpdateUser } from "../../service/userService";
import { NotifyContext } from "../../contexts/NotifyProvider";
import Modal from "../../components/Modal/Modal";

const Profile = () => {
    const { user, setAuth, clearAuth } = useContext(AuthContext);
    const [avatar, setAvatar] = useState(user.avatar);
    const { createNotification } = useContext(NotifyContext);
    const [csrfToken, setCsrfToken] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    
    useEffect(() => {
        fetch("https://chatify-api.up.railway.app/csrf", {
            method: "PATCH",
        })
        .then(res => res.json())
        .then(data => setCsrfToken(data.csrfToken))
    }, []);
    
    const onUserAvatarChanged = (e) => {
        setAvatar(e.target.value);
    }

    const onSubmitDeleteAccount = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get("username-delete-account-confirm");

        const sendForm = async () => {
            if(username != user.user) {
                createNotification({ type: "error", msg: "Please enter your username correctly to confirm deletion of your account." });
                return;
            }

            const deleteAccountRequest = await userServiceDeleteUser(user.id, user.jwt);
            if(deleteAccountRequest.error) {
                createNotification({ type: "error", msg: deleteAccountRequest.error });
                return;
            }

            createNotification({ type: "success", msg: deleteAccountRequest.message });
            clearAuth();
        }

        sendForm();
    }

    const onSettingsSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const avatar = formData.get("avatar");
        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");

        const sendForm = async () => {
            const initialFormAuthRequest = await userServiceLogin(user.user, password, csrfToken);
            if(initialFormAuthRequest.error) {
                createNotification({ type: "error", msg: initialFormAuthRequest.error });
                return;
            }

            const data = {
                user: username,
                avatar: avatar,
                email: email
            }

            const request = await userServiceUpdateUser(user.id, data, user.jwt);
            
            if(request.error) {
                createNotification({ type: "error", msg: request.error });
            } else {
                createNotification({ type: "success", msg: request.message });

                const updatedUserState = user;
                updatedUserState.avatar = avatar;
                updatedUserState.email = email;
                updatedUserState.user = username;

                const postFormAuthProcess = await userServiceLogin(username, password, csrfToken);
                if(postFormAuthProcess.error) {
                    createNotification({ type: "error", msg: postFormAuthProcess.error });
                } else {
                    setAuth(postFormAuthProcess.token);
                }
            }
        }

        sendForm();
    }

    return (
        <div className="profile-container">
            <div className="profile-inner-wrap">
                <h1>Profile</h1>

                <form className="profile-user-settings" method="POST" onSubmit={onSettingsSubmit}>
                    <AvatarPreview sourceUrl={avatar} />

                    <h3>Avatar</h3>
                    <input type="text" name="avatar" placeholder="Avatar (URL)" value={avatar} onChange={onUserAvatarChanged} />

                    <h3>Username</h3>
                    <input type="text" name="username" placeholder="Username" defaultValue={user.user} />

                    <h3>Email</h3>
                    <input type="text" name="email" placeholder="Email" defaultValue={user.email} />

                    <div className="confirm-password">
                        <p>Enter your password to verify and confirm your changes.</p>

                        <input type="password" name="password" placeholder="Password" />
                    </div>

                    <button type="submit"><IoSave /> Save</button>
                </form>

                <div className="delete-account">
                    <Modal
                        isVisible={modalVisible}
                        title={"Account Deletion Confirmation"}
                        content={(<>
                            <p>Are you sure you want to delete your account? This process cannot be undone.</p>
                            <p>Enter your username to confirm deletion of your account.</p>
                            <form method="DELETE" onSubmit={onSubmitDeleteAccount}>
                                <input type="text" name="username-delete-account-confirm"  placeholder="Username" />
                                <button type="submit" className="button-delete"><IoWarning /> Confirm and Delete Account</button>
                            </form>
                        </>)}
                        onHandleClose={() => setModalVisible(false)}
                    />
                    <button onClick={() => setModalVisible(true)} className="button-delete"><IoWarning /> Delete Account</button>
                </div>
            </div>
        </div>
    )
}

export default Profile;