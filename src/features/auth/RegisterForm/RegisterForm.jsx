import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import { NotifyContext } from "../../../contexts/NotifyProvider";
import { userServiceRegister } from "../../../service/userService";
import "./RegisterForm.css";
import MiniProfile from "../../chat/MiniProfile/MiniProfile";
import { useNavigate } from "react-router-dom";
import { LoggingContext } from "../../../contexts/LoggingProvider";

const RegisterForm = ({ csrfToken }) => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const { createNotification } = useContext(NotifyContext);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [username, setUsername] = useState("");
    const { createLog } = useContext(LoggingContext);

    const onAvatarChanged = (e) => {
        setAvatarUrl(e.target.value);
    }

    const onUsernameChanged = (e) => {
        setUsername(e.target.value);
    }
    
    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get("username");
        const password = formData.get("password");
        const repeatPassword = formData.get("repeatpassword");
        const email = formData.get("email");
        const avatar = formData.get("avatar");

        const sendForm = async () => {
            createLog("info", "Sending request to external API POST /auth/register", "info_log_register_send_form_request_api");

            const request = await userServiceRegister(username, password, repeatPassword, email, avatar, csrfToken);
            if(request.error) {
                createNotification({ type: "error", msg: request.error });
                createLog("error", request.error, "error_log_register_send_form");
            } else {
                createNotification({ type: "success", msg: request.message + ". Redirecting to login." });
                createLog("info", `User '${username}' was created successfully (201 User registered successfully).`, "info_log_register_send_form");
                navigate("/login");
            }
        }

        if(password === repeatPassword) {
            const isEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
            if(!isEmailRegex.test(email)) {
                createNotification({ type: "error", msg: "Email is not  valid." });
            } else {
                sendForm();
            }
        } else {
            createNotification({ type: "error", msg: "Password don't match." });
        }
    }

    return (
        <form className="register-form" onSubmit={onSubmit}>
            <input type="text" name="username" placeholder="Username" onChange={onUsernameChanged} required />
            <input type="password" name="password" placeholder="Password" required />
            <input type="password" name="repeatpassword" placeholder="Repeat Password" required />
            <input type="email" name="email" placeholder="E-mail" required />
            <input type="text" name="avatar" placeholder="Avatar (URL)" onChange={onAvatarChanged} className="input-avatar" required />

            <MiniProfile avatar={avatarUrl} username={username} />

            <p>By creating your account you agree to our Terms of Service and Privacy Policy.</p>
            <button type="submit">Confirm and create account</button>
        </form>
    );
}

export default RegisterForm;