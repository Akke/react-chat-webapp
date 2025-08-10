import { useContext } from "react";
import { userServiceLogin } from "../../../service/userService";
import { NotifyContext } from "../../../contexts/NotifyProvider";
import { AuthContext } from "../../../contexts/AuthProvider";
import "./LoginForm.css";

const LoginForm = ({ csrfToken }) => {
    const { createNotification } = useContext(NotifyContext);
    const { setAuth } = useContext(AuthContext);

    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get("username");
        const password = formData.get("password");

        const sendForm = async () => {
            const request = await userServiceLogin(username, password, csrfToken);
            
            if(request.error) {
                createNotification({ type: "error", msg: request.error });
            } else {
                setAuth(request.token);
            }
        }

        sendForm();
    }
    
    return (
        <form className="login-form" onSubmit={onSubmit}>
            <input type="text" name="username" placeholder="Username" />
            <input type="password" name="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginForm;