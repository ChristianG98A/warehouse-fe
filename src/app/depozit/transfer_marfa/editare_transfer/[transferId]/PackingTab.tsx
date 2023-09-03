'use client'

import {StateContext} from "@/app/state/context";
import {callNextApi} from "@/helpers/apiMethods";
import {Action, State} from "@/model/appstate/AppStateTypes";
import {PickingBox} from "@/model/pickpack/PickpackTypes";
import {TransferProductInPickpack} from "@/model/transfers/TransferTypes";
import {Grid, Paper, Button} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {useContext, useEffect, useState} from "react";
import BoxCard from "./BoxCard";


const PackingTab = (props:{transferId:number})=>{
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

    const getPackingList = async () => {
        await callNextApi("POST", "transfers/getTransferProductsList", {
            transfer_id: props.transferId,
            packing: 1
        })
            .then(r => {
                setPackingList(r?.response)
            })
    }

    useEffect(() => {
        setLoading(true)
        getBoxes().then(r => {
            getPackingList()
        }).finally(() => setLoading(false))
    }, [])

    useEffect(()=>console.log('PackingList:', packingList), [packingList]);

    return (
        <Grid container component={Paper} elevation={5} sx={{justifyContent: "center", minHeight: "40rem"}}>
            <Grid item xs={4}>
                <Grid container >
                    <Grid item xs={12}>
                        {boxes?.map(box => <BoxCard onClick={() => null} key={box.id} id={box.id} title={`Box ${box.id}`} />)}
                    </Grid>
                    <div style={{marginTop: '40rem'}} />
                    <Grid item xs={6} alignItems={center} sx={{mt: 2, mb: 2}}><Button onClick={addBox} variant={'outlined'} >Add box</Button></Grid>
                    <Grid item xs={6} alignItems={center} sx={{mt: 2, mb: 2}} ><Button onClick={deleteBox} variant={'outlined'} >Remove box</Button></Grid>
                </Grid>
            </Grid>

            <Grid item xs={8}>
                <DataGrid columns={[]} rows={[]} />
            </Grid>
        </Grid>
        )
    }
const center = {display: 'flex', justifyContent: 'center'}


export default PackingTab;
