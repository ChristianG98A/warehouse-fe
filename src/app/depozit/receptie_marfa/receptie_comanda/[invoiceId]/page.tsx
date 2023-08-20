"use client"

import {StateContext} from "@/app/state/context";
import {Action, State} from "@/model/appstate/AppStateTypes";
import KeyboardListener from "@/components/features/KeyboardListener";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Alert, Box, Button, Divider, Drawer, FormControlLabel, Grid, Modal, Paper, Snackbar, Switch, TextField, Typography} from "@mui/material";
import {green, grey} from "@mui/material/colors";
import {DataGrid} from "@mui/x-data-grid";
import {useRouter} from "next/navigation";
import {ChangeEvent, KeyboardEvent, KeyboardEventHandler, SyntheticEvent, useContext, useEffect, useMemo, useRef, useState} from "react";
import {ReceptionProduct} from "./types";



const OrderReception = ({params}: {params: {invoiceId: string}}) => {
    const [state, dispatch]: [State, Action] = useContext(StateContext)
    const [editable, setEditable] = useState(true);
    const [currentEAN, setCurrentEAN] = useState("");
    const [receptionCartModal, setReceptionCartModal] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [needConfirmation, setNeedConfirmaton] = useState(false);
    const [confirmedQuantity, setConfirmedQuantity] = useState<number|"">(1)
    const [selectionModel, setSelectionModel] = useState<any>([0])
    const [confirmSwitch, setConfirmSwitch] = useState(false);
    const [highlightedRow, setHighlightedRow] = useState(null);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })
    const eanTextFieldRef = useRef<any>(null);

    const invoiceId = parseInt(params.invoiceId);

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
    const handleKeyDown = async (event: any) => {
        if (event.key === "Enter") {
            setEditable(false);

            await addProductToInventory({
                ean_code: currentEAN,
                invoice_in_id: invoiceId,
                total_count_to_add_in_stock: confirmedQuantity,
            }).catch(e => console.log("Error encountered while submitting product payload:", e))
                .finally(() => {
                    setCurrentEAN("")
                    eanTextFieldRef.current.focus();
                    setEditable(true);
                })
        }
    };


    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch({type: "SET_SNACKBAR", payload: {...state.snackBar, state: false}})
    };


    const handleRowClick = async (params: any) => {
        //setReceptionCartModal(true)
        //setCurrentReception(parseInt(params.row?.row_id))
        //await getNotReceptionedProducts(parseInt(params.row?.row_id))
    }



    const addProductToInventory = async (product:{
            ean_code:string;
            invoice_in_id:number;
            total_count_to_add_in_stock:number;
        }) => {
        setLoading(true);
        console.log('adding the following product to inventory', product)

        await callNextApi("POST", "inventory/addProductInventory", product)
            .catch(e => console.log("Error in fetching the products left for reception: ", e))
            .then(async (r: any) => {
                console.log("addProductToInventory: ", r.responses)
                if (r.responses.find((product: any) => product.error === true)) {
                    dispatch({type: "SET_SNACKBAR", payload: {state: true, message: "EAN-ul inserat nu exista in baza de date, te rog sa il adaugi produsului corespondent", type: "error"}})
                }
                else {
                    dispatch({type: "SET_SNACKBAR", payload: {state: true, message: "Produs receptionat cu succes!", type: "success"}})

                }
                getReceptionProducts(invoiceId).then(() => setLoading(false));
            })

    }

//
//    const getNotReceptionedProducts = async (rowId: number) => {
//        setLoading(true);
//        await callNextApi("POST", "inventory/getNotConfirmedProductPcs", {invoice_product_row_id: rowId})
//            .catch(e => console.log("Error in fetching the products left for reception: ", e))
//            .then((r: any) => {
//                console.log(r?.response)
//                setProductsLeftForReception(r.response)
//                setLoading(false);
//            })
//
//    }
//


    useEffect(() => {
        setLoading(true)
        if (!invoiceId) {
            router.push('/depozit/receptie_marfa')
        } else {
            setLoading(false);
            getReceptionProducts(invoiceId).then(r => setLoading(false))
        }
    }, [])

    useEffect(() => {
        eanTextFieldRef.current.focus()
    }, [editable, eanTextFieldRef])



    return (
        <>
            <Typography variant={"h5"} fontWeight={800} sx={{mb: 2}} textAlign='center' gutterBottom >{"Receptie comanda id: " + invoiceId}</ Typography>
            <PageBreadcrumbs
                items={[
                    {
                        name: "Depozit",
                        path: "#",
                    },
                    {
                        name: "Receptie Marfa",
                        path: "/depozit/receptie_marfa",
                    },
                    {
                        name: `Receptie comanda ${invoiceId}`,
                        path: `/depozit/receptie_marfa/receptie_comanda/${invoiceId}`,
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
                        <Typography variant={"h6"} sx={{mb: 2}} gutterBottom >{"Scaneaza produse:"}</ Typography>
                    </Grid>
                    <Grid alignItems={"center"} alignContent={'center'} justifyItems={"center"} justifyContent={"center"} container spacing={3} sx={{mt: 5}}>
                        <Grid item md={5} lg={5} sx={{display: 'flex', justifyContent: 'center', }}>
                            <TextField
                                sx={{width: '100%', }}
                                label={'EAN'}
                                value={currentEAN}
                                disabled={!editable}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => setCurrentEAN(event.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus={false}
                                inputRef={eanTextFieldRef}
                            />
                        </ Grid>
                        <Grid item md={2} lg={1}>
                            <TextField
                                disabled={!confirmSwitch}
                                label={"Cantitate"}
                                type="number"
                                value={confirmedQuantity}
                                onChange={(event) => {
                                    try {
                                        setConfirmedQuantity(parseInt(event.target.value))
                                        } catch (e) {
                                            }
                                }}
                            />
                        </Grid>
                        <Grid item md={2} lg={2}>
                            <FormControlLabel control={<Switch value={confirmSwitch}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setConfirmSwitch(event.target.checked);
                                    setConfirmedQuantity(1);
                                }} />}
                                label="Confirma cantitatea"
                            />
                        </Grid>
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
                                minHeight: "45vh",
                                '& .MuiDataGrid-row': {
                                    backgroundColor: grey[200],
                                },
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: green[100],
                                },
                            }}

                            autoPageSize={false}
                            onRowClick={handleRowClick}
                            loading={loading}
                            getRowId={(row) => row.id}
                        />
                    </ Grid>
                    <Grid item xs={10} sx={{...center}} >
                        <Button
                            sx={{mr: 3}}
                            variant="contained"
                            onClick={() => addProductToInventory({
                                ean_code: currentEAN,
                                invoice_in_id:invoiceId,
                                total_count_to_add_in_stock:confirmedQuantity,
                            })}
                        >
                            Submit
                        </Button>
                        <Button variant="contained" onClick={() => setReceptionCartModal(false)}>
                            Inchide
                        </Button>
                    </Grid>

                    {/*
                                <Grid item xs={10} sm={10} md={10} lg={10} xl={10} >
                                <Button disabled={state.productBasket.length == 0} variant="contained" sx={{mt: 2}} onClick={handleSubmitProducts}>
                                    Receptioneaza
                                </Button>
                            </Grid>
                           */}
                </Grid>
            </Box>

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
                                //need method
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
export default OrderReception;
