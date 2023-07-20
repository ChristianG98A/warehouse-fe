import {allOrdersApiResponse} from "@/components/types/Order";
import addCrtNumberToRows from "./objectParsers";

require('dotenv').config();

const token:any = process.env.API_TOKEN;



export const callNextApi = async (method:"GET"|"POST"|"PATCH"|"UPDATE"|"DELETE", endpoint:string, body?:any | null) => {
    //const jwt = getLocalAuthToken()?.jwtToken;
    const url = "/api/" + endpoint;

//    console.log("This is the body that gets in nextApiCaller:\n", body)

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "YBO-Token": JSON.stringify(token)
            },
            body: JSON.stringify(body)
        }).then(
        r=>{
            console.log("Response in next api:\n", r)
            return r;
        }
        );
        const responseData = await response.json()
        .catch(e=>console.log("Error caught in next api call! \n", e))
        .then(
            (r:allOrdersApiResponse)=>{
                return(r)
            }
        );
        return responseData //as UserAdd;
    } catch (e) {
        return {};
    }
};
