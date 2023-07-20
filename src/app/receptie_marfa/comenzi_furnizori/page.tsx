"use client"
import {Purchase} from "@/app/api/purchase/types/types";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {StateContext} from "@/app/state/context";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Box, FormControl, Grid, InputLabel, MenuItem, Modal, Paper, Select, SelectChangeEvent, SpeedDial, SpeedDialAction, SpeedDialIcon, TextField, Typography} from "@mui/material";
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

const rowsPlaceholder: GridRowsProp = [
    {id: 1, crt: 1, Furnizor: "sc cacamaca", Serie_Factura: 12312313, invoiceNumber: 123132, date: "12.07.2023", product: "eau du saq", EAN: 523526, TVA: "19", discount: "0%", buy_price: 909.9, nrceva: 1324, deposit: "barbu v", sofer: "cutare"},
];

const rows: GridRowsProp | Purchase[]= [
    {id: 1, invoice_number: 1, crt: 1, invoice_date: "12-12-2012", supplier_name: "sc caca srl", invoice_series: "123", },
];


const rowsPerPageOptions = [10, 20, 100];
const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
];
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "50%",
  height: "50%",
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
const ProviderOrders = () => {
    const [state, dispatch] = useContext(StateContext)
    const [newInvoiceModal, setNewInvoiceModal] = useState(false);
    const [pageSize, setPageSize] = useState<number>(rowsPerPageOptions[0]);
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit } = useForm();

    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState("");

    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState("");

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })

    // Initial Data Fetch

    useEffect(() => {
        //console.log("this is the context api state:\n", state);
        console.log('initial datafetch')
        setLoading(true);
        callNextApi("POST", "purchase/purchaseList", {limit: paginationModel.pageSize, offset: 0}).catch(e => console.log("Error caught in calling proxy api!\n", e))
            .then((r:any) => {
                console.log(r)
                dispatch({type: "SET_INVOICES", payload: r.response})
                setLoading(false)
            });
    }, [paginationModel])

   // useEffect(()=>{
   //         console.log(warehouses)
   //     }, [warehouses])


    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setNewInvoiceModal(false);
   //     dispatch({type: "SET_OPEN_ERROR_SNACK", payload: false})
    };

    //const addUser = handleSubmit(
    //    async (data) => {
    //        //setLoading(true);
    //        const addInvoice: AddInvoice = {
    //            username: username,
    //            password: data.password,
    //            firstName: data.firstName,
    //            lastName: data.lastName,
    //            role: data.role,
    //            phoneNumber: data.phoneNumber,
    //            email: emailAddress,
    //            status: data.status,
    //            groupId: role === 'MASTER' ? data.group : (await group).id
    //        };


    return (
        <>
            <Typography variant={"h6"} sx={{mb: 2}} gutterBottom >Lista note intrare-receptie</Typography>
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
                    rowSelection={false}
                    columnHeaderHeight={60}
                    //rows={useMemo(() => {return state.orders}, [state.orders])} //aici va veni Orders
                    rows={state.invoices}
                    columns={SellerInvoiceRow()}
                    initialState={{pagination: {paginationModel: {pageSize: pageSize}}}}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50]}
                    //onRowSelectionModelChange={(newRowSelectionModel) => {
                    //    dispatch({type: "SET_SELECTION_MODEL", payload: newRowSelectionModel})
                    //}}
                    //rowSelectionModel={state.selectionModel}
                    autoPageSize={false}
                    loading={loading}
                    // slots={{toolbar: CustomToolbar}}
                    slots={{toolbar: GridToolbar}}
                />
            </Grid>

            {newInvoiceModal ?
                <div>
                    <Modal
                        open={newInvoiceModal}
                        onClose={handleClose}
                        aria-labelledby="New Invoice Modal"
                        aria-describedby="new-invoice-modal"
                    >
                        <Box sx={style}>
                            <Typography textAlign={"center"} id="new_invoice_modal" variant="h6" component="h2">
                                Creeaza N.I.R.
                            </Typography>
                            <Grid alignItems={"center"} container spacing={3} flex={3}>
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
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateField defaultValue={dayjs()} disableFuture />
                                    </LocalizationProvider>
                                </ Grid>

                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{mt:5}}>
                                    <FormControl variant='standard' sx={{width: "100%"}}>
                                        <InputLabel id="groupSelector" >Depozit</InputLabel>
                                        <Select {...register("warehouse")} labelId='warehouse_selector' id="warehouse_selector" value={selectedWarehouse}
                                            onChange={(event: SelectChangeEvent) => setSelectedWarehouse(event.target.value)} >
                                            {warehouses?.map((warehouse: {id: string, name: string}) => (<MenuItem key={warehouse.id} value={warehouse.name}>{warehouse.name}</MenuItem>))}
                                        </Select>
                                    </FormControl>
                                </ Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{mt:5}} >
                                    <FormControl variant='standard' sx={{width: "100%", }}>
                                        <InputLabel id="supplier" >Furnizor</InputLabel>
                                        <Select {...register("supplier")} labelId='supplier_selector' id="supplier_select" value={selectedSupplier}
                                            onChange={(event: SelectChangeEvent) => setSelectedSupplier(event.target.value)} >
                                            {suppliers?.map((supplier: {id: string, alias: string}) => (<MenuItem key={supplier.id} value={supplier.alias}>{supplier.alias}</MenuItem>))}
                                        </Select>
                                    </FormControl>
                                </ Grid>
                            </Grid>
                        </Box>
                    </Modal>
                </div>
            :null}

            <SpeedDial
                ariaLabel="Invoice Actions"
                sx={{position: 'absolute', bottom: "3rem", right: "3rem"}}
                icon={<SpeedDialIcon />}
            >
                <SpeedDialAction
                key={"adauga_nir"}
                icon={<SaveIcon />}
                tooltipTitle={"Creeaza N.I.R."}
                onClick={()=>{
                    callNextApi("POST", "purchase/purchaseInit").then((r:any)=>{
                        setWarehouses(r?.response.warehouses)
                        setSuppliers(r?.response.suppliers)
                        })
                    setNewInvoiceModal(true)
                }}
                />
            </SpeedDial>
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
