'use client'

import {StateContext} from "@/app/state/context";
import {callNextApi} from "@/helpers/apiMethods";
import {Action, State} from "@/model/appstate/AppStateTypes";
import {TransferProductInPickpack} from "@/model/transfers/TransferTypes";
import {TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody} from "@mui/material";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";

const PickingTab = (props:{transferId:number})=>{
    const [state, dispatch]:[State, Action] = useContext(StateContext);
    const [pickingList, setPickingList] = useState<TransferProductInPickpack[]>([]);
    const [loading, setLoading] = useState(false);
    const debounce = require('lodash.debounce');

    const getTransferPickingList = async () => {
        await callNextApi("POST", "transfers/getTransferProductsList", {
            transfer_id: props.transferId,
            picking: 1
        })
            .then(r => {
                console.log('transfer products:', r?.response)
                setPickingList(r?.response);
            })
    }


    let eanCode= ""
    const resetInput = debounce(()=>eanCode="", 300)
    const handleKeydown = (event:any)=>{
            if (event.key === "Enter" && eanCode?.length==13) {
                event.preventDefault();
                console.log('submitting ', eanCode)
                eanCode=""
            } else {
                eanCode+= event.key
                console.log(eanCode)
            }
            resetInput()
        }

    useEffect(() => {
        setLoading(true)
        document.addEventListener('keydown', handleKeydown);
        getTransferPickingList()
            .finally(() => setLoading(false))

        return () => {
            console.log('unmounting!')
            document.removeEventListener('keydown', handleKeydown);
        }
    }, [])
        return(
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 450}} aria-label="invoice data table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Row ID</TableCell>
                                    <TableCell align="center">Product ID</TableCell>
                                    <TableCell align="center">Name</TableCell>
                                    <TableCell align="center">Total</TableCell>
                                    <TableCell align="center">Picked</TableCell>
                                    <TableCell align="center">Not Picked</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                { useMemo(()=>(pickingList?.map(product=>(
                                        <TableRow key={product.row_id}>
                                            <TableCell component="th" scope="row" align="center">{product.row_id}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{product.product_id}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{product.product_name}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{product.total_quantity}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{product.processed_quantity}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{product.not_processed_quantity}</TableCell>
                                        </TableRow>
                                ))), [pickingList]) }
                            </TableBody>
                        </Table>
                    </TableContainer>
        )
    }
export default PickingTab;
