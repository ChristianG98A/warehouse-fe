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

export type TransferProductInBasket = {
    row_id: string;
    product_id: string;
    product_name: string;
    total_quantity: string;
    picked_quantity: string;
    not_picked_quantity: number;
}

export type TransferProductInList = {
    row_id: string;
    product_id: string;
    product_name: string;
    total_quantity: string;
    picked_quantity: string;
    not_picked_quantity: number;
}

export type TransferData = {
    id: string;
    old_warehouse: string;
    new_warehouse: string;
     old_warehouse_name: string;
        new_warehouse_name: string;
        confirmed: null | "1",
        reception_date: null | "1",
        status: "new" | string,
        locked: null | "1",
        transferProducts: {
            products: number; //????????????????/
        }
}
