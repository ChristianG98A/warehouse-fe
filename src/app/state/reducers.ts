import {Action, State} from "./types/stateTypes";

const findIndexByObjectId = (dataArray:any, targetId:number) => {
  const index = dataArray.findIndex((item:any) => item.id === targetId);
  return index;
};

export const reducer = (state: State|any, action: Action|any) => {
    switch (action.type) {
        case 'test':
            //console.log("dispatch merge! \n State: ", state);
            return {...state, status: "test"}

        case 'SET_SELECTION_MODEL':
            return {...state, selectionModel:action.payload}

        case 'SET_PRODUCT_BASKET_MODAL':
            return {...state, productBasketModal:action.payload}

        case 'SET_PRODUCT_RESULT':
            return {...state, productResult:action.payload}

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

        case 'SET_PRODUCT_BASKET':
            const index = findIndexByObjectId(state.productBasket, action.payload.id)

            if (index !==-1) {
                return {...state, productBasket: state.productBasket.map((item:any, i:any)=> i === index ? action.payload : item)}
            }

            else {
                return {
                    ...state,
                    productBasket: [...state.productBasket, action.payload],
                };
        }
        case 'RESET_PRODUCT_BASKET':
            return {...state, productBasket:[]}

        case 'SET_RECEPTIONS':
            return {...state, receptions:action.payload}

        case 'SET_RECEPTION_INVENTORY':
            return {...state, receptionInventory:action.payload}

        case 'SET_PRODUCTS_LEFT_FOR_RECEPTION':
            return {...state, productsLeftForReception:action.payload}

        case 'SET_TRANSFERS':
            return {...state, transfers:action.payload}

        case 'SET_SNACKBAR':
            return {...state, snackBar:action.payload}

        case 'SET_NEW_INVOICE_MODAL':
            return {...state, newInvoiceModal:action.payload}

        case 'SET_WAREHOUSE_SELECTION':
            return {...state, warehouseSelection:action.payload}

        case 'SET_SUPPLIER_SELECTION':
            return {...state, supplierSelection:action.payload}

        case 'SET_WAREHOUSE_TRANSFER_SELECTION':
            return {...state, warehouseTransferSelection:action.payload}

        case 'SET_NEW_TRANSFER_MODAL':
            return {...state, newTransferModal:action.payload}

        case 'SET_CURRENT_TRANSFER':
            return {...state, currentTransfer:action.payload}

        default:
            return state
    }
}

