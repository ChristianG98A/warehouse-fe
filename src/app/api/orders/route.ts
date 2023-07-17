import addCrtNumberToRows from "@/helpers/objectParsers";
import axios from "axios";
import {NextRequest, NextResponse} from "next/server";
require('dotenv').config();


// GET ALL ORDERS

export async function POST(request: NextRequest) {
    const data = await request.json();
    //console.log("this reaches the next api:\n", data)

    const url = 'https://whx.ybomedia.ro/Api/Orders/getAll';
    const token = process.env.API_TOKEN;
    const options = {
        method: "GET",
        headers: {
            //"Authorization": jwt != null ? "Bearer " + jwt : '',
            "Content-Type": "application/json",
            "YBO-Token": token
        },
    };

    try {
        const response = await axios.post(url, data, options);
        console.log(response);
        console.log(response.data);

        return NextResponse.json(addCrtNumberToRows(response.data));
    } catch (error) {
        //errorLogger.error(error);
        console.log("Error in fetching order data:", error);
        return NextResponse.error();
    }
};

// DELETE ONE ORDER BY ID
export async function DELETE(request:NextRequest){
    const data = await request.json();

    const url = 'https://whx.ybomedia.ro/Api/Orders/deleteOrder';
    const token = process.env.API_TOKEN;
    const options = {
            headers: {
              //"Authorization": jwt != null ? "Bearer " + jwt : '',
                "Content-Type": "application/json",
                "YBO-Token": token
            }
    };
    const deleteResponse = axios.post(url, options, data)
        .catch((error) => {
            //errorLogger.error(error);
            console.log("Error caught in deleting order:", error);
        })
        .then(
            (r: any) => {
                //console.log(JSON.parse(r.data))
                console.log(r)
                console.log(r.data)
                return r.data
            }
        )
        .catch(e=>console.log("Error in caught in returning delete api payload :68!\n", e))


    return NextResponse.json(await deleteResponse);
}


