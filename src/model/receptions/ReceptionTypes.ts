import {Currency} from "@/model/orders/OrderTypes";

export type ReceptionItem = {
    id: string;
    invoice_date: string;
    invoice_series: string;
    invoice_number: string;
    supplier_name: string;
    currency: Currency;
    total_quantity: string;
    receptioned_quantity: string;
    not_receptioned_quantity: number;
    invoice_value: string;
}
export type ReceptionInventoryProduct = {
    id: number;
    row_id: string;
    product_id: string;
    product_name: string;
    total_quantity: string;
    receptioned_quantity: string;
    not_confirmed_quantity: number;
}