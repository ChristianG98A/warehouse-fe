import {Action, State} from "./stateTypes";


export const reducer = (state: State|any, action: Action|any) => {
    switch (action.type) {
        case 'test':
            console.log("dispatch merge! \n State: ", state);
            return {...state, status: "test"}

        case 'SET_ORDERS':
            console.log("set orders!!")
            return {...state, orders: action.payload}

        default:
            return state
    }
}

