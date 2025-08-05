export const userServiceLogin = async (username, password, csrfToken) => {
    console.log("received login request for ", username, password)

    const request = await fetch("https://chatify-api.up.railway.app/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            password: password,
            csrfToken: csrfToken
        })
    });

    const response = await request.json();
    
    return response;
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

export const userServiceInvite = async (userId, jwt) => {
    const request = await fetch(`https://chatify-api.up.railway.app/invite/${userId}`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify({
            conversationId: crypto.randomUUID()
        })
    });

    const response = await request.json();
    
    return response;
}

export const userServiceGetUsernameFromId = async (userId, jwt) => {
    const request = await fetch(`https://chatify-api.up.railway.app/users/${userId}`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        }
    });

    const response = await request.json();

    return response[0].username;
}