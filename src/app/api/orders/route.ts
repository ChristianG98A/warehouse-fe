import addCrtNumberToRows from "@/helpers/objectParsers";
import axios from "axios";
import {NextRequest, NextResponse} from "next/server";
require('dotenv').config();

export async function GET (){
    console.log("mergeeeeeeee")
    return NextResponse.json({status:"ok"})
}

// GET ALL ORDERS

export async function POST(request:NextRequest) {
    const data =  await request.json();
    //console.log("this reaches the next api:\n", data)

    const url = 'https://whx.ybomedia.ro/Api/Orders/getAll';
    const token = process.env.API_TOKEN;
    const options = {
            headers: {
              //"Authorization": jwt != null ? "Bearer " + jwt : '',
                "Content-Type": "application/json",
                "YBO-Token": token
            },
    };
    const orders = axios.post(url, data, options)
        .catch((error) => {
            //errorLogger.error(error);
            console.log("Error in fetching order data:", error);
        })
        .then(
            (r: any) => {
                //console.log(JSON.parse(r.data))
                console.log(r)
                console.log(r.data)


                return addCrtNumberToRows(r.data)   // CAUTION HERE!!CAUTION HERE!!CAUTION HERE!!

            }
        )
        .catch(e=>console.log("Error in caught in returning api payload :36!\n", e))

    return NextResponse.json(await orders);
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


