import {Action, State} from "@/app/state/types/stateTypes";

export const editInvoiceReducer = (state: State|any, action: Action|any) => {
        switch(action.type){
            case 'SET_DATE':
                return {...state, date: action.payload}

            case 'SET_INVOICE_SERIES':
                return {...state, invoiceSeries: action.payload}

            case 'SET_INVOICE_NUMBER':
                return {...state, invoiceNumber: action.payload}
        }
    }


