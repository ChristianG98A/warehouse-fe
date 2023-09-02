"use client"

import {StateContext} from "@/app/state/context";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Action, State} from "@/model/appstate/AppStateTypes";
import {PostReceptionProductResponse} from "@/model/receptions/ReceptionTypes";
import {Alert, Box, Button, Grid, Modal, Snackbar, TextField, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import {DataGrid} from "@mui/x-data-grid";
import {useRouter} from "next/navigation";
import {ChangeEvent, useContext, useEffect, useMemo, useReducer, useRef, useState} from "react";



const OrderReception = ({params}: {params: {invoiceId: string}}) => {
    const [state, dispatch]: [State, Action] = useContext(StateContext);
    const [editable, setEditable] = useState(true);
    const [isEanFieldFocused, setIsEanFieldFocused] = useState(false);
    const [currentEAN, setCurrentEAN] = useState("");
    const [receptionCartModal, setReceptionCartModal] = useState(false);
    const router = useRouter();
    const debounce = require('lodash.debounce');
    const [loading, setLoading] = useState(false);
    const [needConfirmation, setNeedConfirmaton] = useState(false);
    const [selectionModel, setSelectionModel] = useState<any>([0])
    const [confirmModal, setConfirmModal] = useState(false);
    //const [highlightedRow, setHighlightedRow] = useState(null);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })
    const [remainingQuantity, setRemainingQuantity]= useState(1);
    const [confirmedQuantity, setConfirmedQuantity] = useState("1")
    const eanTextFieldRef = useRef<any>(null);

    const invoiceId = parseInt(params.invoiceId);

    const getReceptionProducts = async (invoiceId: number) => {
        await callNextApi("POST", "inventory/getProductsList", {invoice_id: invoiceId})
            .catch(e => console.log("Error in fetching invoice products: ", e))
            .then((r: any) => {
                //console.log('reception inventory: \n', r?.response)
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

            const payload = {
                ean_code: currentEAN,
                invoice_in_id: invoiceId,
                total_count_to_add_in_stock: parseInt(confirmedQuantity),
            }
            console.log(payload)
            await addProductToInventory(payload)
                .catch(e => console.log("Error encountered while submitting product payload:", e))
        }
    };

    const addProductToInventory = async (product: {
        ean_code: string;
        invoice_in_id: number;
        total_count_to_add_in_stock: number;
    }) => {
        setLoading(true);
        await callNextApi("POST", "inventory/addProductInventory", product)
            .catch(e => {
                console.log("Error in fetching the products left for reception: ", e)
                dispatch({type: "SET_SNACKBAR", payload: {state: true, message: "Error server", type: "error"}})
            })
            .then((r: any | PostReceptionProductResponse[]) => {
                // need refactor!

                if (r?.responses.find((product: PostReceptionProductResponse | any) => product.error === true)) {
                    dispatch({type: "SET_SNACKBAR", payload: {state: true, message: "EAN-ul inserat nu exista in baza de date, te rog sa il adaugi produsului corespondent", type: "error"}})
                }
                else {
                    dispatch({type: "SET_SNACKBAR", payload: {state: true, message: "Produs receptionat cu succes!", type: "success"}})
                }

                console.log("The post response: ", r?.responses)

                if (r?.responses.find((product: PostReceptionProductResponse) => product.remains_to_be_receptioned)) {
                    setRemainingQuantity(r?.responses[0]?.remains_to_be_receptioned)
                    setConfirmModal(true)
                    console.log("let's see", r?.responses[0]?.remains_to_be_receptioned)
                } else {
                    setConfirmModal(false);
                    setRemainingQuantity(1)
                    setCurrentEAN("")
                    setConfirmedQuantity("1");
                }
            })
            .catch(e => {
                console.log('could not filter result', e)
                dispatch({type: "SET_SNACKBAR", payload: {state: true, message: "Error filtrare", type: "error"}})
            }
            )
            .finally(() => {
                setEditable(true);
                //setCurrentEAN("")
                //eanTextFieldRef.current.focus();
                if(confirmModal){
                        setConfirmModal(false)
                        setConfirmedQuantity("1")
                        setCurrentEAN("")
                    }
                getReceptionProducts(invoiceId).then(() => setLoading(false));
            })
    }

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


    let eanCode = ""
    const resetInput = debounce(() => eanCode = "", 300)

    const handleKeydown = async (event: any) => {
            if (event.key === "Enter" && eanCode?.length==13) {
                event.preventDefault();
                const payload = {
                    ean_code: eanCode,
                    invoice_in_id: invoiceId,
                    total_count_to_add_in_stock: parseInt(confirmedQuantity),
                }
                console.log('the payload', payload)
                await addProductToInventory(payload)
                    .finally(() => eanCode = "")
            }
            else{
                eanCode += event.key
                console.log(eanCode)
            }
            resetInput()
    }
    useEffect(() => {
        eanTextFieldRef.current.addEventListener('focus', ()=>setIsEanFieldFocused(true))
        eanTextFieldRef.current.addEventListener('blur', ()=>setIsEanFieldFocused(false))
        document.addEventListener('keydown', handleKeydown);
        setLoading(true)
        if (!invoiceId) {
            router.push('/depozit/receptie_marfa')
        } else {
            setLoading(false);
            getReceptionProducts(invoiceId).then(r => setLoading(false))
        }
    }, [])

   // useEffect(() => {
   //     eanTextFieldRef.current.focus()
   // }, [editable, eanTextFieldRef])
    useEffect(() => {
        console.log('so the ean is focused?', isEanFieldFocused)
    }, [isEanFieldFocused])




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
                                total_count_to_add_in_stock: parseInt(confirmedQuantity),
                            })}
                        >
                            Submit
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
                open={confirmModal}
                aria-labelledby="Quantity confirmation modal"
                aria-describedby="quantity-confirm-modal"
                sx={{
                    position: "absolute",
                    width: {xs:"100vw", md:"30vw"},
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
                        <Grid item xs={12} >
                            <Typography textAlign={"center"} id="new_invoice_modal" variant="h6" component="h2">
                                Cantitatea ramasa de receptionat pentru produsul scanat: {remainingQuantity}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{mb:2}}>
                            <Typography textAlign={"center"} id="new_invoice_modal" variant="h6" component="h2">
                                Confirmi cantitatea?
                            </Typography>
                        </Grid>
                        <Grid item xs={5} md={5}>
                            <TextField
                                label={"Cantitate"}
                                type="number"
                                sx={{...center}}
                                value={confirmedQuantity}
                                onChange={(e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>setConfirmedQuantity(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                        </Grid>

                        <Grid item xs={6} sx={{display: 'flex', justifyContent: "right"}}>
                            <Button variant="contained" type={"submit"} onClick={(e) => {
                                e.preventDefault();
                                addProductToInventory({
                                    ean_code: currentEAN,
                                    invoice_in_id: invoiceId,
                                    total_count_to_add_in_stock: parseInt(confirmedQuantity),
                                })
                                    .catch(e => {
                                        console.log("Error encountered while submitting product payload:", e)
                                        dispatch({type: "SET_SNACKBAR", payload: {state: true, message: "Error server", type: "error"}})
                                    })
                            }}>
                                Confirma
                            </Button>
                        </Grid>
                        <Grid item xs={6} sx={{display: 'flex', justifyContent: "left"}}>
                            <Button variant="contained" onClick={() => {
                                setConfirmModal(false)
                                setCurrentEAN("")
                                setRemainingQuantity(1)
                                setConfirmedQuantity("1")
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
