import {allOrdersApiResponse} from "@/components/types/Order";
import {GridRowSelectionModel} from "@mui/x-data-grid";

export interface State {
    status?:string;
    orders: Order[];
    selectionModel: GridRowSelectionModel;
    loading?:boolean;
    trigger?:boolean;
    productBasket: ProductInBasket[];
    productBasketModal: boolean;
    productResult: ProductResult[];
    receptions?: ReceptionItem[];
    currentInvoice? : GridRowSelectionModel;
    receptionInventory?: ReceptionInventoryProduct[];
    deletePrompt:boolean;
    errorSnack:boolean;
    snackBar:SnackBarState;
}

type Currency = "RON" | "EUR" | "USD";

type ProductResult = {
    crt: number;
    id: string;
    name: string;
    model: string;
}

type Invoice = {
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
 type ProductInBasket = {
    row_id?: number | null;
    crt?: number ;
    id: number;
    name: string;
    model?: string ;
    acquisition_price: number;
    quantity: number;
    tax: number;
 }

 type ReceptionItem = {
    id: string;
    invoice_date: string ;
    invoice_series: string;
    invoice_number: string;
    supplier_name: string;
    currency: Currency;
    total_quantity: string;
    receptioned_quantity: string;
    not_receptioned_quantity: number;
    invoice_value: string;
 }

 type ReceptionInventoryProduct = {
    id:number;
    row_id: string;
    product_id: string;
    product_name: string;
    total_quantity: string;
    receptioned_quantity: string;
    not_confirmed_quantity: number;
 }

 type Order = {
    crt: number;
    id: string;
    invoice_company: string;
    delivery_price: string;
    tax_rate: string;
    status: string;
    whStatus: string;
    order_notes: string;
    totalNoVat: string;
    totalWithVat: number;
 }

type SnackBarState = {
    state: boolean;
    message: string;
    type: "success" | "error" | "warning";
}
export type Action = (reducerAction:ActionTypes) => void

export type ActionTypes  =
    {
        type: "SET_CURRENT_INVOICE";
        payload: number | null;
    } |
    {
        type: "SET_PRODUCT_BASKET_MODAL";
        payload: boolean;
    } |
    {
        type: "SET_PRODUCT_BASKET";
        payload?: any;
    } |
    {
        type: "RESET_PRODUCT_BASKET";
    } |
    {
        type: "SET_PRODUCT_RESULT";
        payload: ProductResult[];
    } |
    {
        type: "SET_ORDERS";
        payload: allOrdersApiResponse;
    } |
    {
        type: "SET_LOADING";
        payload: boolean;
    } |
    {
        type: "SET_SELECTION_MODEL";
        payload: GridRowSelectionModel;
    } |
    {
        type: "SET_DELETE_PROMPT";
        payload: boolean;
    } |
    {
        type: "SET_TRIGGER";
        payload: boolean;
    } |
    {
        type: "SET_CURRENT_INVOICE";
        payload: GridRowSelectionModel;
    } |
    {
        type: "SET_OPEN_ERROR_SNACK";
        payload: boolean;
    } |
    {
        type: "SET_INVOICES";
        payload: Invoice[];
    } |
    {
        type:"SET_RECEPTIONS";
        payload: ReceptionItem[];
    }|
    {
        type:"SET_RECEPTION_INVENTORY";
        payload: ReceptionInventoryProduct[];
    }|
    {
        type:"SET_ORDERS";
        payload: Order[];
    }|
    {
        type:"SET_SNACKBAR";
        payload: SnackBarState;
    }
