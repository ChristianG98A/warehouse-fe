import {callNextApi} from "@/helpers/apiMethods";

    const getOrderDetails = async (orderId: number) => {
        const data = await callNextApi("POST", "orders/getOrder", {id: orderId})
            .catch((e:Error) => console.log("Error in fetching invoice products: ", e))
            .then((r: any) => {
                return r
            })
            return data;
    }

    export default getOrderDetails;
