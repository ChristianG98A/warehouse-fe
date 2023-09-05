import {callNextApi} from "@/helpers/apiMethods";

export const getStockLines = async (product_id: number) => {
    //setLoading(true)
    const data = await callNextApi("POST", "products/getProductsStockLines", {product_id:product_id})
        .then(r => r);
    return data;
}


export default null;
