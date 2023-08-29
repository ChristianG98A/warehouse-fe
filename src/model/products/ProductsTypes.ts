export default null;

export type ProductQueryState = {
    cathegory: string;
    producer: string;
    supplier: string;
    status: "oricare" | "activ" | "inactiv";
    queryString?: string;
}

export type ProductQueryAction =
    {
        type: "SET_CURRENT_INVOICE";
        payload: number | null;
    } |
    {
        type: "SET_PRODUCT_BASKET_MODAL";
        payload: boolean;
    }
