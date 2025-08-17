export const userServiceLogin = async (username, password, csrfToken) => {
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

export const userServiceInvite = async (userId, guid, jwt) => {
    const request = await fetch(`https://chatify-api.up.railway.app/invite/${userId}`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify({
            conversationId: guid
        })
    });

    const response = await request.json();
    
    return response;
}

export const userServiceGetUserFromId = async (userId, jwt) => {
    const request = await fetch(`https://chatify-api.up.railway.app/users/${userId}`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        }
    });

    const response = await request.json();

    return response[0];
}

export const userServiceUpdateUser = async (userId, data, jwt) => {
    const request = await fetch(`https://chatify-api.up.railway.app/user`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify({
            userId: userId,
            updatedData: data
        })
    });

    const response = await request.json();

    return response;
}

export const userServiceDeleteUser = async (userId, jwt) => {
    const request = await fetch(`https://chatify-api.up.railway.app/users/${userId}`, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        }
    });

    const response = await request.json();

    return response;
}

export const userServiceGetUsers = async (jwt) => {
    const request = await fetch(`https://chatify-api.up.railway.app/users`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        }
    });

    const response = await request.json();

    return response;
}