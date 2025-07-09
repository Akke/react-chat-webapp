import Copyright from "../Copyright/Copyright";
import "./Login.css";

const Login = () => {
    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-banner"></div>
                <div className="login-right-container">
                    <h1>Login to Chatify</h1>
                    <p>Stay connected across any distance — with the people who matter most.</p>

                    <form className="login-form">
                        <input type="text" name="username" placeholder="Username" />
                        <input type="password" name="password" placeholder="Password" />
                        <button type="submit">Login</button>
                    </form>

                    <div className="registration-notice">
                        <div className="text">Don't have an account?</div>
                    </div>

                    <div className="registration-button-container">
                        <a href="#">
                            <button className="secondary">Create an Account</button>
                        </a>
                    </div>
                </div>
            </div>

            <Copyright />
        </div>
    );
}

export default Login;