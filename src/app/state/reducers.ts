import {Action, State} from "./types/stateTypes";


export const reducer = (state: State|any, action: Action|any) => {
    switch (action.type) {
        case 'test':
            //console.log("dispatch merge! \n State: ", state);
            return {...state, status: "test"}

        case 'SET_SELECTION_MODEL':
            return {...state, selectionModel:action.payload}

        case 'SET_ORDERS':
            //console.log("set orders!!")
            return {...state, orders: action.payload}

        case 'SET_LOADING':
            return {...state, loading:action.payload}

        case 'SET_TRIGGER':
            return {...state, loading:action.payload}

        case 'SET_CURRENT_INVOICE':
            return {...state, currentInvoice:action.payload}

        case 'SET_DELETE_PROMPT':
            return {...state, deletePrompt:action.payload}

        case 'SET_OPEN_ERROR_SNACK':
            return {...state, errorSnack:action.payload}

        case 'SET_INVOICES':
            return {...state, invoices:action.payload}

        default:
            return state
    }
}

