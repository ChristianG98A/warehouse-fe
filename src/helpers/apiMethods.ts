require('dotenv').config();

const token:any = process.env.API_TOKEN;



export const callNextApi = async (method:"GET"|"POST"|"PATCH"|"UPDATE"|"DELETE", endpoint:string, body:any) => {
    //const jwt = getLocalAuthToken()?.jwtToken;
    const url = "/api/" + endpoint;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "YBO-Token": JSON.stringify(token)
            },
            body: JSON.stringify(body),
        });
        const responseData = await response.json();
        return responseData //as UserAdd;
    } catch (e) {
        return {};
    }
};
