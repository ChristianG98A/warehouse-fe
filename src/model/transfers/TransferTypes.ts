export type Transfer = {
    id: string;
    old_warehouse_name: string;
    new_warehouse_name: string;
    status: string;
    confirmed: any;
}
export type TransferProduct = {
    crt: number; //comes from a local .map function, NOT FROM API!
    id: string;
    name: string;
    model: string;
    available_quantity: string;
    warehouse_name: string;
}

export type TransferProductSelection = {
    product_id: number;
    product_name: string;
    quantity: number;
}
