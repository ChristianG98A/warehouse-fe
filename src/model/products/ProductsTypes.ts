export default null;

export type Product= {
    id: string;
    product_name: string;
    man_name: string;
    status: string | 'inactive';
}

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

export type ProductEanCode = {
    product_id: string;
    ean: string;
    row_id: string;
}

export type ProductEditState = {
    product_name: string;
    man_name: string;
    description: string;
    status: 'inactive' | string;
    product_ean_codes: ProductEanCode[];
}

export type ProductStockLine = {
    id: string;
    ean: string;
    supplier_name: string;
    warehouse_name: any | null, //???
    acquisition_price: string;
    status: string | "allocated";
    acquired_date: string | Date;
    invoice_in: string;
    order_id: string;
    transfer_id: string;
}
