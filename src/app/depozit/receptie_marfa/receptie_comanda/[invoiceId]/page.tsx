"use client"

import {StateContext} from "@/app/state/context";
import {Action, State} from "@/app/state/types/stateTypes";
import KeyboardListener from "@/components/features/KeyboardListener";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Alert, Box, Button, Divider, Drawer, FormControlLabel, Grid, Modal, Paper, Snackbar, Switch, TextField, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import {DataGrid} from "@mui/x-data-grid";
import {useRouter} from "next/navigation";
import {ChangeEvent, KeyboardEvent, KeyboardEventHandler, SyntheticEvent, useContext, useEffect, useMemo, useState} from "react";
import {ReceptionProduct} from "./types";



const OrderReception = ({params}: {params: {invoiceId: string}}) => {
    const [state, dispatch]: [State, Action] = useContext(StateContext)
    const [currentEAN, setCurrentEAN] = useState("");
    const [receptionCartModal, setReceptionCartModal] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [needConfirmation, setNeedConfirmaton] = useState(false);
    const [confirmedQuantity, setConfirmedQuantity] = useState(0)
    const [snackBar, setSnackBar] = useState<any>({state: false, message: "Succes!", type: "success"});
    const [selectionModel, setSelectionModel] = useState<any>([0])
    const [confirmSwitch, setConfirmSwitch] = useState(false);
    const [currentReception, setCurrentReception] = useState<any>();
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })
    const [productsLeftForReception, setProductsLeftForReception] = useState<ReceptionProduct[]>([]);

    const invoiceId = parseInt(params.invoiceId);

    const handleKeyDown = (event: any) => {
        if (event.key === "Enter") {
            handleSubmitInventoryProduct(false);
        }
    };


    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar({...snackBar, state: false})
    };


    const handleRowClick = async (params: any) => {
        setReceptionCartModal(true)
        setCurrentReception(parseInt(params.row?.row_id))
        await getNotReceptionedProducts(parseInt(params.row?.row_id))
    }


    const handleSubmitInventoryProduct = (eanConfirm: boolean) => {
        console.log("This will go to function", currentEAN)
        setLoading(true)

        if (confirmSwitch) {
            const payload = []
            for (let i = 0; i < confirmedQuantity; i++){
                const productToBeSubmitted = productsLeftForReception[i]

                payload.push({
                    product_id: parseInt(productToBeSubmitted.product_id),
                    ean_code: parseInt(currentEAN),
                    row_id: parseInt(productToBeSubmitted.id),
                    publish_ean: eanConfirm ? 1 : 0,

                })
                }
            console.log("The biiig payload: ", payload)

            addProductToInventory(payload)
                .catch(e => console.log("error in confirming stock of multiple items! ", e))

        }
        else {
            const productToBeSubmitted = productsLeftForReception[0]
            console.log("This product will be confirmed: ", productToBeSubmitted)

            const payload = [{
                product_id: parseInt(productToBeSubmitted.product_id),
                ean_code: parseInt(currentEAN),
                row_id: parseInt(productToBeSubmitted.id),
                publish_ean: eanConfirm ? 1 : 0,
            }]

            console.log("the payload ", payload)
            addProductToInventory(payload)
                .catch(e => console.log("error in confirming stock! ", e))

        }
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

    const addProductToInventory = async (product: any) => {
        setLoading(true);

        await callNextApi("POST", "inventory/addProductInventory", product)
            .catch(e => console.log("Error in fetching the products left for reception: ", e))
            .then(async (r: any) => {
                console.log("The response: ", r.responses)

                if (r.responses.find((item: any) => item.ean_exist === 0)) {
                    setNeedConfirmaton(true);
                    await getNotReceptionedProducts(currentReception)
                        .catch(e => console.log("Error refetching products", e))
                }
                else {
                    setNeedConfirmaton(false);
                    setCurrentEAN("")
                    await getNotReceptionedProducts(currentReception)
                        .catch(e => console.log("Error refetching products", e))
                }
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

    //useEffect(() => console.log(currentEAN), [currentEAN])



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
                <Modal
                    autoFocus={true}
                    component={"form"}
                    onSubmit={() => console.log("onSubmit works")}
                    open={needConfirmation}
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
                        <Grid alignItems={"center"} justifyItems={"center"} justifyContent={"center"} container spacing={3} >
                            <Grid item xs={12}>
                                <Typography textAlign={"center"} id="new_invoice_modal" variant="h6" component="h2">
                                    Codul EAN nu exista in evidenta. Doresti sa il adaugi?
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sx={{display: 'flex', justifyContent: "right"}}>
                                <Button variant="contained" type={"submit"} onClick={(e) => {
                                    e.preventDefault();
                                    handleSubmitInventoryProduct(true);
                                    setCurrentEAN("")
                                }}>
                                    Confirma
                                </Button>
                            </Grid>
                            <Grid item xs={6} sx={{display: 'flex', justifyContent: "left"}}>
                                <Button variant="contained" onClick={() => {
                                    setNeedConfirmaton(false)
                                    setCurrentEAN("")
                                }}>

                                    Anuleaza
                                </Button>
                            </Grid>

                        </Grid>
                    </ Box>
                </Modal>

                <Box sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography textAlign={"center"} id="reception_cart" variant="h6" component="h2">
                        Scaneaza Produse
                    </Typography>
                    <Grid alignItems={"center"} alignContent={'center'} justifyItems={"center"} justifyContent={"center"} container spacing={3} sx={{mt: 5}}>
                        <Grid item md={5} lg={5} sx={{display: 'flex', justifyContent: 'center', }}>
                            <TextField
                                sx={{width: '100%', }}
                                label={'EAN'}
                                value={currentEAN}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => setCurrentEAN(event.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus={true}
                            />
                        </ Grid>
                        <Grid item md={2} lg={1}>
                            <TextField
                                disabled={!confirmSwitch}
                                label={"Cantitate"}
                                type="number"
                                value={confirmedQuantity}
                                onChange={(event)=>setConfirmedQuantity(event.target.value)}
                            />
                        </Grid>
                        <Grid item md={2} lg={2}>
                            <FormControlLabel control={<Switch value={confirmSwitch}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setConfirmSwitch(event.target.checked);
                                }} />}
                                label="Confirma cantitatea"
                            />
                        </Grid>


                        <Grid item xs={12} md={9} sx={{...center}} >
                            <DataGrid
                                getRowId={(row) => row.id}
                                rowSelection={true}
                                columnHeaderHeight={70}
                                rows={productsLeftForReception ?? []}
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
                            <Button
                                sx={{mr: 3}}
                                variant="contained"
                                onClick={() => handleSubmitInventoryProduct(false)}
                            >
                                Submit
                            </Button>
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
