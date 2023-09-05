import {callNextApi} from "@/helpers/apiMethods";
import {TransferProductInBasket} from "@/model/transfers/TransferTypes";

export default null;

export const handleSubmitProducts = async (transferId:number, transferProductBasket:TransferProductInBasket[]) => {
    //setLoading(true)
    const data = await callNextApi("POST", "transfers/addProduct", {
        transfer_id: transferId,
        products: transferProductBasket?.map((product: any) => { // refactor!!
            return ({
                product_id: parseInt(product.id),
                product_name: product.product_name,
                quantity: product.quantity,
            })
        }),
    }).then(r=>r)
    return data;
}

