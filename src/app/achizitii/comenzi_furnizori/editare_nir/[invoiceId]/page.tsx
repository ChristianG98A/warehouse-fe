"use client"

import {StateContext} from "@/app/state/context";
import {Action, State} from "@/app/state/types/stateTypes";
import BasicTable from "@/components/common/BasicTable";
import CustomToolbar from "@/components/common/CustomToolbar";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Alert, Box, Button, colors, Divider, Drawer, Fade, FormControlLabel, Grid, makeStyles, Modal, Paper, Snackbar, Switch, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import {DataGrid} from "@mui/x-data-grid";
import {DateField, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {useRouter} from "next/navigation";
import {useContext, useEffect, useMemo, useReducer, useState} from "react";
import {useForm} from "react-hook-form";
import { editInvoiceReducer } from "../editInvoiceState";


const disabledButtonStyle = {
    '& .MuiInputBase-root.Mui-disabled': {
        color: colors.common
    }
}


const InvoiceEdit = ({ params } : { params: { invoiceId: string } }) => {
    const [state, dispatch]: [State, Action] = useContext(StateContext)
    const [tab, setTab] = useState<string>('products')
    const [invoiceDetails, setInvoiceDetails]=useState<{invoiceSeries:string, invoiceNumber:number, date:Date}>()
    const [productCart, setProductCart] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [snackBar, setSnackBar] = useState<any>({state: false, message: "Succes!", type: "success"});
    const debounce = require('lodash.debounce');
    const [selectionModel, setSelectionModel] = useState<any>([0])
    const [editInvoiceState, editInvoiceDispatch] = useReducer(editInvoiceReducer, {})
    const [editSwitch, setEditSwitch] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })
    const invoiceId = parseInt(params.invoiceId)
    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar({...snackBar, state: false})
    };

    const handleRowUpdate = (data: any) => {
        //console.log("This goes into product basket! :", data)
        const index = state?.productBasket?.findIndex((item: any) => item.id === data.id);
        //console.log("New row data: ", data, index)
        dispatch({type: "SET_PRODUCT_BASKET", payload: data})
    }
    const handleSubmitInvoiceDetails = async () => {

        setLoading(true)
        await callNextApi("POST", "purchase/setInvoiceValues", {
            invoice_id: invoiceId,
            invoice_series: editInvoiceState.invoiceSeries,
            invoice_number: editInvoiceState.invoiceNumber,
            invoice_date: editInvoiceState.date
        })
            .catch(e => {
                console.log("Error in submitting invoice details: \n", e)
                setSnackBar({message: "Eroare!", type: "error", state: true})
            })
            .then(
                r => {
                    setLoading(false)
                    getInvoiceDetails(invoiceId)
                    setSnackBar({type: "success", message: "Produse alocate cu succes!", state: true})
                }

            )

    }


    const handleSubmitProducts = async () => {
        setLoading(true)
        await callNextApi("POST", "purchase/addProduct", {
            invoice_id: invoiceId,
            products: state?.productBasket?.map((product: any) => {
                return ({
                    "product_id": parseInt(product.id),
                    "product_name": product.name,
                    "acquisition_price": product.acquisition_price ?? "0",
                    "quantity": product.quantity ?? 0,
                    "tax": product.tax ?? "1.19",
                })
            }),
        })
            .catch(e => {
                console.log("Error in submitting products: \n", e)
                setSnackBar({message: "Eroare!", type: "error", state: true})
            })
            .then(
                r => {
                    setLoading(false)
                    getInvoiceProducts(invoiceId).then(r => setLoading(false))
                    setProductCart(false)
                    setSnackBar({type: "success", message: "Produse alocate cu succes!", state: true})
                }

            )
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => setTab(newValue);


    const handleSearch = debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        if (input?.length >= 3) {
            setLoading(true)

            await callNextApi("POST", "purchase/searchProduct", {searchterm: input})
                .catch(e => console.log("Error searching for product: ", e))
                .then((r: any) => {
                    console.log(r.response)
                    let id_key = 1
                    const result = r.response.map((product: {id: string, name: string, model: string}) => ({crt: id_key++, ...product}))
                    console.log("resuuult:\n", result);
                    dispatch({type: "SET_PRODUCT_RESULT", payload: result})
                    setLoading(false)
                })
        }
    }, 1000)

    const getInvoiceProducts = async (invoiceId: number) => {
        setLoading(true)
        dispatch({type: "RESET_PRODUCT_BASKET"})
        await callNextApi("POST", "purchase/getInvoicePList", {invoice_id: invoiceId})
            .catch(e => console.log("Error in fetching invoice products: ", e))
            .then((r: any) => {
                //console.log('products in invoice: \n', r?.response)
                r.response.forEach((productResult: any) => {

                    dispatch({
                        type: "SET_PRODUCT_BASKET", payload: {
                            id: parseInt(productResult.product_id),
                            name: productResult.product_name,
                            acquisition_price: productResult.acquisition_price,
                            quantity: productResult.quantity,
                            tax: productResult.tax,
                            row_id: productResult.row_id,
                        }
                    })
                })
                setLoading(false)
            })
    }

    const getInvoiceDetails = async (invoiceId: number) => {

        await callNextApi("POST", "purchase/getPurchase", {invoice_id: invoiceId})
            .catch(e => console.log("Error in fetching invoice details: ", e))
            .then((r: any) => {
                const invoiceData= r?.response[0]
                //console.log("invoice detailssssssss: \n", r)
                setInvoiceDetails({
                    invoiceNumber: invoiceData.invoice_number,
                    invoiceSeries: invoiceData.invoice_series,
                    date: invoiceData.invoice_date
                })
                editInvoiceDispatch({type: "SET_DATE", payload: dayjs(r?.response[0]?.invoice_date, "YYYY-MM-DD")})
                editInvoiceDispatch({type: "SET_INVOICE_SERIES", payload: r?.response[0]?.invoice_series})
                editInvoiceDispatch({type: "SET_INVOICE_NUMBER", payload: r?.response[0]?.invoice_number})
            })
    }

    useEffect(() => {
        setLoading(true)
        if (!invoiceId) {
            router.push('/receptie_marfa/comenzi_furnizori')
        } else {
            setLoading(false);
            getInvoiceProducts(invoiceId).then(r => setLoading(false))
            getInvoiceDetails(invoiceId)
        }
    }, [])

   // useEffect(() => console.log("Checkbox Selected: ", selectionModel), [selectionModel])
   // useEffect(() => console.log("Product basket: ", state?.productBasket), [state.productBasket])



    return (
        <>
            <Typography variant={"h5"} fontWeight={800} sx={{mb: 2}} textAlign='center' gutterBottom >{"Lista note intrare-receptie id: " + invoiceId}</ Typography>
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
                    {
                        name: `Editare N.I.R. ${invoiceId}`,
                        path: `/achizitii/comenzi_furnizori/editare_nir/${invoiceId}`,
                    },
                ]}
            />

            <TabContext value={tab}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                        <Tab label="Produse" value="products" />
                        <Tab label="Detalii NIR" value="invoiceDetails" />
                    </TabList>
                </Box>
                <TabPanel value="products">

                    <Box sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 14,
                        p: 4,
                    }}>
                        <Grid alignItems={"center"} justifyItems={"center"} justifyContent={"center"} container spacing={3} flexDirection={"column"} >
                            <Grid item xs={10} sm={10} md={10} lg={10} xl={10} >
                                <Typography variant={"h6"} sx={{mb: 2}} gutterBottom >{"Produse alocate:"}</ Typography>
                            </Grid>
                            <Grid item xs={10} sm={10} md={10} lg={10} xl={10} sx={{width: "80%"}}>
                                <DataGrid
                                    rowSelection={false}
                                    columnHeaderHeight={60}
                                    rows={state.productBasket}
                                    pageSizeOptions={[10, 25, 50]}
                                    initialState={{pagination: {paginationModel: paginationModel}}}
                                    onPaginationModelChange={setPaginationModel}
                                    onRowSelectionModelChange={(newRowSelectionModel) => {
                                        setSelectionModel(newRowSelectionModel)
                                    }}
                                    columns={useMemo(() => ([
                                        {field: 'id', headerName: 'ID Produs', flex: 2},
                                        {field: 'name', headerName: 'Denumire Produs', flex: 4},
                                        {field: 'acquisition_price', headerName: 'Pret de Achizitie', flex: 2, editable: true, type: "string", },
                                        {field: 'quantity', headerName: 'Cantitate', flex: 2, editable: true, type: "number"},
                                        {field: 'tax', headerName: 'TVA', flex: 2, editable: true, type: "number"},

                                    ]), [])}

                                    getRowSpacing={params => ({
                                        top: params.isFirstVisible ? 0 : 5,
                                        bottom: params.isLastVisible ? 0 : 5
                                    })}
                                    sx={{
                                        '& .MuiDataGrid-row': {
                                            backgroundColor: grey[200],
                                        },
                                    }}

                                    autoPageSize={false}
                                    loading={loading}
                                    slots={{toolbar: CustomToolbar}}
                                    onRowEditCommit={(ceva: any) => console.log("bum ", ceva)}
                                    processRowUpdate={handleRowUpdate}
                                    onProcessRowUpdateError={e => console.log('Error encountered when editing rows: \n', e)}
                                    getRowId={(row) => row.id}
                                    editMode="row"
                                />
                            </ Grid>

                            <Grid item xs={10} sm={10} md={10} lg={10} xl={10} >
                                <Button disabled={state.productBasket.length == 0} variant="contained" sx={{mt: 2}} onClick={handleSubmitProducts}>
                                    Salveaza
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                </TabPanel>

                <TabPanel value="invoiceDetails">
                    <Box sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 14,
                        p: 4,
                    }}>
                        <Grid alignItems={"center"} justifyItems={"center"} justifyContent={"center"} container spacing={3} flexDirection={"row"} >
                            <Grid item xs={12} sx={{display: 'flex', justifyContent: 'left', pl: 4}}>
                                <FormControlLabel control={<Switch value={editSwitch}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setEditSwitch(event.target.checked);
                                    }} />} label="Editeaza" />
                            </Grid>

                            <Grid item xs={12} sx={center}>
                                <Typography variant={"h6"} sx={{mb: 2}} gutterBottom >{"Detalii NIR:"}</ Typography>
                            </Grid>

                            <Grid item xs={12} sx={{...center, }}>
                                <TableContainer component={Paper}>
                                    <Table sx={{minWidth: 450}} aria-label="invoice data table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Serie factura</TableCell>
                                                <TableCell align="center">Numar Factura</TableCell>
                                                <TableCell align="center">Data Factura</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            <TableRow
                                                key={editInvoiceState.invoiceNumber}
                                            >
                                                <TableCell component="th" scope="row" align='center'>
                                                    {invoiceDetails?.invoiceSeries}
                                                </TableCell>
                                                <TableCell align="center">{invoiceDetails?.invoiceNumber}</TableCell>
                                                <TableCell align="center" >{dayjs(invoiceDetails?.date).format("YYYY-MM-DD")}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>

                            <Fade in={editSwitch}>
                                <Grid item xs={4} sx={center}>
                                    <TextField disabled={!editSwitch} id="invoiceSeries" focused={true} label="Serie Factura" variant="standard"
                                        onChange={(event) => editInvoiceDispatch({type: "SET_INVOICE_SERIES", payload: event.target.value})}
                                    />
                                </ Grid>
                            </Fade>

                            <Fade in={editSwitch}>
                                <Grid item xs={4} sx={center}>
                                    <TextField disabled={!editSwitch} id="invoiceNummber" focused={true} label="Numar Factura" variant="standard"
                                        onChange={(event) => editInvoiceDispatch({type: "SET_INVOICE_NUMBER", payload: event.target.value})}
                                    />
                                </ Grid>

                            </Fade>
                            <Fade in={editSwitch}>
                                <Grid item xs={4} sx={center}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateField
                                            disabled={!editSwitch}
                                            focused={true}
                                            required
                                            format={"YYYY-MM-DD"}
                                            label="Data Factura"
                                            onChange={(newDate: any) => {
                                                editInvoiceDispatch({type: "SET_DATE", payload: dayjs(newDate).format("YYYY-MM-DD")})
                                            }}
                                        />
                                    </LocalizationProvider>
                                </ Grid>
                            </Fade>
                            <Grid item xs={12} sx={center} >

                                <Divider sx={{width: "60%"}} />

                            </Grid>
                            <Fade in={editSwitch}>
                            <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center', pr: 2}}>
                                <Button variant="contained" disabled={!editSwitch} onClick={handleSubmitInvoiceDetails}>
                                    Salveaza
                                </Button>
                            </Grid>

                            </Fade>

                        </Grid>
                    </Box>
                </TabPanel>
            </TabContext>

            <Drawer
            anchor={"top"}
            open={state.productBasketModal}
            onClose={()=>dispatch({type:'SET_PRODUCT_BASKET_MODAL', payload:true})}
                aria-labelledby="Product Cart"
                aria-describedby="Product-Cart-Modal"
          >

                <Box sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>

                    <Typography textAlign={"center"} id="new_invoice_modal" variant="h6" component="h2">
                        Alege produse
                    </Typography>
                    <Grid alignItems={"center"} justifyItems={"center"} justifyContent={"center"} container spacing={3} flexDirection={"column"} sx={{mt: 5}}>
                        <Grid item xs={10} sm={10} md={10} lg={10} xl={10} >
                            <TextField
                                sx={{width: '30rem'}}
                                onChange={handleSearch}
                                label={'Denumire / SKU / ID'}
                            />
                        </ Grid>

                        <Grid item xs={10} sm={10} md={10} lg={10} xl={10} sx={{width: "80%"}}>
                            <DataGrid
                                getRowId={(row) => row.id}
                                rowSelection={true}
                                columnHeaderHeight={60}
                                checkboxSelection
                                rows={state.productResult}
                                pageSizeOptions={[10, 25, 50]}
                                initialState={{pagination: {paginationModel: paginationModel}}}
                                onPaginationModelChange={setPaginationModel}
                                onRowSelectionModelChange={(newRowSelectionModel) => {
                                    setSelectionModel(newRowSelectionModel)
                                }}
                                columns={[
                                    {field: 'crt', headerName: 'Crt', flex: 1},
                                    {field: 'id', headerName: 'ID Produs', flex: 1},
                                    {field: 'name', headerName: 'Denumire Produs', flex: 4},
                                    {field: 'model', headerName: 'Model', flex: 4},

                                ]}
                                rowSelectionModel={selectionModel}
                                autoPageSize={false}
                                loading={loading}
                                sx={{minHeight: "30vh", maxHeight: "50vh"}}
                            />
                        </ Grid>


                        <Grid item xs={10} sm={10} md={10} lg={10} xl={10} alignItems={"center"} justifyItems={"center"} justifyContent={"center"} >
                            <Divider sx={{mt: 3, mb: 3}} />
                            <Button disabled={selectionModel?.length == 0} variant="contained" onClick={() => {
                                setSnackBar({message: "Produse adaugate in cos!", type: 'success', state: true})
                                selectionModel?.forEach((itemSelected: any) => {
                                    const checkIfProductIsInBasket = (id: any) => {
                                        return state.productBasket.some((productInBasket: any) => productInBasket.id == id)
                                    }
                                    try {
                                        if (!checkIfProductIsInBasket(itemSelected)) {
                                            dispatch({
                                                type: "SET_PRODUCT_BASKET",
                                                payload: state.productResult.find((productObject: any) => productObject.id == itemSelected)
                                            })
                                        }
                                    } catch (error) {console.log("Error in adding products to invoice!", error)}
                                })
                                setSelectionModel([])
                            }} sx={{width: "10rem"}}>
                                Adauga
                            </Button>
                            <Button variant="contained" sx={{ml: 5}} onClick={() => dispatch({type: "SET_PRODUCT_BASKET_MODAL", payload: false})}>
                                Inchide
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
          </Drawer>
            <Snackbar
                anchorOrigin={{"horizontal": "center", "vertical": "bottom"}}
                open={snackBar.state}
                autoHideDuration={3000}
                onClose={handleSnackClose}
            >
                <Alert onClose={handleSnackClose} severity={snackBar.type}>{snackBar.message}</Alert>
            </Snackbar>
        </>
    );
}

const center = {display: 'flex', justifyContent: 'center'}
export default InvoiceEdit;
