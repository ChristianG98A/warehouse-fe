"use client"
import {Purchase} from "@/app/api/purchase/types/types";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {StateContext} from "@/app/state/context";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Alert, Box, Button, Divider, FormControl, Grid, InputLabel, MenuItem, Modal, Paper, Select, SelectChangeEvent, Snackbar, SpeedDial, SpeedDialAction, SpeedDialIcon, TextField, Typography} from "@mui/material";
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
import {Action, State} from "@/app/state/types/stateTypes";

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
    const [newInvoiceModal, setNewInvoiceModal] = useState(false);
    const [snackBar, setSnackBar] = useState<any>({state: false, message: "Succes!", type: "success"});
    const [pageSize, setPageSize] = useState<number>(rowsPerPageOptions[0]);
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit} = useForm();
    const [selectedCurrency, setSelectedCurreny] = useState<"EUR" | "RON" | "USD" | string>("RON");
    const [selectedDate, setSelectedDate] = useState<any>("");
    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState<any>("");
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState<any>({id: "", alias: ""})

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })
    const router = useRouter();

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

    useEffect(() => {
        //console.log("this is the context api state:\n", state);
        console.log('initial datafetch')
        getInvoices();
        setLoading(true);
    }, [paginationModel])

    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar({...snackBar, state: false})
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setNewInvoiceModal(false);
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
                    setNewInvoiceModal(false);
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
                        name: "Receptie marfa",
                        path: "/receptie_marfa",
                    },
                    {
                        name: "Comenzi Furnizori",
                        path: "/comenzi_furnizori",
                    },
                ]}
            />
            <Grid component={Paper} container direction="column" justifySelf={"center"} justifyItems={"center"} style={{width: '100%', height: "60vh"}} >
                <DataGrid
                    rowSelection={true}
                    columnHeaderHeight={60}
                    rows={state.invoices}
                    columns={SellerInvoiceRow()}
                    initialState={{pagination: {paginationModel: {pageSize: pageSize}}}}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50]}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        dispatch({type: "SET_CURRENT_INVOICE", payload: newRowSelectionModel})
                    }}
                    rowSelectionModel={state.selectionModel}
                    autoPageSize={false}
                    loading={loading}
                    // slots={{toolbar: CustomToolbar}}
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
            </Grid>
            <div
            >

                <Modal
                    autoFocus={true}
                    component={"form"}
                    onSubmit={addInvoice}
                    open={newInvoiceModal}
                    aria-labelledby="New Invoice Modal"
                    aria-describedby="new-invoice-modal"
                    sx={{
                        position: "absolute",
                        width: "max-content",
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
                                        onChange={(event: SelectChangeEvent) => setSelectedCurreny(event.target.value)} >
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
                                        {warehouses?.map((warehouse: {id: string, name: string} | any) =>
                                            (<MenuItem onClick={() => setSelectedWarehouse(warehouse)} key={warehouse.id} value={warehouse}>{warehouse.name}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </ Grid>

                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}  >
                                <FormControl variant='standard' sx={{width: "100%", }}>
                                    <InputLabel id="supplier" >Furnizor</InputLabel>
                                    <Select {...register("supplier")} labelId='supplier_selector' id="supplier_select" value={selectedSupplier.alias}>
                                        {suppliers?.map((supplier: {id: string, alias: string}) => (<MenuItem key={supplier.id}
                                            onClick={() => setSelectedSupplier(supplier)} value={supplier.alias}>{supplier.alias}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </ Grid>

                        </Grid>
                        <Divider sx={{mt: 10}} />
                        <Box sx={{display: "flex", justifyContent: "right", gap: "5rem", pt: 2}} >
                            <Button variant="contained" type={"submit"}>
                                Save
                            </Button>
                            <Button variant="contained" type={"submit"} onClick={handleClose}  >
                                Cancel
                            </Button>
                        </Box>

                    </Box>
                </Modal>
            </div>
            <SpeedDial
                ariaLabel="Invoice Actions"
                sx={{position: 'absolute', bottom: "1rem", right: "2rem"}}
                icon={<SpeedDialIcon />}
            >
                <SpeedDialAction
                    key={"new_invoice"}
                    icon={<SaveIcon />}
                    tooltipTitle={"Creeaza N.I.R."}
                    onClick={() => {
                        callNextApi("POST", "purchase/purchaseInit").then((r: any) => {
                            setWarehouses(r?.response.warehouses)
                            setSuppliers(r?.response.suppliers)
                        })
                        setNewInvoiceModal(true)
                    }}
                />

                <SpeedDialAction
                    key={"edit_invoice"}
                    icon={<PersonPinCircleSharp />}
                    tooltipTitle={"Editare N.I.R."}
                    onClick={() => {
                        if (state?.currentInvoice) {
                            router.push(`/achizitii/comenzi_furnizori/editare_nir/${state.currentInvoice}`)
                        }
                        else {
                            setSnackBar({message: "Selecteaza o comanda!", type: "error", state: true})
                        }
                    }}
                />
            </SpeedDial>
            <Snackbar
                anchorOrigin={{"horizontal": "center", "vertical": "bottom"}}
                open={snackBar.state}
                autoHideDuration={3000}
                onClose={handleSnackClose}
            >
                <Alert onClose={handleSnackClose} severity={snackBar.type}>{snackBar.message}</Alert>
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
