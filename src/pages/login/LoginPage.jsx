import { useState, useEffect } from "react";
import "./LoginPage.css";
import { Link } from "react-router-dom";
import LoginForm from "../../features/auth/LoginForm/LoginForm";

const LoginPage = ({}) => {
    const [csrfToken, setCsrfToken] = useState("");

    useEffect(() => {
        fetch("https://chatify-api.up.railway.app/csrf", {
            method: "PATCH",
        })
        .then(res => res.json())
        .then(data => setCsrfToken(data.csrfToken))
    }, []);

    return (
        <div className="login-right-container">
            <h1>Login to Chatify</h1>
            <p>Stay connected across any distance — with the people who matter most.</p>

            <LoginForm csrfToken={csrfToken} />

            <div className="registration-notice">
                <div className="text">Don't have an account?</div>
            </div>

            <div className="registration-button-container">
                <Link to="/register"><button className="secondary">Create an Account</button></Link>
            </div>
        </div>
    );
}

export default LoginPage;