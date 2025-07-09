import Copyright from "../Copyright/Copyright";
import "./Register.css";

const Register = () => {
    return (
        <div className="register-wrapper">
            <div className="register-container">
                <div className="register-right-container">
                    <h1>Create an account</h1>
                    <p>Sign up now, create your account for free and start chatting with friends and family from all cross the world!</p>

                    <form className="register-form">
                        <input type="text" name="username" placeholder="Username" />
                        <input type="password" name="password" placeholder="Password" />
                        <input type="password" name="repeatpassword" placeholder="Repeat Password" />
                        <input type="email" name="email" placeholder="E-mail" />
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