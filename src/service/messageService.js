export const messageServiceGetConversations = async (jwt) => {
    const request = await fetch("https://chatify-api.up.railway.app/conversations", {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        }
    });

    const response = await request.json();
    
    return response;
}

export const messageServiceGetMessages = async (jwt, conversationId = null) => {
    let body = {}
    let url = "https://chatify-api.up.railway.app/messages"

    if(conversationId) {
        body = {
            conversationId: conversationId
        }

        url = `https://chatify-api.up.railway.app/messages?conversationId=${conversationId}`
    }

    const request = await fetch(url, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        }
    });

    const response = await request.json();
    
    return response;
}

export const messageServicePostMessage = async (text, conversationId, jwt) => {
    const request = await fetch("https://chatify-api.up.railway.app/messages", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify({
            text: text,
            conversationId: conversationId,
        })
    });

    const response = await request.json();
    
    return response;
}

export const messageServiceDeleteMessage = async (msgId, jwt) => {
    const request = await fetch(`https://chatify-api.up.railway.app/messages/${msgId}`, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        }
    });

    const response = await request.json();
    
    return response;
}