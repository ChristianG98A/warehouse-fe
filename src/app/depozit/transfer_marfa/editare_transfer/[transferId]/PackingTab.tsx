'use client'

import {StateContext} from "@/app/state/context";
import {callNextApi} from "@/helpers/apiMethods";
import {Action, State} from "@/model/appstate/AppStateTypes";
import {PickingBox} from "@/model/pickpack/PickpackTypes";
import {TransferProductInPickpack} from "@/model/transfers/TransferTypes";
import {Grid, Paper, Button, CircularProgress, Box, LinearProgress} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {useCallback, useContext, useEffect, useState} from "react";
import BoxCard from "./BoxCard";
import PackingColumns from "./PackingColumns";


const PackingTab = (props:{transferId:number})=>{
    const debounce = require('lodash.debounce');
    const [state, dispatch]:[State, Action] = useContext(StateContext);
    const [boxes, setBoxes] = useState<PickingBox[]>();
    const [loading, setLoading] = useState(false);
    const [packingList, setPackingList] = useState<TransferProductInPickpack[]>([]);

    const getBoxes = async () => {
        await callNextApi("POST", "pickpack/getBoxes", {transfer_id: props.transferId})
            .then(r => {
                setBoxes(r?.response)
            })
    }
    const addBox = async () => {
        await callNextApi("POST", "pickpack/addBox", {transfer_id: props.transferId})
            .then(r => {
                getBoxes();
            })
    }
    const deleteBox = async ()=>{
        await callNextApi("POST", "pickpack/deleteBox", {box_id: parseInt(state.selectedBox)})
            .then(() => {
                dispatch({type:"SET_SNACKBAR", payload:{type:'success', state:true, message:`Cutia ${state.selectedBox} stearsa cu succes`}})
                getBoxes();
            })
        }

    const getPackingList = useCallback(async () => {
        await callNextApi("POST", "transfers/getTransferProductsList", {
            transfer_id: props.transferId,
            packing: 1
        })
            .then(r => {
                setPackingList(r?.response)
            })
            .catch(e => {
                try {
                    dispatch({type: 'SET_SNACKBAR', payload: {state: true, message: e?.messages?.error, type: 'error'}})
                }
                catch (e) {console.log(e)}
            })
    }, [])

    const scanProduct = useCallback(async (ean:string) => {
        console.log({
            transfer_id: props.transferId,
            ean_code: ean,
            box_id: state?.selectedBox,
        })
        await callNextApi("POST", "pickpack/scanProductPacking", {
            transfer_id: props.transferId,
            ean_code: ean,
            box_id: state?.selectedBox,
        })
            .then(r => {
                console.log('vezi response:', r.responses)
                try {if (r.responses[0].error) {dispatch({type: 'SET_SNACKBAR', payload: {message: r.responses[0].ean_status, state: true, type:'error'}})} }
                catch (e) {}
                getPackingList()
            })
    }, [])

    let eanCode= ""
    const resetInput = debounce(()=>eanCode="", 300)
    const handleKeydown = (event:any)=>{
            if (event.key === "Enter" && eanCode?.length==13) {
                event.preventDefault();
                console.log('submitting ', eanCode)
                scanProduct(eanCode);
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
        getBoxes().then(r => {
            getPackingList()
        }).finally(() => setLoading(false))
        return () => {
            console.log('unmounting!')
            document.removeEventListener('keydown', handleKeydown);
        }
    }, [])

    useEffect(()=>console.log('PackingList:', packingList), [packingList]);

    return (
        <Grid container component={Paper} elevation={5} sx={{justifyContent: "center", minHeight: "40rem"}}>
            <Grid item xs={4}>
                <Grid container >
                    {loading ?
                        <Box sx={{ width: '100%'}} >
                            <LinearProgress />
                        </Box>
                        :
                        <Grid item xs={12}>
                            {boxes?.map(box => <BoxCard key={box.id} id={box.id} title={`Box ${box.id}`} />)}
                        </Grid>}

                    <div style={{marginTop: '40rem'}} />
                    <Grid item xs={6} alignItems={center} sx={{mt: 2, mb: 2}}><Button onClick={addBox} variant={'outlined'} >Add box</Button></Grid>
                    <Grid item xs={6} alignItems={center} sx={{mt: 2, mb: 2}} ><Button onClick={deleteBox} variant={'outlined'} >Remove box</Button></Grid>
                </Grid>
            </Grid>

            <Grid item xs={8}>
                <DataGrid
                columns={PackingColumns()}
                rows={packingList.length>0? packingList :[]}
                loading={loading}
                getRowId={(row)=>row?.row_id}
                />
            </Grid>
        </Grid>
        )
    }
const center = {display: 'flex', justifyContent: 'center'}


export default PackingTab;
