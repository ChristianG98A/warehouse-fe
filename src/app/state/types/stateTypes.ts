import {allOrdersApiResponse} from "@/components/types/Order";
import {GridRowSelectionModel} from "@mui/x-data-grid";

export interface State {
    status?: string;
    orders: Order[];
    selectionModel: GridRowSelectionModel;
    loading?: boolean;
    trigger?: boolean;
    productBasket: ProductInBasket[];
    productBasketModal: boolean;
    productResult: ProductResult[];
    receptions?: ReceptionItem[];
    currentInvoice?: GridRowSelectionModel;
    receptionInventory: ReceptionInventoryProduct[];
    deletePrompt: boolean;
    errorSnack: boolean;
    snackBar: SnackBarState;
    invoices: Invoice[];
    warehouseSelection: Warehouse[];
    supplierSelection: Supplier[];
    newInvoiceModal:boolean;
    warehouseTransferSelection:WarehouseTransferOptions;
    newTransferModal:boolean;
    transfers: Transfer[];
    currentTransfer: Transfer | undefined;
    transferProductResult: TransferProduct[];
}

export type Currency = "RON" | "EUR" | "USD";

export type ProductResult = {
    crt: number;
    id: string;
    name: string;
    model: string;
}

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
export type ProductInBasket = {
    row_id?: number | null;
    crt?: number;
    id: number;
    name: string;
    model?: string;
    acquisition_price: number;
    quantity: number;
    tax: number;
}

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

export type Order = {
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

export type SnackBarState = {
    state: boolean;
    message: string;
    type: "success" | "error" | "warning";
}

export type WarehouseTransferOptions = {
    warehousesAllowingServicingStock : Warehouse[];
    warehouseAllowingSellingStock: Warehouse[];
}


export type Warehouse = {
    id: string;
    name: string;
}

export type Supplier = {
    id: string;
    alias: string;
}

export type Transfer = {
    id: string;
    old_warehouse_name: string;
    new_warehouse_name: string;
    status: string;
    confirmed:any;
}

export type TransferProduct = {
    crt: number; //comes from a local .map function, NOT FROM API!
    id: string;
    name: string;
    model: string;
    available_quantity: string;
    warehouse_name: string;
}

export type Action = (reducerAction: ActionTypes) => void

export type ActionTypes =
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
        type: "SET_RECEPTIONS";
        payload: ReceptionItem[];
    } |
    {
        type: "SET_RECEPTION_INVENTORY";
        payload: ReceptionInventoryProduct[];
    } |
    {
        type: "SET_ORDERS";
        payload: Order[];
    } |
    {
        type: "SET_WAREHOUSE_SELECTION";
        payload: Warehouse[];
    } |
    {
        type: "SET_SUPPLIER_SELECTION";
        payload: Supplier[];
    } |
    {
        type: "SET_NEW_INVOICE_MODAL";
        payload: boolean;
    } |
    {
        type: "SET_WAREHOUSE_TRANSFER_SELECTION";
        payload: boolean;
    } |
    {
        type: "SET_NEW_TRANSFER_MODAL";
        payload: boolean;
    } |
    {
        type: "SET_TRANSFERS";
        payload: Transfer[];
    } |
    {
        type: "SET_CURRENT_TRANSFER";
        payload: Transfer | undefined;
    } |
    {
        type: "SET_TRANSFER_PRODUCT_RESULT";
        payload: TransferProduct[];
    } |
    {
        type: "SET_SNACKBAR";
        payload: SnackBarState;
    }
