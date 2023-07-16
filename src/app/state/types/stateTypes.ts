import Order, {allOrdersApiResponse} from "@/components/types/Order";
import {GridRowSelectionModel} from "@mui/x-data-grid";

export interface State {
    status?:string;
    orders?: Order[];
    selectionModel?: GridRowSelectionModel;
}

export type Action =
    {
        type: "SET_ORDERS";
        payload: allOrdersApiResponse;
    } |
    {
        type: "SET_SELECTION_MODEL";
        payload: GridRowSelectionModel;
    } |
    {
        type:"test";
    }
