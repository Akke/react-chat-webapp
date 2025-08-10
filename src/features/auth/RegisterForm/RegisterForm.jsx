import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import { NotifyContext } from "../../../contexts/NotifyProvider";
import { userServiceRegister } from "../../../service/userService";
import { redirect } from "react-router-dom";
import "./RegisterForm.css";
import MiniProfile from "../../chat/MiniProfile/MiniProfile";

const RegisterForm = () => {
    const { setAuth } = useContext(AuthContext);
    const { createNotification } = useContext(NotifyContext);

    const [avatarUrl, setAvatarUrl] = useState("");
    const [username, setUsername] = useState("");

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
            const request = await userServiceRegister(username, password, repeatPassword, email, avatar, csrfToken);
            if(request.error) {
                createNotification({ type: "error", msg: request.error });
            } else {
                createNotification({ type: "success", msg: request.message + ". Logging in and redirecting..." });
                loginUser(username, password);
            }
        }

        const loginUser = async (usr, pwd) => {
            const request = await userServiceLogin(usr, pwd, csrfToken);
            
            if(request.error) {
                createNotification({ type: "error", msg: request.error });
            } else {
                setAuth(request.token);
                redirect("/");
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
            <input type="text" name="username" placeholder="Username" onChange={onUsernameChanged} />
            <input type="password" name="password" placeholder="Password" />
            <input type="password" name="repeatpassword" placeholder="Repeat Password" />
            <input type="email" name="email" placeholder="E-mail" />
            <input type="text" name="avatar" placeholder="Avatar (URL)" onChange={onAvatarChanged} className="input-avatar" />

            <MiniProfile avatar={avatarUrl} username={username} />

            <p>By creating your account you agree to our Terms of Service and Privacy Policy.</p>
            <button type="submit">Confirm and create account</button>
        </form>
    );
}

export default RegisterForm;