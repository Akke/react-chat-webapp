import { useState, useEffect, useContext } from "react";
import { userServiceLogin } from "../../service/userService";
import Copyright from "../Copyright/Copyright";
import "./Login.css";
import { NotifyContext } from "../../contexts/NotifyProvider";
import { Link } from "react-router-dom";

const Login = ({}) => {
    const { createNotification } = useContext(NotifyContext);

    const [csrfToken, setCsrfToken] = useState("");
        
    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get("username");
        const password = formData.get("password");

        const sendForm = async () => {
            const request = await userServiceLogin(username, password, csrfToken);
            console.log(request)
            if(request.error) {
                createNotification({ type: "error", msg: request.error });
            } else {
                createNotification({ type: "success", msg: request.message + ". Logging in and redirecting..." });
            }
        }

        sendForm();
    }

    useEffect(() => {
        fetch("https://chatify-api.up.railway.app/csrf", {
            method: "PATCH",
        })
        .then(res => res.json())
        .then(data => setCsrfToken(data.csrfToken))
    }, []);

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-banner">
                    <img src="banner.png" alt="Banner" />
                </div>

                <div className="login-right-container">
                    <h1>Login to Chatify</h1>
                    <p>Stay connected across any distance — with the people who matter most.</p>

                    <form className="login-form" onSubmit={onSubmit}>
                        <input type="text" name="username" placeholder="Username" />
                        <input type="password" name="password" placeholder="Password" />
                        <button type="submit">Login</button>
                    </form>

                    <div className="registration-notice">
                        <div className="text">Don't have an account?</div>
                    </div>

                    <div className="registration-button-container">
                        <Link to="/register"><button className="secondary">Create an Account</button></Link>
                    </div>
                </div>
            </div>

            <Copyright />
        </div>
    );
}

export default Login;