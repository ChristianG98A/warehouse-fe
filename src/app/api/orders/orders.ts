
export const getOrders= async (limit:number, offset:number)=>{
    //const jwt = getLocalAuthToken()?.jwtToken;

    const body:string = JSON.stringify({
        limit:limit,
        offset:offset
    })
    try {
        const response = await fetch("http:localhost:3000/Api/Orders/getAll", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "YBO-Token": "Token123123" ,//jwt != null ? "Bearer " + jwt : ""
            },
            body:body
        });
        const responseData = await response.json();
        return responseData //as Group[];
    } catch (e) {
        return undefined;
    }
}
