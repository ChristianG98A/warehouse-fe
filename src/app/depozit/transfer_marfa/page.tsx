"use client"

import {Purchase} from "@/app/api/purchase/types/types";
import {StateContext} from "@/app/state/context";
import {Action, State} from "@/model/appstate/AppStateTypes";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {PersonPinCircleSharp} from "@mui/icons-material";
import {Typography, Grid, Paper, SpeedDial, SpeedDialIcon, SpeedDialAction, Snackbar, Alert, Box, Button, Divider, FormControl, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, TextField} from "@mui/material";
import {grey} from "@mui/material/colors";
import {GridRowsProp, DataGrid, GridToolbar} from "@mui/x-data-grid";
import {LocalizationProvider, DateField} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {useRouter} from "next/navigation";
import {useContext, useState, useEffect, useMemo} from "react";
import {useForm} from "react-hook-form";
import ReceptionsColumns from "../receptie_marfa/ReceptionsColumns";
import TransferToolbar from "./TransferToolbar";
import {Warehouse} from "@/model/warehouse/WarehouseTypes";

const rowsPlaceholder: GridRowsProp = [
    {id: 1, crt: 1, Furnizor: "sc cacamaca", Serie_Factura: 12312313, invoiceNumber: 123132, date: "12.07.2023", product: "eau du saq", EAN: 523526, TVA: "19", discount: "0%", buy_price: 909.9, nrceva: 1324, deposit: "barbu v", sofer: "cutare"},
];

const rows: GridRowsProp | Purchase[] = [
    {id: 1, invoice_number: 1, crt: 1, invoice_date: "12-12-2012", supplier_name: "sc caca srl", invoice_series: "123", },
];


