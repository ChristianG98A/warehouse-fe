import axios from "axios";
import {NextResponse} from "next/server";
require('dotenv').config();

//export async function GET(limit:number, offset:number) {
export async function POST(request:Request) {
    const data =  request//.json

    const url = 'https://whx.ybomedia.ro/Api/Orders/getAll';
    const token = process.env.API_TOKEN;
    const options = {
            headers: {
              //"Authorization": jwt != null ? "Bearer " + jwt : '',
                "Content-Type": "application/json",
                "YBO-Token": "Token123123"
            },
    };
    const orders = axios.post(url, {limit:20, offset:1}, options)
        .catch((error) => {
            //errorLogger.error(error);
            console.log("Error in fetching order data:", error);
        })
        .then(
            (r: any) => {
                //console.log(JSON.parse(r.data))

                return r.data
            }
        )

    return NextResponse.json(await orders);
};

