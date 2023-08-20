import Order, {allOrdersApiResponse} from "@/model/orders/OrderTypes";


const addCrtNumberToRows = (orders:allOrdersApiResponse)=>{
//    console.log(orders.response)
         return orders.response.map((order, index)=>{
                 return {crt: index+1, ...order}
             })
    }

export default addCrtNumberToRows;
