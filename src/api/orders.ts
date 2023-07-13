
export const getOrders= async ()=>{
    //const jwt = getLocalAuthToken()?.jwtToken;

    try {
        const response = await fetch("https://whx.ybomedia.ro/Api/Orders/getAll", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "YBO-Token": "Token123123" //jwt != null ? "Bearer " + jwt : ""
            },
            body:{
                limit:10,
                offset:0,
            }
        });
        const responseData = await response.json();
        return responseData //as Group[];
    } catch (e) {
        return undefined;
    }
}
