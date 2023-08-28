"use client"

import {createContext, useReducer} from "react"
import {reducer} from "./reducers"
import { State, Action } from "@/model/appstate/AppStateTypes"

export const StateContext = createContext<any>([null, null])

export default function ContextProvider({children}:{children:React.ReactNode}) {
    const [state, dispatch] = useReducer(reducer, {
        currentInvoice: [0],
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
        transferProductSelection: [],
        wholesaleOffset:300,
    })


  return (
      <>
          <StateContext.Provider value={[state, dispatch]}>
              {children}
          </StateContext.Provider>
      </>

  )
}
