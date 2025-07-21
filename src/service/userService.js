export const userServiceLogin = (username, password) => {
    console.log("received login request for ", username, password)
}

export const userServiceRegister = async (username, password, repeatPassword, email, avatar, csrfToken) => {
    console.log("received register request for ", username, password, repeatPassword, email)

    const request = await fetch("https://chatify-api.up.railway.app/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            password: password,
            email: email,
            avatar:  avatar,
            csrfToken: csrfToken
        })
    });

    const response = await request.json();
    
    return response;
}