import Order, {allOrdersApiResponse} from "@/components/types/Order";
import {GridRowSelectionModel} from "@mui/x-data-grid";

export interface State {
    status?:string;
    orders?: Order[];
    selectionModel?: GridRowSelectionModel;
    loading?:boolean;
    trigger?:boolean;
}

export type Action =
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
        type: "SET_INVOICES";
        payload: ;
    } |
    {
        type: "SET_OPEN_ERROR_SNACK";
        payload: boolean;
    } |
    {
        type:"test";
    }
