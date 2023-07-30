"use client"

import {editInvoiceReducer} from "@/app/achizitii/comenzi_furnizori/editare_nir/editInvoiceState";
import {StateContext} from "@/app/state/context";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Alert, Box, Button, Divider, Drawer, Grid, Snackbar, TextField, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import {DataGrid} from "@mui/x-data-grid";
import dayjs from "dayjs";
import {useRouter} from "next/navigation";
import {useContext, useEffect, useMemo, useReducer, useState} from "react";
import {ReceptionProduct} from "./types";



const OrderReception = ({params}: {params: {invoiceId: string}}) => {
    const [state, dispatch] = useContext(StateContext)
    const [receptionCartModal, setReceptionCartModal] = useState(false);
    const [tab, setTab] = useState<string>('products')
    const [invoiceDetails, setInvoiceDetails] = useState<{invoiceSeries: string, invoiceNumber: number, date: Date}>()
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
    const [productsLeftForReception, setProductsLeftForReception] = useState<ReceptionProduct[]>([]);
    const invoiceId = parseInt(params.invoiceId);


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

    const handleRowClick = async (params:any) =>{
            setReceptionCartModal(true)
            await getNotReceptionedProducts(parseInt(params.row?.row_id))
        }

    const getNotReceptionedProducts = async (rowId: number) => {
        setLoading(true);
        await callNextApi("POST", "inventory/getNotConfirmedProductPcs", {invoice_product_row_id: rowId})
            .catch(e => console.log("Error in fetching the products left for reception: ", e))
            .then((r: any) => {
                console.log(r?.response)
                setProductsLeftForReception(r.response)
                setLoading(false);
            })

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
                    getInvoiceDetails(invoiceId)
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
                    //getInvoiceProducts(state.currentInvoice).then(r => setLoading(false))
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

                dispatch({
                    type: "SET_RECEPTION_INVENTORY", payload: (r?.response)
                        .map((product: any) => ({
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
                const invoiceData = r?.response[0]
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
        if (!invoiceId) {
            router.push('/depozit/receptie_marfa')
        } else {
            setLoading(false);
            getReceptionProducts(invoiceId).then(r => setLoading(false))
            //getInvoiceDetails(state.currentInvoice)
        }
    }, [])

    useEffect(() => console.log("Checkbox Selected: ", selectionModel), [selectionModel])
    useEffect(() => console.log("Product basket: ", state?.productBasket), [state.productBasket])



    return (
        <>
            <Typography variant={"h5"} fontWeight={800} sx={{mb: 2}} textAlign='center' gutterBottom >{"Receptie comanda id: " + invoiceId}</ Typography>
            <PageBreadcrumbs
                items={[
                    {
                        name: "Depozit",
                        path: "/depozit",
                    },
                    {
                        name: "Receptie Marfa",
                        path: "/receptie_marfa",
                    },
                    {
                        name: `Receptie comanda ${invoiceId}`,
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
                        <Typography variant={"h6"} sx={{mb: 2}} gutterBottom >{"Alege un produs:"}</ Typography>
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
                                {field: 'total_quantity', headerName: 'Cantitate Totala', flex: 2, },
                                {field: 'receptioned_quantity', headerName: 'Cantitate Receptionata', flex: 2, },
                                {field: 'not_confirmed_quantity', headerName: 'Ramas de Receptionat', flex: 2, },

                            ]), [])}

                            getRowSpacing={params => ({
                                top: params.isFirstVisible ? 0 : 5,
                                bottom: params.isLastVisible ? 0 : 5
                            })}
                            sx={{
                                minHeight: "55vh",
                                '& .MuiDataGrid-row': {
                                    backgroundColor: grey[200],
                                },
                            }}

                            autoPageSize={false}
                            onRowClick={handleRowClick}
                            loading={loading}
                            getRowId={(row) => row.id}
                        />
                    </ Grid>

                    {/*
                                <Grid item xs={10} sm={10} md={10} lg={10} xl={10} >
                                <Button disabled={state.productBasket.length == 0} variant="contained" sx={{mt: 2}} onClick={handleSubmitProducts}>
                                    Receptioneaza
                                </Button>
                            </Grid>
                           */}
                </Grid>
            </Box>

            <Drawer
                anchor={"top"}
                open={receptionCartModal}
                onClose={() => setReceptionCartModal(false)}
                aria-labelledby="Reception Cart"
                aria-describedby="Reception-Cart-Modal"
            >

                <Box sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>

                    <Typography textAlign={"center"} id="reception_cart" variant="h6" component="h2">
                        Scaneaza Produse
                    </Typography>
                    <Grid alignItems={"center"} justifyItems={"center"} justifyContent={"center"} container spacing={3} flexDirection={"column"} sx={{mt: 5}}>
                        <Grid item xs={10} sm={10} md={10} lg={10} xl={10} >
                            <TextField
                                sx={{width: '30rem'}}
                                label={'Denumire / SKU / ID'}
                            />
                        </ Grid>

                        <Grid item xs={10} sm={10} md={10} lg={10} xl={10} sx={{width: "80%"}}>
                            <DataGrid
                                getRowId={(row) => row.id}
                                rowSelection={true}
                                columnHeaderHeight={70}
                                rows={productsLeftForReception?? []}
                                pageSizeOptions={[10, 25, 50]}
                                initialState={{pagination: {paginationModel: paginationModel}}}
                                onPaginationModelChange={setPaginationModel}
                                onRowSelectionModelChange={(newRowSelectionModel) => {
                                    setSelectionModel(newRowSelectionModel)
                                }}
                                columns={[
                                    {field: 'id', headerName: 'ID Produs', flex: 1},
                                    {field: 'product_id', headerName: 'Model', flex: 1},
                                    {field: 'product_name', headerName: 'Denumire Produs', flex: 4},

                                ]}
                                rowSelectionModel={selectionModel}
                                autoPageSize={false}
                                loading={loading}
                                sx={{minHeight: "55vh", maxHeight: "55vh"}}
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
                            <Button variant="contained" sx={{ml: 5}} onClick={() => setReceptionCartModal(false)}>
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
export default OrderReception;
