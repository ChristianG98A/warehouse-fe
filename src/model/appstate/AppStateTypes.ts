import {GridRowSelectionModel} from "@mui/x-data-grid";
import {AllOrdersApiResponse, OrderTypes, ProductInBasket, ProductResult} from "@/model/orders/OrderTypes";
import {Transfer, TransferProduct, TransferProductInBasket} from "@/model/transfers/TransferTypes";
import {Warehouse, WarehouseTransferOptions} from "@/model/warehouse/WarehouseTypes";
import {ReceptionInventoryProduct, ReceptionItem} from "@/model/receptions/ReceptionTypes";
import {Invoice, Supplier} from "@/model/invoices/invoiceTypes";
import {ProductEditState} from "../products/ProductsTypes";

export interface State {
    status?: string;
    orders: OrderTypes[];
    selectionModel: GridRowSelectionModel;
    loading?: boolean;
    trigger?: boolean;
    productBasket: ProductInBasket[];
    productBasketModal: boolean;
    productResult: ProductResult[];
    receptions?: ReceptionItem[];
    currentInvoice: GridRowSelectionModel;
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
    currentOrder: number;
    addToStockPrompt:boolean;
    transferProductBasket:TransferProductInBasket[];
    wholesaleOffset:number;
    selectedBox: string;
    productEdit:ProductEditState;
}

export type SnackBarState = {
    state: boolean;
    message: string;
    type: "success" | "error" | "warning";
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
        payload: AllOrdersApiResponse;
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
        payload: OrderTypes[];
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
        type: "SET_TRANSFER_PRODUCT_BASKET";
        payload: any;
    } |
    {
        type: "RESET_TRANSFER_PRODUCT_BASKET";
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
        type: "SET_CURRENT_ORDER";
        payload: number;
    } |
    {
        type: "SET_ADDTOSTOCK_PROMPT";
        payload: boolean;
    } |
    {
        type: "SET_WHOLESALE_OFFSET";
        payload: number;
    } |
    {
        type: "SET_SELECTED_BOX";
        payload: string;
    } |
    {
        type: "SET_PRODUCT_EDIT";
        payload: any;
    } |
    {
        type: "SET_PRODUCT_EANS";
        payload: string[];
    } |
    {
        type: "SET_PRODUCT_EDIT_NAME";
        payload: string;
    } |
    {
        type: "SET_PRODUCT_EDIT_DESCRIPTION";
        payload: string;
    } |
    {
        type: "SET_PRODUCT_EDIT_MAN_NAME";
        payload: string;
    } |
    {
        type: "SET_SNACKBAR";
        payload: SnackBarState;
    }
