import { useEffect, useState } from "react";
import "./RegisterPage.css";
import RegisterForm from "../../features/auth/RegisterForm/RegisterForm";

const RegisterPage = ({ notify }) => {
    const [csrfToken, setCsrfToken] = useState("");

    useEffect(() => {
        fetch("https://chatify-api.up.railway.app/csrf", {
            method: "PATCH",
        })
        .then(res => res.json())
        .then(data => setCsrfToken(data.csrfToken))
    }, []);

    return (
        <div className="register-right-container">
            <h1>Create an account</h1>
            <p>Sign up now, create your account for free and start chatting with friends and family from all cross the world!</p>

            <RegisterForm />
        </div>
    );
}

export default RegisterPage;