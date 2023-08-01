"use client"

import {StateContext} from "@/app/state/context";
import {Box, Button} from "@mui/material";
import {GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport} from "@mui/x-data-grid";
import {useRouter} from "next/navigation";
import React, {useContext} from "react";
import AddchartIcon from '@mui/icons-material/Addchart';


const ReceptionButton = ()=>{
    const [state, dispatch] = useContext(StateContext);
    const router = useRouter();

        return(
        <>
           <Button
               color="primary"
               key={"item_reception"}
               style={{ fontSize: "0.8rem"}}
               startIcon={<AddchartIcon />}

               onClick={() => {
                   if (state?.currentInvoice) {
                       router.push(`/depozit/receptie_marfa/receptie_comanda/${state.currentInvoice}`)
                   }
                   else {
                        dispatch({type:"SET_SNACKBAR", payload:{state:true, message:"Selecteaza o comanda!", type:"error"}})
                   }
               }
               }

           >
               Receptioneaza
           </Button>
        </>)
}

const ReceptionGridToolbar = () => {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarExport />
            <ReceptionButton />
        </GridToolbarContainer>
    );
}

export default ReceptionGridToolbar ;
