'use client'

import {StateContext} from "@/app/state/context";
import {callNextApi} from "@/helpers/apiMethods";
import {Action, State} from "@/model/appstate/AppStateTypes";
import {TransferProductInPickpack} from "@/model/transfers/TransferTypes";
import {TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Box, LinearProgress} from "@mui/material";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const PickingTab = (props:{transferId:number})=>{
    const [state, dispatch]:[State, Action] = useContext(StateContext);
    const [pickingList, setPickingList] = useState<TransferProductInPickpack[]>([]);
    const [loading, setLoading] = useState(false);

    const memoPickingList = useMemo(()=>pickingList, [pickingList]);

    const getTransferPickingList = useCallback(async() => {
            await callNextApi("POST", "transfers/getTransferProductsList", {
                transfer_id: props.transferId,
                picking: 1
            })
                .then(r => {
                    console.log('transfer products:', r?.response)
                    setPickingList(r?.response);
                })
                .finally(() => setLoading(false))
    }, [])

    const scanProductPicking = useCallback(async (transfer_id: number, product_id: string) => {
        setLoading(true)
        await callNextApi("POST", "pickpack/scanProductPicking", {
            transfer_id: transfer_id,
            product_id: product_id,
        })
            .then(r => {
                console.log('transfer products:', r?.response)
                getTransferPickingList();
            })
            .finally(()=>setLoading(false))
    }, [])


    useEffect(() => {
        setLoading(true)
        getTransferPickingList()
    }, [])
    return (
        <TableContainer component={Paper}>
            {loading ?
            <Box sx={{width: '100%'}} >
                <LinearProgress />
            </Box>
            :
            <Table sx={{minWidth: 450}} aria-label="invoice data table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Row ID</TableCell>
                        <TableCell align="center">Product ID</TableCell>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Total</TableCell>
                        <TableCell align="center">Picked</TableCell>
                        <TableCell align="center">Not Picked</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {memoPickingList.length>0? memoPickingList.map(product => (
                        <TableRow key={product.row_id}>
                            <TableCell component="th" scope="row" align="center">{product.row_id}</TableCell>
                            <TableCell component="th" scope="row" align="center">{product.product_id}</TableCell>
                            <TableCell component="th" scope="row" align="center">{product.product_name}</TableCell>
                            <TableCell component="th" scope="row" align="center">{product.total_quantity}</TableCell>
                            <TableCell component="th" scope="row" align="center">{product.processed_quantity}</TableCell>
                            <TableCell component="th" scope="row" align="center">{product.not_processed_quantity}</TableCell>
                            <TableCell component="th" scope="row" align="center">
                                <Button  ><RemoveIcon /></Button>
                                <Button onClick={() => scanProductPicking(props.transferId, product.product_id)} ><AddIcon /></Button>
                            </TableCell>
                        </TableRow>
                    )):null}
                </TableBody>
            </Table>}


        </TableContainer>
    )
}
export default PickingTab;
