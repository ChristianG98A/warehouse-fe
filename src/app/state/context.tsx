"use client"

import {createContext, useReducer} from "react"
import {reducer} from "./reducers"
import { State, Action } from "@/model/appstate/AppStateTypes"

export const StateContext = createContext<any>([null, null])

export default function ContextProvider({children}:{children:React.ReactNode}) {
    const [state, dispatch]:[State, Action] = useReducer(reducer, {
        currentInvoice: [],
        deletePrompt: false,
        addToStockPrompt: false,
        orders: [],
        invoices: [],
        productResult: [],
        productBasket: [],
        productBasketModal: false,
        receptionInventory: [],
        newInvoiceModal: false,
        newTransferModal: false,
        wholesaleOffset:300,
        transferProductBasket:[],
        transferProductResult: [],
        productEdit: {
            product_name:"",
            man_name:"",
            description:"",
            }
    })


  return (
      <>
          <StateContext.Provider value={[state, dispatch]}>
              {children}
          </StateContext.Provider>
      </>

  )
}
