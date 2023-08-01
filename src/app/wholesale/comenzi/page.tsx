"use client"

import {StateContext} from "@/app/state/context";
import {Action, State} from "@/app/state/types/stateTypes";
import GridColumns from "@/components/common/GridColumns";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Alert, Box, Button, Dialog, DialogActions, DialogTitle, Grid, LinearProgress, Paper, Snackbar, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import {DataGrid, GridRowsProp, GridToolbar} from "@mui/x-data-grid";
import {useContext, useEffect, useState} from "react";



const rowsPerPageOptions = [10, 20, 100];


const Orders = () => {
    const [pageSize, setPageSize] = useState<number>(rowsPerPageOptions[0]);
    const [loading, setLoading] = useState(false);  //fetch lag.....
    //    const [orders, setOrders] = useState<any>([]);
    const [state, dispatch]:[State, Action] = useContext(StateContext)
    const [trigger, setTrigger] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })

    // initial data fetch
    useEffect(() => {
        //console.log("this is the context api state:\n", state);
        console.log('initial datafetch')
        setLoading(true);
        callNextApi("POST", "orders", {limit: paginationModel.pageSize, offset: 0}).catch(e => console.log("Error caught in calling proxy api!\n", e))
            .then((r:any) => {
                console.log("ORDEEERS", r)
                dispatch({type: "SET_ORDERS", payload: r})
                setLoading(false)
            });
    }, [paginationModel])




    const handleDelete = async () => {
        const deleteResponse = await callNextApi("DELETE", "orders/deleteOrder", {id: state.selectionModel[0]})
            .catch(e => console.log("Error caught in calling proxy api!\n", e))
            .then(r => {
                console.log("Delete api call response:\n", r)
                setTrigger(trigger ? false : true)
                setOpenDelete(false);
                dispatch({type: "SET_DELETE_PROMPT", payload: false})
                dispatch({type: "SET_OPEN_ERROR_SNACK", payload: true})
            })
    }

    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch({type: "SET_OPEN_ERROR_SNACK", payload: false})
    };


    return (
        <>
        <Typography textAlign={'center'} variant={"h5"} fontWeight={800} sx={{mb:2}} gutterBottom >Comenzi Wholesale</Typography>
            <PageBreadcrumbs
                items={[
                    {
                        name: "Wholesale",
                        path: "/wholesale",
                    },
                    {
                        name: "Comenzi",
                        path: "/comenzi",
                    },
                ]}
            />


            <Grid component={Paper} container direction="column" justifySelf={"center"} justifyItems={"center"} style={{width: '100%', height: "60vh"}} >
                    <DataGrid
                        columnHeaderHeight={60}
                        //rows={useMemo(() => {return state.orders}, [state.orders])} //aici va veni Orders
                        rows={state.orders ?? []}
                        columns={GridColumns()}
                        paginationModel={paginationModel}
                        initialState={{pagination: {paginationModel: {pageSize: pageSize}}}}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[10, 25, 50]}
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            dispatch({type: "SET_SELECTION_MODEL", payload: newRowSelectionModel})
                        }}
                        rowSelectionModel={state.selectionModel}
                        autoPageSize={false}
                        loading={loading}
                        slots={{toolbar: GridToolbar}}
                        getRowSpacing={params => ({
                            top: params.isFirstVisible ? 0 : 5,
                            bottom: params.isLastVisible ? 0 : 5
                        })}
                        sx={{
                            '& .MuiDataGrid-row': {
                                backgroundColor: grey[200],
                            },
                        }}
                    />

                    <Button onClick={async () => {
                        console.log(state)
                        dispatch({type: "SET_DELETE_PROMPT", payload: true})
                    }}>Log the State!</Button>
            </Grid>
            <Dialog
                open={state.deletePrompt}
                onClose={() => dispatch({type: "SET_DELETE_PROMPT", payload: false})}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete order with id: " + state.selectionModel + "?"}</DialogTitle>

                <DialogActions sx={{justifyContent: "center"}}>
                    <Button onClick={() => dispatch({type: "SET_DELETE_PROMPT", payload: false})}>Cancel</Button>
                    <Button onClick={handleDelete} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                anchorOrigin={{"horizontal": "center", "vertical": "bottom"}}
                open={state.errorSnack}
                autoHideDuration={3000}
                onClose={handleSnackClose}
            >
                <Alert onClose={handleSnackClose} severity="success">Order deleted!</Alert>
            </Snackbar>
        </>
    );
}
export default Orders;


