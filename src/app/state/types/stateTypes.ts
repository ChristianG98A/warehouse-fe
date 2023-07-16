import Order, {allOrdersApiResponse} from "@/components/types/Order";

export interface State {
    status?:string;
    orders?: Order[]
}

export type Action =
    {
        type: "SET_ORDERS";
        payload: allOrdersApiResponse;
    } |
    {
        type:"test";
    }
