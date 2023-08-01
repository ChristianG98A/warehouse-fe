"use client"

import {StateContext} from "@/app/state/context";
import {Action, State} from "@/app/state/types/stateTypes";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Alert, Box, Button, Divider, Drawer, FormControlLabel, Grid, Snackbar, Switch, TextField, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import {DataGrid} from "@mui/x-data-grid";
import {useRouter} from "next/navigation";
import {useContext, useEffect, useMemo, useState} from "react";
import {useZxing} from "react-zxing";
import {ReceptionProduct} from "./types";



const OrderReception = ({params}: {params: {invoiceId: string}}) => {
    const [state, dispatch] : [State, Action] = useContext(StateContext)
    const [receptionCartModal, setReceptionCartModal] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [snackBar, setSnackBar] = useState<any>({state: false, message: "Succes!", type: "success"});
    const debounce = require('lodash.debounce');
    const [selectionModel, setSelectionModel] = useState<any>([0])
    const [editSwitch, setEditSwitch] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })
    const [productsLeftForReception, setProductsLeftForReception] = useState<ReceptionProduct[]>([]);
    const { ref } = useZxing({
            onResult(result){
                    console.log("Scanner result", result.getText());
                }
        })

    const invoiceId = parseInt(params.invoiceId);


    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar({...snackBar, state: false})
    };


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

    const getReceptionProducts = async (invoiceId: number) => {
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

    useEffect(() => {
        setLoading(true)
        if (!invoiceId) {
            router.push('/depozit/receptie_marfa')
        } else {
            setLoading(false);
            getReceptionProducts(invoiceId).then(r => setLoading(false))
        }
    }, [])

    //useEffect(()=>console.log(state.receptionInventory), [state.receptionInventory])



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
                    <Grid alignItems={"center"} alignContent={'center'} justifyItems={"center"} justifyContent={"center"} container spacing={3} sx={{mt: 5}}>
                        <Grid item xs={12} sx={{display:'flex', justifyContent:'center', }}>
                            <TextField
                                sx={{width: '30rem', pr:5}}
                                label={'EAN'}
                            />
                            <FormControlLabel control={<Switch value={editSwitch}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setEditSwitch(event.target.checked);
                                }} />}
                                label="Confirma cantitatea"
                            />
                        </ Grid>


                        <Grid item xs={12} md={8} sx={{...center}} >
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
                                    {field: 'product_name', headerName: 'Denumire Produs', flex: 1},

                                ]}
                                rowSelectionModel={selectionModel}
                                autoPageSize={false}
                                loading={loading}
                                sx={{minHeight: "55vh", maxHeight: "55vh"}}
                            />
                        </ Grid>

                        <Grid item xs={12} >
                            <Divider sx={{mt: 3, mb: 3}} />
                        </Grid>

                        <Grid item xs={10} sx={{...center}} >
                            <Button variant="contained" onClick={() => setReceptionCartModal(false)}>
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
