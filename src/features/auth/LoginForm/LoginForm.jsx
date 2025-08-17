import { useContext } from "react";
import { userServiceLogin } from "../../../service/userService";
import { NotifyContext } from "../../../contexts/NotifyProvider";
import { AuthContext } from "../../../contexts/AuthProvider";
import "./LoginForm.css";
import { LoggingContext } from "../../../contexts/LoggingProvider";

const LoginForm = ({ csrfToken }) => {
    const { createNotification } = useContext(NotifyContext);
    const { setAuth } = useContext(AuthContext);
    const { createLog } = useContext(LoggingContext);

    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get("username");
        const password = formData.get("password");

        const sendForm = async () => {
            createLog("info", "Sending request to external API GET /auth/token", "info_log_login_send_form_request_api");

            const request = await userServiceLogin(username, password, csrfToken);
            
            if(request.error) {
                createNotification({ type: "error", msg: request.error });
                createLog("error", request.error, "error_log_login_send_form");
            } else {
                setAuth(request.token);
                createLog("info", `User '${username}' logged in successfully (200 OK).`, "info_log_login_send_form");
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