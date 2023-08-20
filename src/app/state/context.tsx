"use client"

import {createContext, useReducer} from "react"
import {reducer} from "./reducers"
import { State, Action } from "@/model/appstate/AppStateTypes"

export const StateContext = createContext<any>([null, null])

export default function ContextProvider({children}:{children:React.ReactNode}) {
const [state, dispatch] = useReducer(reducer, {
    deletePrompt: false,
    orders:[],
    invoices: [],
    productResult:[],
    productBasket:[],
    productBasketModal:false,
    receptionInventory:[],
    newInvoiceModal:false,
    newTransferModal:false,
    })


  return (
      <>
          <StateContext.Provider value={[state, dispatch]}>
              {children}
          </StateContext.Provider>
      </>

  )
}
