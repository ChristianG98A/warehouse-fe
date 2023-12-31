"use client"
import {Purchase} from "@/app/api/purchase/types/types";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {StateContext} from "@/app/state/context";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Alert, Box, Button, Dialog, DialogActions, DialogTitle, Divider, FormControl, Grid, InputLabel, LinearProgress, MenuItem, Modal, Paper, Select, SelectChangeEvent, Snackbar, SpeedDial, SpeedDialAction, SpeedDialIcon, TextField, Typography} from "@mui/material";
import {DataGrid, GridRowsProp, GridToolbar} from "@mui/x-data-grid";
import {useContext, useEffect, useState} from "react";
import SellerInvoiceRow from "./SellerInvoiceRow";
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import {useForm} from "react-hook-form";
import {DateField} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {PersonPinCircleSharp} from "@mui/icons-material";
import {useRouter} from "next/navigation";
import {grey} from "@mui/material/colors";
import {Action, State} from "@/model/appstate/AppStateTypes";
import InvoiceGridToolbar from "./InvoiceGridToolbar";
import {Currency} from "@/model/orders/OrderTypes";

const rowsPlaceholder: GridRowsProp = [
    {id: 1, crt: 1, Furnizor: "sc cacamaca", Serie_Factura: 12312313, invoiceNumber: 123132, date: "12.07.2023", product: "eau du saq", EAN: 523526, TVA: "19", discount: "0%", buy_price: 909.9, nrceva: 1324, deposit: "barbu v", sofer: "cutare"},
];

const rows: GridRowsProp | Purchase[] = [
    {id: 1, invoice_number: 1, crt: 1, invoice_date: "12-12-2012", supplier_name: "sc caca srl", invoice_series: "123", },
];


