import {Currency} from "@/model/orders/OrderTypes";

export type Invoice = {
    id: number;
    invoice_date: string;
    due_date: string | null;
    invoice_series: string;
    invoice_number: string;
    supplier_name: string;
    driver: string;
    nr_auto: string;
    locked: number | null;
    currency_rate: string;
    currency: Currency;
    reception_date: null | string;
    totalNoVat: number;
    totalWithVat: number;
}
export type Supplier = {
    id: string;
    alias: string;
}