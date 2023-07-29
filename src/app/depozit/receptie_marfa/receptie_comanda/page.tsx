"use client"

import {editInvoiceReducer} from "@/app/achizitii/comenzi_furnizori/editare_nir/editInvoiceState";
import InvoiceEdit from "@/app/achizitii/comenzi_furnizori/editare_nir/page";
import {StateContext} from "@/app/state/context";
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
import LoadingInventoryReception from "./loading";



const OrderReception = () => {
    const [state, dispatch] = useContext(StateContext)
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

    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar({...snackBar, state: false})
    };

    const handleRowUpdate = (data: any) => {
        const index = state.productBasket.findIndex((item: any) => item.id === data.id);
        console.log("New row data: ", data, index)
        dispatch({type: "SET_PRODUCT_BASKET", payload: data})
    }
    const handleSubmitInvoiceDetails = async () => {

        setLoading(true)
        await callNextApi("POST", "purchase/setInvoiceValues", {
            invoice_id: parseInt(state?.currentInvoice[0]),
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
                    getInvoiceDetails(state.currentInvoice)
                    setSnackBar({type: "success", message: "Produse alocate cu succes!", state: true})
                }

            )

    }


    const handleSubmitProducts = async () => {
        setLoading(true)
        await callNextApi("POST", "purchase/addProduct", {
            invoice_id: parseInt(state?.currentInvoice[0]),
            products: state.productBasket.map((product: any) => {
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
                    getInvoiceProducts(state.currentInvoice).then(r => setLoading(false))
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
                    dispatch({type: "SET_PRODUCT_RESULT", payload: result})
                    setLoading(false)
                })
        }
    }, 1000)

    const getReceptionProducts = async (invoiceId: number) => {
        //dispatch({type: "RESET_PRODUCT_BASKET"})
        await callNextApi("POST", "inventory/getProductsList", {invoice_id: invoiceId})
            .catch(e => console.log("Error in fetching invoice products: ", e))
            .then((r: any) => {
                console.log('reception inventory: \n', r?.response)

                dispatch({type:"SET_RECEPTION_INVENTORY", payload:(r?.response)
                    .map((product:any)=>({
                            ...product,
                            id: parseInt(product.product_id)
                        }))
                    })
            })
    }

    const getInvoiceDetails = async (invoiceId: number) => {

        await callNextApi("POST", "purchase/getPurchase", {invoice_id: invoiceId})
            .catch(e => console.log("Error in fetching invoice details: ", e))
            .then((r: any) => {
                const invoiceData= r?.response[0]
                console.log("invoice details: \n", r)
                dispatch({type: "SET_CURRENT_INVOICE_DETAILS", payload: r})
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
        if (!state.currentInvoice) {
            router.push('/depozit/receptie_marfa')
        } else {
            setLoading(false);
            getReceptionProducts(state.currentInvoice).then(r => setLoading(false))
            getInvoiceDetails(state.currentInvoice)
        }
    }, [])

    useEffect(() => console.log("Checkbox Selected: ", selectionModel), [selectionModel])
    useEffect(() => console.log("Product basket: ", state?.productBasket), [state.productBasket])



    return (
        <>
            <Typography variant={"h5"} fontWeight={800} sx={{mb: 2}} textAlign='center' gutterBottom >{"Receptie comanda id: " + state.currentInvoice}</ Typography>
            <PageBreadcrumbs
                items={[
                    {
                        name: "Achizitii",
                        path: "/achizitii",
                    },
                    {
                        name: "Comenzi Furnizori",
                        path: "/receptie_marfa",
                    },
                    {
                        name: "Editare N.I.R.",
                        path: "/receptie_comanda",
                    },
                ]}
            />


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
                                    rows={state?.receptionInventory ?? []}
                                    pageSizeOptions={[10, 25, 50]}
                                    initialState={{pagination: {paginationModel: paginationModel}}}
                                    onPaginationModelChange={setPaginationModel}
                                    onRowSelectionModelChange={(newRowSelectionModel) => {
                                        setSelectionModel(newRowSelectionModel)
                                    }}
                                    columns={useMemo(() => ([
                                        {field: 'product_id', headerName: 'ID Produs', flex: 2},
                                        {field: 'product_name', headerName: 'Denumire Produs', flex: 4},
                                        {field: 'total_quantity', headerName: 'Cantitate Totala', flex: 2,},
                                        {field: 'receptioned_quantity', headerName: 'Cantitate Receptionata', flex: 2, },
                                        {field: 'not_confirmed_quantity', headerName: 'Ramas de Receptionat', flex: 2, },

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
export default OrderReception;
