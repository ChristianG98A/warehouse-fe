"use client"

import {StateContext} from "@/app/state/context";
import {Box, Button} from "@mui/material";
import {GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport} from "@mui/x-data-grid";
import {useRouter} from "next/navigation";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import React, {useContext} from "react";
import AddchartIcon from '@mui/icons-material/Addchart';
import {callNextApi} from "@/helpers/apiMethods";
import {Action, State} from "@/model/appstate/AppStateTypes";
import EditNoteIcon from '@mui/icons-material/EditNote';


const ReceptionButton = ()=>{
    const [state, dispatch] = useContext(StateContext);
    const router = useRouter();

        return(
        <>
           <Button
               color="primary"
               key={"item_reception"}
               style={{ fontSize: "0.8rem"}}
                startIcon={<AddCircleIcon />}

                onClick={async() => {
                    await callNextApi("POST", "transfers/transferInit").then((r: any) => {
                        dispatch({type: 'SET_WAREHOUSE_TRANSFER_SELECTION', payload: {
                                warehousesAllowingServicingStock:r?.response?.warehouses_allow_servicing_stock,
                                warehouseAllowingSellingStock:r?.response?.warehouses_allow_selling_stock,
                            }})
                    })
                    dispatch({type: 'SET_NEW_TRANSFER_MODAL', payload: true})
                }
                }

           >
               Transfer Nou
           </Button>
        </>)
}

const EditButton = () => {
    const [state, dispatch]:[State, Action] = useContext(StateContext);
    const router = useRouter();

    return (
        <>
            <Button
                color="primary"
                key={"item_reception"}
                style={{fontSize: "0.8rem"}}
                startIcon={<EditNoteIcon />}

                onClick={() => {
                    if (state?.currentTransfer) {
                        router.push(`/depozit/transfer_marfa/editare_transfer/${state.currentTransfer.id}`)
                    }
                    else {
                        dispatch({type: "SET_SNACKBAR", payload: {state: true, message: "Selecteaza un transfer!", type: "error"}})
                    }
                }
                }

            >
                Editeaza Transfer
            </Button>
        </>)
}

const TransferToolbar = () => {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarExport />
            <ReceptionButton />
            <EditButton />
        </GridToolbarContainer>
    );
}

export default TransferToolbar;
