import axios from "axios";
import {NextRequest, NextResponse} from "next/server";
require('dotenv').config();

export async function DELETE(request: NextRequest) {
    const data = await request.json();

    const url = 'https://whx.ybomedia.ro/Api/Orders/deleteOrder';
    const token = process.env.API_TOKEN;
    const options = {
        headers: {
            //"Authorization": jwt != null ? "Bearer " + jwt : '',
            "Content-Type": "application/json",
            "YBO-Token": token
        },

    };
    const deleteResponse = axios.post(url, data, options)
        .catch((error) => {
            //errorLogger.error(error);
            console.log("Error caught in deleting order:", error);
        })
        .then(
            (r: any) => {
                //console.log(JSON.parse(r.data))
                console.log("response:\n", r)
                console.log("response data:\n", r.data)
                return r.data
            }
        )
        .catch(e => console.log("Error in caught in returning delete api payload\n", e))


    return NextResponse.json(await deleteResponse);
}