const rowsPerPageOptions = [10, 20, 100];
const actions = [
    {icon: <FileCopyIcon />, name: 'Copy'},
    {icon: <SaveIcon />, name: 'Save'},
    {icon: <PrintIcon />, name: 'Print'},
    {icon: <ShareIcon />, name: 'Share'},
];
const ProviderOrders = () => {
    const [state, dispatch] : [State, Action] = useContext(StateContext)
    const [pageSize, setPageSize] = useState<number>(rowsPerPageOptions[0]);
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit} = useForm();
    const [selectedCurrency, setSelectedCurreny] = useState<Currency>("RON");
    const [selectedDate, setSelectedDate] = useState<any>("");
    const [selectedWarehouse, setSelectedWarehouse] = useState<any>("");
    const [selectedSupplier, setSelectedSupplier] = useState<any>({id: "", alias: ""})

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })
    const router = useRouter();
    let currentInvoice;


    // Initial Data Fetch

    const getInvoices = async () => {
        await callNextApi("POST", "purchase/purchaseList", {limit: 300, offset: 0}).catch(e => console.log("Error caught in calling proxy api!\n", e))
            .then((r: any) => {
                console.log("INVOICEEES", r)
                dispatch({type: "SET_INVOICES", payload: r?.response})
                setLoading(false)
            });
        return null;
    }

    useEffect(()=>console.log("selection model: ", state.selectionModel),[state.selectionModel])
    useEffect(() => {
        //console.log("this is the context api state:\n", state);
        console.log('initial datafetch')
        getInvoices();
        setLoading(true);
        currentInvoice = state?.currentInvoice?.length > 0 ? state.currentInvoice[0] : 0;
    }, [paginationModel])

    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch({type:"SET_SNACKBAR", payload:{...state.snackBar, state:false}})
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch({type:'SET_NEW_INVOICE_MODAL', payload: false})
        //     dispatch({type: "SET_OPEN_ERROR_SNACK", payload: false})
    };

    const addInvoice = handleSubmit(
        async (data) => {
            setLoading(true)
            console.log("form data:", data)

            const payload = {
                supplier_id: parseInt(selectedSupplier.id),
                supplier_name: selectedSupplier.alias,
                invoice_series: data.invoiceSeries,
                invoice_number: parseInt(data.invoiceNumber),
                invoice_date: selectedDate,
                warehouse_id: parseInt(selectedWarehouse.id),
                warehouse_name: selectedWarehouse.name,
                currency: data.currency,
            }

            // console.log("Payload:", payload)
            callNextApi("POST", "/purchase/createPurchase", payload).then(
                (r: any) => {
                    getInvoices();
                    setLoading(false);
                    dispatch({type:'SET_NEW_INVOICE_MODAL', payload:false})
                    dispatch({type: "SET_CURRENT_INVOICE", payload: r?.response.id_nir})
                },
                e => console.log(e)
            );
        }
    );

    return (
        <>
            <Typography textAlign={'center'} variant={"h5"} fontWeight={800} sx={{mb: 2}} gutterBottom >Lista note intrare-receptie</Typography>
            <PageBreadcrumbs
                items={[
                    {
                        name: "Achizitii",
                        path: "#",
                    },
                    {
                        name: "Comenzi Furnizori",
                        path: "/achizitii/comenzi_furnizori",
                    },
                ]}
            />
            <Grid component={Paper} container direction="column" justifySelf={"center"} justifyItems={"center"} style={{width: '100%', height: "60vh"}} >
                <DataGrid
                    rowSelection={true}
                    columnHeaderHeight={60}
                    rows={state?.invoices ?? []}
                    columns={SellerInvoiceRow()}
                    initialState={{pagination: {paginationModel: {pageSize: pageSize}}}}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50]}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        dispatch({type: "SET_CURRENT_INVOICE", payload: newRowSelectionModel})
                        dispatch({type:"SET_SELECTION_MODEL", payload:newRowSelectionModel})
                    }}
                    rowSelectionModel={state.selectionModel}
                    autoPageSize={false}
                    loading={loading}
                    slots={{toolbar: InvoiceGridToolbar}}
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
            </Grid>
            <div
            >

                <Modal
                    autoFocus={true}
                    component={"form"}
                    onSubmit={addInvoice}
                    open={state?.newInvoiceModal?? false}
                    aria-labelledby="New Invoice Modal"
                    aria-describedby="new-invoice-modal"
                    sx={{
                        position: "absolute",
                        width: {
                               xs: "100vw",
                               sm: "100vw",
                               md: "90vw",
                               lg: "max-content",
                               xl: "max-content",
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
                            Creeaza N.I.R.
                        </Typography>
                        <Grid alignItems={"center"} justifyItems={"center"} justifyContent={"center"} container spacing={3} flex={3}>
                            <Grid item xs={12} sm={12}>
                            {loading? <LinearProgress/> : null}
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    {...register("invoiceNumber")}
                                    required
                                    id="invoiceNumber"
                                    label="Numar Factura"
                                    variant="standard"
                                    autoComplete="false"
                                />
                            </ Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    {...register("invoiceSeries")}
                                    required
                                    id="invoiceNumber"
                                    label="Serie Factura"
                                    variant="standard"
                                    autoComplete="false"
                                />
                            </ Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <FormControl variant='standard' sx={{width: "100%"}}>
                                    <InputLabel id="currencySelector" >Moneda</InputLabel>
                                    <Select {...register("currency")} labelId='currencySelectorr' id="currency_selector" value={selectedCurrency}
                                        onChange={(event: any) => setSelectedCurreny(event.target.value)} >
                                        <MenuItem key={"RON"} value={"RON"}>{"RON"}</MenuItem>
                                        <MenuItem key={"EUR"} value={"EUR"}>{"EUR"}</MenuItem>
                                        <MenuItem key={"USD"} value={"USD"}>{"USD"}</MenuItem>
                                    </Select>
                                </FormControl>
                            </ Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateField
                                        required
                                        format={"YYYY-MM-DD"}
                                        label="Data Factura"
                                        value={selectedDate}
                                        onChange={(newDate) => {
                                            const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
                                            setSelectedDate(formattedDate);
                                        }}

                                    />
                                </LocalizationProvider>

                            </ Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                                <FormControl variant='standard' sx={{width: "100%"}}>
                                    <InputLabel id="groupSelector" >Depozit</InputLabel>
                                    <Select labelId='warehouse_selector' id="warehouse_selector" value={selectedWarehouse}>
                                        {state.warehouseSelection?.map((warehouse: {id: string, name: string} | any) =>
                                            (<MenuItem onClick={() => setSelectedWarehouse(warehouse)} key={warehouse.id} value={warehouse}>{warehouse.name}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </ Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}  >
                                <FormControl variant='standard' sx={{width: "100%", }}>
                                    <InputLabel id="supplier" >Furnizor</InputLabel>
                                    <Select {...register("supplier")} labelId='supplier_selector' id="supplier_select" value={selectedSupplier.alias}>
                                        {state.supplierSelection?.map((supplier: {id: string, alias: string}) => (<MenuItem key={supplier.id}
                                            onClick={() => setSelectedSupplier(supplier)} value={supplier.alias}>{supplier.alias}</MenuItem>))}
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
                <Dialog
                    open={state.addToStockPrompt}
                    onClose={() => dispatch({type: "SET_ADDTOSTOCK_PROMPT", payload: false})}
                    aria-labelledby="add-to-stock-modal"
                >
                    <DialogTitle id="add-to-stock-modal">{"Inchidere N.I.R. nr. " + state?.selectionModel?? "alege comanda" + "?"}</DialogTitle>

                    <DialogActions sx={{justifyContent: "center"}}>
                        <Button onClick={()=>{
                            dispatch({type: "SET_ADDTOSTOCK_PROMPT", payload: false})
                            callNextApi("POST", "purchase/addToStock", {
                                invoice_id: state?.currentInvoice[0],
                                warehouse_id: 89
                            }).then((r: any) => {
                                callNextApi("POST", "purchase/lockInvoice", {invoice_id: state?.currentInvoice[0]}).then(r => {
                                    dispatch({type: "SET_SNACKBAR", payload: {state: true, message: "N.I.R. inchis cu succes!", type: "success"}})
                                }).finally(()=>getInvoices())
                            },
                                (e) => dispatch({type: "SET_SNACKBAR", payload: {state: true, message: "Eroare server!", type: "error"}}))

                            }} autoFocus>
                            Accept
                        </Button>
                        <Button onClick={() => dispatch({type: "SET_ADDTOSTOCK_PROMPT", payload: false})}
                        >Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
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


export default ProviderOrders;

//const actions = [
//  { icon: <FileCopyIcon />, name: 'Copy' },
//  { icon: <SaveIcon />, name: 'Save' },
//  { icon: <PrintIcon />, name: 'Print' },
//  { icon: <ShareIcon />, name: 'Share' },
//];