const rowsPerPageOptions = [10, 20, 100];
const StockTransfer = () => {
    const [state, dispatch]:[State, Action] = useContext(StateContext)
    const [newInvoiceModal, setNewInvoiceModal] = useState(false);
    const [selectedOldWarehouse, setSelectedOldWarehouse] = useState<Warehouse|any>("");
    const [selectedNewWarehouse, setSelectedNewWarehouse] = useState<Warehouse|any>("");
    const [pageSize, setPageSize] = useState<number>(rowsPerPageOptions[0]);
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit} = useForm();

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })
    const router = useRouter();



    const addTransfer = handleSubmit(
        async (data) => {
            setLoading(true)
            console.log("form data:", data)

           const payload = {
               old_warehouse: selectedOldWarehouse.id,
               new_warehouse: selectedNewWarehouse.id,
               old_warehouse_name: selectedOldWarehouse.name,
               new_warehouse_name: selectedNewWarehouse.name,
           }

            console.log("Payload:", payload)

            callNextApi("POST", "/transfers/createTransfer", payload).then(
               (r: any) => {
                   getTransfers();
                   setLoading(false);
                   dispatch({type:'SET_NEW_TRANSFER_MODAL', payload:false})
               },
               e => console.log(e)
           );
        }
    );



    // Initial Data Fetch

    const getTransfers = async () => {
        setLoading(true)
        await callNextApi("POST", "transfers/transfersList", {limit: 300, offset: 0})
            .catch(e => console.log("Error caught in calling proxy api!\n", e))
            .then((r: any) => {
                console.log(r)
                dispatch({type: "SET_TRANSFERS", payload: r?.response})
                setLoading(false)
            });
        return null;
    }

    useEffect(() => {
        //console.log("this is the context api state:\n", state);
        console.log('initial datafetch')
        getTransfers();
        dispatch({type:"SET_CURRENT_TRANSFER", payload: undefined})
        setLoading(true);
    }, [paginationModel])

    useEffect(()=>console.log(state.currentTransfer),[state.currentTransfer])


    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch({type: "SET_NEW_TRANSFER_MODAL", payload: false})
    };

    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch({type:"SET_SNACKBAR", payload:{...state.snackBar, state:false}})
    };

    return (
        <>
            <Typography textAlign={'center'} variant={"h5"} fontWeight={800} sx={{mb: 2}} gutterBottom >Transfer Marfa</Typography>
            <PageBreadcrumbs
                items={[
                    {
                        name: "Depozit",
                        path: "#",
                    },
                    {
                        name: "Transfer Marfa",
                        path: "/depozit/transfer_marfa",
                    },
                ]}
            />
            <Grid component={Paper} container direction="column" justifySelf={"center"} justifyItems={"center"} style={{width: '100%', height: "60vh"}} >
                <DataGrid
                    rowSelection={true}
                    columnHeaderHeight={60}
                    rows={state.transfers ?? []}
                    columns={useMemo(() => ([
                        {field: 'id', headerName: 'ID Transfer', flex: 2},
                        {field: 'old_warehouse_name', headerName: 'Depozit Vechi', flex: 4},
                        {field: 'new_warehouse_name', headerName: 'Depozit Nou', flex: 2},
                        {field: 'status', headerName: 'Status', flex: 2},
                        {field: 'confirmed', headerName: 'Confirmat', flex: 2},

                    ]), [])}
                    initialState={{pagination: {paginationModel: {pageSize: pageSize}}}}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50]}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        dispatch({type: "SET_CURRENT_TRANSFER", payload: state.transfers.find(transfer=>transfer.id==newRowSelectionModel[0])})
                    }}
                    rowSelectionModel={state.selectionModel}
                    autoPageSize={false}
                    loading={loading}
                    slots={{toolbar: TransferToolbar}}
                    getRowSpacing={params => ({
                        top: params.isFirstVisible ? 0 : 5,
                        bottom: params.isLastVisible ? 0 : 5
                    })}
                    sx={{
                        minHeight:"55vh",
                        '& .MuiDataGrid-row': {
                            backgroundColor: grey[200],
                        },
                    }}
                />
            </Grid>


                <Modal
                    autoFocus={true}
                    component={"form"}
                    onSubmit={addTransfer}
                    open={state?.newTransferModal ?? false}
                    aria-labelledby="New Transfer Modal"
                    aria-describedby="new-transfer-modal"
                    sx={{
                        position: "absolute",
                        width: {
                               xs: "100vw",
                               sm: "100vw",
                               md: "90vw",
                               lg: "50vw",
                               xl: "50vw",
                            },
                        height: "max-content",
                        left: "50%",
                        top: "50%",
                        transform: 'translate(-50%, -50%)'

                    }}
                >
                    <Box sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <Typography textAlign={"center"} id="new_invoice_modal" variant="h6" component="h2">
                            Transfer Nou
                        </Typography>
                        <Grid alignItems={"center"} justifyItems={"center"} justifyContent={"center"} container spacing={3} flex={3}>

                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                                <FormControl variant='standard' sx={{width: "100%"}}>
                                    <InputLabel id="oldWarehouse" >Depozit Vechi</InputLabel>
                                    <Select required labelId='old_warehouse_selector' id="old_warehouse_selector" value={selectedOldWarehouse}>
                                        {state.warehouseTransferSelection?.warehousesAllowingServicingStock.map((warehouse:Warehouse | any) =>
                                            (<MenuItem onClick={() => setSelectedOldWarehouse(warehouse)} key={warehouse.id} value={warehouse} >{warehouse.name}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </ Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                                <FormControl variant='standard' sx={{width: "100%"}}>
                                    <InputLabel id="newWarehouse" >Depozit Nou</InputLabel>
                                    <Select required labelId='new_warehouse_selector' id="new_warehouse_name" value={selectedNewWarehouse}>
                                        {state.warehouseTransferSelection?.warehouseAllowingSellingStock.map((warehouse:Warehouse|any) =>
                                            (<MenuItem onClick={() => setSelectedNewWarehouse(warehouse)} key={warehouse.id} value={warehouse}>{warehouse.name}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </ Grid>
                        </Grid>
                        <Divider sx={{mt: 10}} />
                        <Box sx={{display: "flex", justifyContent: "center", gap: "5rem", pt: 2}} >
                            <Button variant="contained" type={"submit"}>
                                Save
                            </Button>
                            <Button variant="contained" type={"submit"} onClick={handleClose}  >
                                Cancel
                            </Button>
                        </Box>

                    </Box>
                </Modal>




            <Snackbar
                anchorOrigin={{"horizontal": "center", "vertical": "bottom"}}
                open={state.snackBar?.state}
                autoHideDuration={3000}
                onClose={handleSnackClose}
            >
                <Alert onClose={handleSnackClose} severity={state?.snackBar?.type}>{state?.snackBar?.message}</Alert>
            </Snackbar>
        </>
    )
}


export default StockTransfer;

