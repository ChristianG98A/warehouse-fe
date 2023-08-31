"use client"

import {Box, Button} from "@mui/material";
import {GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport} from "@mui/x-data-grid";
import {useRouter} from "next/navigation";
import React, {useContext} from "react";
import {StateContext} from "@/app/state/context";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import {EditNote} from "@mui/icons-material";
import {callNextApi} from "@/helpers/apiMethods";
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import {Action, State} from "@/model/appstate/AppStateTypes";


const ReceptionButton = () => {
    const [state, dispatch] = useContext(StateContext);
    const router = useRouter();

    return (
        <>
            <Button
                color="primary"
                key={"item_reception"}
                style={{fontSize: "0.8rem"}}
                startIcon={<AddCircleIcon />}

                onClick={() => {
                    callNextApi("POST", "purchase/purchaseInit").then((r: any) => {
                        dispatch({type: 'SET_WAREHOUSE_SELECTION', payload: r?.response.warehouses})
                        dispatch({type: 'SET_SUPPLIER_SELECTION', payload: r?.response.suppliers})
                    })

                    dispatch({type: 'SET_NEW_INVOICE_MODAL', payload: true})
                }
                }
            >
                Creeaza N.I.R.
            </Button>
        </>)
}

const EditButton = () => {
    const [state, dispatch] = useContext(StateContext);
    const router = useRouter();

    return (
        <>
            <Button
                color="primary"
                key={"item_reception"}
                style={{fontSize: "0.8rem"}}
                startIcon={<EditNoteIcon />}

                onClick={() => {
                    if (state?.currentInvoice) {
                        router.push(`/achizitii/comenzi_furnizori/editare_nir/${state.currentInvoice}`)
                    }
                    else {
                        dispatch({type: "SET_SNACKBAR", payload: {state: true, message: "Selecteaza o comanda!", type: "error"}})
                    }
                }
                }

            >
                Editeaza N.I.R.
            </Button>
        </>)
}

const CloseInvoiceButton = () => {
    const [state, dispatch]:[State, Action] = useContext(StateContext);
    const router = useRouter();

    return (
        <>
            <Button
                color="primary"
                key={"item_reception"}
                style={{fontSize: "0.8rem"}}
                startIcon={<DownloadDoneIcon />}

                onClick={() => {
                    console.log(state?.currentInvoice)
                    if (state?.selectionModel) {
                        dispatch({type: "SET_ADDTOSTOCK_PROMPT", payload: true})
                    }
                    else {
                        dispatch({type: "SET_SNACKBAR", payload: {state: true, message: "Selecteaza o comanda!", type: "error"}})
                    }
                }
                }

            >
                Inchide N.I.R.
            </Button>
        </>)
}

const InvoiceGridToolbar = () => {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarExport />
            <ReceptionButton />
            <EditButton />
            <CloseInvoiceButton />
        </GridToolbarContainer>
    );
}
export default InvoiceGridToolbar;
