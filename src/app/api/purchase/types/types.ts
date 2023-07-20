export type Product = {
    product_id: number;
    product_name: string;
    acquisition_price: string;
    quantity: number;
    tax: string;
}
export interface AddProduct {
    invoice_id: number;
    products: Product[];
}
export type AddToStock = {
    invoice_id: number;
    warehouse_id: number;
}

// Get Purchase List
export type Purchase = {
    id: string;
    invoice_date: string; //"2023-07-01",
    due_date: string; // "2023-07-01",
    supplier_id:string;
    invoice_series:string;
    invoice_number:string;
    supplier_name: string;
    supplier_series: string;
    driver: string;
    nr_auto: string;
    image: boolean;
    locked: string;
    currency_rate: string;
    invoice_value: string;
    currency: "EUR" | "RON" | "USD" //"EUR",
    reception_date: string; //"2023-07-14",
    totalNoVat: number;
    totalWithVat: number;
}

export type PurchaseListResponse = {
    status: number;
    code: string;
    response: Purchase[];
}
