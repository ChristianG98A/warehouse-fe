

const addCrtNumberToRows = (orders:any)=>{
//    console.log(orders.response)
         return orders.response.map((order:any, index:any)=>{
                 return {crt: index+1, ...order}
             })
    }

export default addCrtNumberToRows;
