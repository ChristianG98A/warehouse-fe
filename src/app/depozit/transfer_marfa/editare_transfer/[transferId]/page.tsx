"use client"

import {editInvoiceReducer} from "@/app/achizitii/comenzi_furnizori/editare_nir/editInvoiceState";
import {StateContext} from "@/app/state/context";
import CustomToolbar from "@/components/common/CustomToolbar";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Action, State} from "@/model/appstate/AppStateTypes";
import {PickingBox} from "@/model/pickpack/PickpackTypes";
import {TransferData, TransferProductInBasket, TransferProductInList} from "@/model/transfers/TransferTypes";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Alert, Box, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, colors, Divider, Drawer, Grid, Paper, Snackbar, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import {DataGrid} from "@mui/x-data-grid";
import dayjs from "dayjs";
import {useRouter} from "next/navigation";
import {useContext, useEffect, useMemo, useReducer, useState} from "react";
import useScanDetection from "use-scan-detection";
import BoxCard from "./BoxCard";
import TransferProductResultColumns from "./TransferProductResultColumns";


const disabledButtonStyle = {
    '& .MuiInputBase-root.Mui-disabled': {
        color: colors.common
    }
}


const TransferEdit = ({params}: {params: {transferId: string}}) => {
    const [state, dispatch]: [State, Action] = useContext(StateContext)
    const [tab, setTab] = useState<string>('products')
    const [transferProductsList, setTransferProductsList] = useState<TransferProductInList[]>();
    const [loading, setLoading] = useState(false);
    const [snackBar, setSnackBar] = useState<any>({state: false, message: "Succes!", type: "success"});
    const debounce = require('lodash.debounce');
    const [selectionModel, setSelectionModel] = useState<any>([0])
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })
    const [transferData, setTransferData] = useState<TransferData>();
    const [boxes, setBoxes] = useState<PickingBox[]>();
    const [ean, setEan] = useState("");


    const transferId = parseInt(params.transferId)

    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch({type:"SET_SNACKBAR", payload:{...state.snackBar, state:false}})
    };

    const handleRowUpdate = (data: any) => {
        //console.log("This goes into product basket! :", data)
        const index = state?.transferProductBasket?.findIndex((item: any) => item.id === data.id);
        //console.log("New row data: ", data, index)
        dispatch({type: "SET_TRANSFER_PRODUCT_BASKET", payload: data})
    }
    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => setTab(newValue);

    const handleSubmitProducts = async () => {
        setLoading(true)
        await callNextApi("POST", "transfers/addProduct", {
            transfer_id: transferId,
            products: state?.transferProductBasket?.map((product: any) => {
                return ({
                    product_id: parseInt(product.id),
                    product_name: product.product_name,
                    quantity: typeof(product.total_quantity) == 'string' ?parseInt(product.total_quantity): product.total_quantity,
                })
            }),
        })
            .catch(e => {
                console.log("Error in submitting products: \n", e)
                setSnackBar({message: "Eroare!", type: "error", state: true})
            })
            .then(
                () => {
                    setLoading(false)
                    //getInvoiceProducts(invoiceId).then(r => setLoading(false))
                    //setProductCart(false)
                    dispatch({type: "RESET_TRANSFER_PRODUCT_BASKET"});
                    getTransferProductList();
                    setSnackBar({type: "success", message: "Produse alocate cu succes!", state: true});
                }
            )
    }

    const handleSearch = debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        if (input?.length >= 3) {
            setLoading(true)

            await callNextApi("POST", "transfers/searchProduct", {
                searchterm: input,
                old_warehouse_id: transferData?.old_warehouse,
            })
                .catch(e => console.log("Error searching for product: ", e))
                .then((r: any) => {
                    console.log(r?.response)
                    let id_key = 1
                    const result = r?.response.map((product: {id: string, name: string, model: string}) => ({crt: id_key++, ...product}))
                    console.log("resuuult:\n", result);

                    dispatch({type: "SET_TRANSFER_PRODUCT_RESULT", payload: result})
                }).finally(() => setLoading(false))
        }
    }, 1000)

    const getTransferProductList = async () => {
        await callNextApi("POST", "transfers/getTransferProductsList", {transfer_id: transferId})
            .then(r => {
                console.log('transfer products:', r?.response)
                setTransferProductsList(r?.response)
                r?.response?.forEach((productResult: TransferProductInList) => {
                    dispatch({
                        type: "SET_TRANSFER_PRODUCT_BASKET",
                        payload: {
                            id: parseInt(productResult.product_id),
                            ...productResult
                        }
                    })
                })
            })
    }

    const getTransfer = async () => {
        await callNextApi("POST", "transfers/getTransfer", {transfer_id: transferId})
            .then(r => {
                console.log('the result is:', r)
                setTransferData(r.response)
            })
    }

    const getBoxes = async () => {
        await callNextApi("POST", "pickpack/getBoxes", {transfer_id: transferId})
            .then(r => {
                setBoxes(r.response)
            })
    }

    const addBox = async () => {
        await callNextApi("POST", "pickpack/addBox", {transfer_id: transferId})
            .then(r => {
                getBoxes();
            })
    }
    const deleteBox = async ()=>{
        await callNextApi("POST", "pickpack/deleteBox", {box_id: parseInt(state.selectedBox)})
            .then(() => {
                dispatch({type:"SET_SNACKBAR", payload:{type:'success', state:true, message:`Cutia ${state.selectedBox} stearsa cu succes`}})
                getBoxes();
            })
        }
    let eanCode= ""
    const resetInput = debounce(()=>eanCode="", 300)
    const handleKeydown = (event:any)=>{
            if (event.key === 'Enter') {
                event.preventDefault();
                console.log('submitting ', eanCode)
                eanCode=""
            } else {
                eanCode+= event.key
                console.log(eanCode)
            }
            resetInput()
        }

    useEffect(() => console.log('Transfer products basket', state?.transferProductBasket), [state.transferProductBasket])
    useEffect(() => console.log("ean:", ean), [ean])
    //initial data fetch
    useEffect(() => {
        setLoading(true)
        document.addEventListener('keydown', handleKeydown);
        dispatch({type:'RESET_TRANSFER_PRODUCT_BASKET'})
        getTransfer().then(r => {
            getTransferProductList()
            getBoxes()
        })
            .finally(() => setLoading(false))

    }, [])

    useEffect(() => {
        console.log('cutie selectata', state.selectedBox);
    }, [state.selectedBox])




    return (
        <>
            <Typography variant={"h5"} fontWeight={800} sx={{mb: 2}} textAlign='center' gutterBottom >{"Transfer " + transferId}</ Typography>
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
            <TabContext value={tab}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                        <Tab label="Produse" value="products" />
                        <Tab label="Picking" value="picking" />
                        <Tab label="Packing" value="packing" />
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
                                <Typography variant={"h6"} sx={{mb: 2}} gutterBottom >{`Produse alocate in transfer ${transferId}`}</ Typography>
                            </Grid>
                            <Grid item xs={10} sm={10} md={10} lg={10} xl={10} sx={{width: "80%"}}>
                                <DataGrid
                                    rowSelection={false}
                                    columnHeaderHeight={60}
                                    rows={state?.transferProductBasket}
                                    pageSizeOptions={[10, 25, 50]}
                                    initialState={{pagination: {paginationModel: paginationModel}}}
                                    onPaginationModelChange={setPaginationModel}
                                    onRowSelectionModelChange={(newRowSelectionModel) => {
                                        setSelectionModel(newRowSelectionModel)
                                    }}
                                    columns={useMemo(() => ([
                                        {field: 'product_id', headerName: 'ID Produs', flex: 2},
                                        {field: 'product_name', headerName: 'Denumire Produs', flex: 4},
                                        {field: 'total_quantity', headerName: 'Cantitate', flex: 2, editable: true, type: "number"},

                                    ]), [])}

                                    getRowSpacing={params => ({
                                        top: params.isFirstVisible ? 0 : 5,
                                        bottom: params.isLastVisible ? 0 : 5
                                    })}
                                    sx={{
                                        minHeight:"27rem",
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

                                    editMode="row"
                                />
                            </ Grid>

                            <Grid item xs={10} sm={10} md={10} lg={10} xl={10} >
                                <Button disabled={state.transferProductBasket.length == 0} variant="contained" sx={{mt: 2}} onClick={handleSubmitProducts}>
                                    Salveaza
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </TabPanel>


                <TabPanel value="picking">
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 450}} aria-label="invoice data table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Row ID</TableCell>
                                    <TableCell align="center">Product ID</TableCell>
                                    <TableCell align="center">Name</TableCell>
                                    <TableCell align="center">Total</TableCell>
                                    <TableCell align="center">Picked</TableCell>
                                    <TableCell align="center">Not Picked</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {transferProductsList?.map(product=>(
                                        <TableRow key={product.row_id}>
                                            <TableCell component="th" scope="row" align="center">{product.row_id}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{product.product_id}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{product.product_name}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{product.total_quantity}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{product.picked_quantity}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{product.not_picked_quantity}</TableCell>
                                        </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>






                <TabPanel value="packing">
                    <Grid container component={Paper} elevation={5} sx={{justifyContent: "center", minHeight: "40rem"}}>
                        <Grid item xs={4}>
                            <Grid container >
                                <Grid item xs={12}>
                                {boxes?.map(box=><BoxCard  onClick={()=>null} key={box.id} id={box.id} title={`Box ${box.id}`} />)}
                                </Grid>
                                <div style={{marginTop: '40rem'}} />
                                <Grid item xs={6} alignItems={center} sx={{mt: 2, mb: 2}}><Button onClick={addBox} variant={'outlined'} >Add box</Button></Grid>
                                <Grid item xs={6} alignItems={center} sx={{mt: 2, mb: 2}} ><Button onClick={deleteBox} variant={'outlined'} >Remove box</Button></Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={8}>
                            <DataGrid columns={[]} rows={[]} />
                        </Grid>
                    </Grid>
                </TabPanel>
            </TabContext>




            <Drawer
                anchor={"top"}
                open={state.productBasketModal}
                onClose={() => dispatch({type: 'SET_PRODUCT_BASKET_MODAL', payload: true})}
                aria-labelledby="Product Cart"
                aria-describedby="Product-Cart-Modal"
            >
                <Box sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 14,
                    p: 4,
                }}>
                    <Typography textAlign={"center"} id="pickProductsModal" variant="h6" component="h2">
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
                                rows={state?.transferProductResult ?? []}
                                pageSizeOptions={[10, 25, 50]}
                                initialState={{pagination: {paginationModel: paginationModel}}}
                                onPaginationModelChange={setPaginationModel}
                                onRowSelectionModelChange={(newRowSelectionModel) => {
                                    setSelectionModel(newRowSelectionModel)
                                }}
                                columns={TransferProductResultColumns()}
                                rowSelectionModel={selectionModel}
                                autoPageSize={false}
                                loading={loading}
                                sx={{minHeight: "30vh", maxHeight: "50vh"}}
                            />
                        </ Grid>


                        <Grid item xs={10} sm={10} md={10} lg={10} xl={10} alignItems={"center"} justifyItems={"center"} justifyContent={"center"} >
                            <Divider sx={{mt: 3, mb: 3}} />

                            <Button disabled={selectionModel?.length == 0} variant="contained" onClick={() => {

                                selectionModel?.forEach((itemSelected:string) => {
                                    //console.log('item selectat: ', itemSelected)
                                    const checkIfProductIsInSelection = (id: any) => {
                                        return state.transferProductBasket.some((selectedProduct: TransferProductInBasket) => selectedProduct.product_id == id)
                                    }
                                    //console.log("is product in selection?", checkIfProductIsInSelection(itemSelected));
                                    try {
                                        if (!checkIfProductIsInSelection(itemSelected)) {
                                            const productToBeAdded:any = state.transferProductResult.find((productObject) => productObject.id == itemSelected)
                                            dispatch({
                                                type: "SET_TRANSFER_PRODUCT_BASKET",
                                                payload: {
                                                        id: parseInt(productToBeAdded?.id),
                                                        product_id:productToBeAdded?.id,
                                                        product_name:productToBeAdded?.name,
                                                        total_quantity:"0",
                                                    }
                                            })
                                        }
                                    setSnackBar({message: "Produse adaugate in cos!", type: 'success', state: true})
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
