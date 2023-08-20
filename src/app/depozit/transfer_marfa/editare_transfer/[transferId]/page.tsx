"use client"

import {editInvoiceReducer} from "@/app/achizitii/comenzi_furnizori/editare_nir/editInvoiceState";
import {StateContext} from "@/app/state/context";
import {Action, State} from "@/model/appstate/AppStateTypes";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Alert, Box, Button, colors, Divider, Grid, Snackbar, TextField, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import dayjs from "dayjs";
import {useRouter} from "next/navigation";
import {useContext, useEffect, useReducer, useState} from "react";


const disabledButtonStyle = {
    '& .MuiInputBase-root.Mui-disabled': {
        color: colors.common
    }
}


const TransferEdit = ({ params } : { params: { transferId: string } }) => {
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
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })
    const transferId = parseInt(params.transferId)

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

    //const handleSubmitProducts = async () => {
    //    setLoading(true)
    //    await callNextApi("POST", "purchase/addProduct", {
    //        invoice_id: invoiceId,
    //        products: state?.productBasket?.map((product: any) => {
    //            return ({
    //                "product_id": parseInt(product.id),
    //                "product_name": product.name,
    //                "acquisition_price": product.acquisition_price ?? "0",
    //                "quantity": product.quantity ?? 0,
    //                "tax": product.tax ?? "1.19",
    //            })
    //        }),
    //    })
    //        .catch(e => {
    //            console.log("Error in submitting products: \n", e)
    //            setSnackBar({message: "Eroare!", type: "error", state: true})
    //        })
    //        .then(
    //            r => {
    //                setLoading(false)
    //                getInvoiceProducts(invoiceId).then(r => setLoading(false))
    //                setProductCart(false)
    //                setSnackBar({type: "success", message: "Produse alocate cu succes!", state: true})
    //            }

    //        )
    //}

    const handleSearch = debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        if (input?.length >= 3) {
            setLoading(true)

            await callNextApi("POST", "transfers/searchProduct", {
                searchterm: input,
                //old_warehouse_id: state.currentTransfer.,
            })
                .catch(e => console.log("Error searching for product: ", e))
                .then((r: any) => {
                    console.log(r.response)
                    let id_key = 1
                    const result = r.response.map((product: {id: string, name: string, model: string}) => ({crt: id_key++, ...product}))
                    console.log("resuuult:\n", result);
                    dispatch({type: "SET_TRANSFER_PRODUCT_RESULT", payload: result})
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

    useEffect(() => {
        setLoading(true)
        if (!transferId) {
            router.push('/receptie_marfa/comenzi_furnizori')
        } else {
            setLoading(false);
            //getInvoiceProducts(invoiceId).then(r => setLoading(false))
            //getInvoiceDetails(invoiceId)
        }
    }, [])




    return (
        <>
            <Typography variant={"h5"} fontWeight={800} sx={{mb: 2}} textAlign='center' gutterBottom >{"Produse alocate in transfer " + transferId}</ Typography>
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
                    {
                        name: `Editare Transfer ${transferId}`,
                        path: `/depozit/transfer_marfa/editare_transfer/${transferId}`,
                    },
                ]}
            />


                    <Box sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 14,
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
                                //getRowId={(row) => row.id}
                                rowSelection={true}
                                columnHeaderHeight={60}
                                checkboxSelection
                                rows={state?.transferProductResult ?? []}
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
                                    {field: 'available_quantity', headerName: 'Cantitate Disponibila', flex: 4},
                                    {field: 'warehouse_name', headerName: 'Depozit', flex: 4},

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


            <Snackbar
                anchorOrigin={{"horizontal": "center", "vertical": "bottom"}}
                open={state.snackBar?.state}
                autoHideDuration={3000}
                onClose={handleSnackClose}
            >
                <Alert onClose={handleSnackClose} severity={state?.snackBar?.type}>{state?.snackBar?.message}</Alert>
            </Snackbar>
        </>
    );
}

const center = {display: 'flex', justifyContent: 'center'}
export default TransferEdit;
