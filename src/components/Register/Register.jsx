import { useContext, useEffect, useState } from "react";
import Copyright from "../Copyright/Copyright";
import "./Register.css";
import { userServiceLogin, userServiceRegister } from "../../service/userService";
import { NotifyContext } from "../../contexts/NotifyProvider";
import { AuthContext } from "../../contexts/AuthProvider";

const Register = ({ notify }) => {
    const { setAuth } = useContext(AuthContext);
    const { createNotification } = useContext(NotifyContext);

    const [csrfToken, setCsrfToken] = useState("");
    
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

    useEffect(() => {
        fetch("https://chatify-api.up.railway.app/csrf", {
            method: "PATCH",
        })
        .then(res => res.json())
        .then(data => setCsrfToken(data.csrfToken))
    }, []);

    return (
        <div className="register-wrapper">
            <div className="register-container">
                <div className="register-banner">
                    <img src="banner.png" alt="Banner" />
                </div>

                <div className="register-right-container">
                    <h1>Create an account</h1>
                    <p>Sign up now, create your account for free and start chatting with friends and family from all cross the world!</p>

                    <form className="register-form" onSubmit={onSubmit}>
                        <input type="text" name="username" placeholder="Username" />
                        <input type="password" name="password" placeholder="Password" />
                        <input type="password" name="repeatpassword" placeholder="Repeat Password" />
                        <input type="email" name="email" placeholder="E-mail" />
                        <input type="text" name="avatar" placeholder="Avatar (URL)" />
                        <p>By creating your account you agree to our Terms of Service and Privacy Policy.</p>
                        <button type="submit">Confirm and create account</button>
                    </form>
                </div>
            </div>

            <Copyright />
        </div>
    );
}

export default Register;