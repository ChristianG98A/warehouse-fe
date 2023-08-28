import axios from "axios";
import {NextRequest, NextResponse} from "next/server";
require('dotenv').config();



export async function POST(request: NextRequest) {
    const data= await request.json();
    console.log("\n data in proxy:\n", data)
    const token = process.env.API_TOKEN
    //console.log("this reaches the next api:\n", data)

    const url = 'https://whx.ybomedia.ro/Api/Products/deleteEan';
    const options = {
        method: "POST",
        headers: {
            //"Authorization": jwt != null ? "Bearer " + jwt : '',
            "Content-Type": "application/json",
            "YBO-Token": token
        },
    };

    try {
        const response = await axios.post(url, data, options);
        console.log("Response data: ", response.data);

        return NextResponse.json(response.data);
    } catch (error) {
        //errorLogger.error(error);
        console.log("Error in fetching invoice data in getPurchase!:", error);
        return NextResponse.error();
    }
};
