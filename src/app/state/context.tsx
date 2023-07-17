"use client"

import {createContext, useReducer} from "react"
import {reducer} from "./reducers"


export const StateContext = createContext<any>([null, null])

export default function ContextProvider({children}:{children:React.ReactNode}) {
const [state, dispatch] = useReducer(reducer, {deletePrompt: false, orders:[]})


  return (
      <>
          <StateContext.Provider value={[state, dispatch]}>
              {children}
          </StateContext.Provider>
      </>

  )
}
