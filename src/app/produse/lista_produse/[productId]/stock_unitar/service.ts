import {callNextApi} from "@/helpers/apiMethods";

export const getStockLines = async (product_id: number) => {
    //setLoading(true)
    const data = await callNextApi("POST", "products/getProductsStockLines", {product_id:product_id})
        .then(r => r);
    return data;
}

export const setEan = async (row_id: number, ean:number) => {
    const data = await callNextApi("POST", "products/updateStockRowEanValue", {
        row_id:row_id,
        ean: ean,
    })
        .then(r => r);
    return data;
}


export default null;
