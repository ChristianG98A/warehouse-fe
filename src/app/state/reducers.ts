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

        default:
            return state
    }
}

