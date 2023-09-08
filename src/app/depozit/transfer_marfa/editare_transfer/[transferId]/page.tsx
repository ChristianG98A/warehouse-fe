"use client"

import {StateContext} from "@/app/state/context";
import CustomToolbar from "@/components/common/CustomToolbar";
import {callNextApi} from "@/helpers/apiMethods";
import {Action, State} from "@/model/appstate/AppStateTypes";
import {ProductInGetTransfer, TransferData, TransferProductInBasket} from "@/model/transfers/TransferTypes";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Alert, Box, Button, colors, Divider, Drawer, Grid, Snackbar, Tab, TextField, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import {DataGrid} from "@mui/x-data-grid";
import {useContext, useEffect, useMemo, useState} from "react";
import PackingTab from "./PackingTab";
import PickingTab from "./PickingTab";
import {handleSubmitProducts} from "./service";
import TransferProductResultColumns from "./TransferProductResultColumns";


const disabledButtonStyle = {
    '& .MuiInputBase-root.Mui-disabled': {
        color: colors.common
    }
}


const TransferEdit = ({params}: {params: {transferId: string}}) => {
    const [state, dispatch]: [State, Action] = useContext(StateContext)
    const [tab, setTab] = useState<string>('products')
    const [loading, setLoading] = useState(false);
    const debounce = require('lodash.debounce');
    const [selectionModel, setSelectionModel] = useState<any>([0])
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })
    const [transferData, setTransferData] = useState<TransferData>();
    const [ean, setEan] = useState("");


    const transferId = parseInt(params.transferId)

    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch({type:"SET_SNACKBAR", payload:{...state.snackBar, state:false}})
    };

    const handleRowUpdate = (newRow:TransferProductInBasket, oldRow:TransferProductInBasket) => {
        //console.log("This goes into product basket! :", data)
        //const index = state?.transferProductBasket?.findIndex((item: any) => item.id === data.id);
        //console.log("New row data: ", data, index)
        dispatch({type: "SET_TRANSFER_PRODUCT_BASKET", payload: newRow})
        return newRow;
    }
    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => setTab(newValue);

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


    const getTransfer = async () => {
        await callNextApi("POST", "transfers/getTransfer", {transfer_id: transferId})
            .then(r => {
                console.log('the result is:', r)
                setTransferData(r.response)
                if (r?.response.transferProducts?.length > 0) {

                    r?.response?.transferProducts?.forEach((productResult: ProductInGetTransfer) => {
                        dispatch({
                            type: "SET_TRANSFER_PRODUCT_BASKET",
                            payload: {
                                ...productResult,
                                id: productResult?.product_id,
                                quantity: parseInt(productResult?.quantity)
                            }
                        })
                    })
                }
            })
    }


    useEffect(() => console.log('Transfer products basket', state?.transferProductBasket), [state.transferProductBasket])
    useEffect(() => console.log("ean:", ean), [ean])

    //initial data fetch
    useEffect(() => {
        setLoading(true)
        dispatch({type:'RESET_TRANSFER_PRODUCT_BASKET'})
        getTransfer()
            .finally(() => setLoading(false))
        return () => {
            console.log('unmounting!')
        }
    }, [])




    return (
        <>
            <Typography variant={"h5"} fontWeight={800} sx={{mb: 2}} textAlign='center' gutterBottom >{"Transfer " + transferId}</ Typography>
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
                                        {field: 'quantity', headerName: 'Cantitate', flex: 2, editable: true, type: "number"},

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
                                <Button disabled={state.transferProductBasket.length == 0} variant="contained" sx={{mt: 2}} onClick={()=>{
                                    setLoading(true)
                                    handleSubmitProducts(transferId, state?.transferProductBasket)
                                        .catch(e => {
                                            dispatch({type:'SET_SNACKBAR', payload:{message: "Eroare!", type: "error", state: true}})
                                        })
                                        .then(r => {

                                            dispatch({type:'SET_SNACKBAR', payload:{type: "success", message: "Produse alocate cu succes!", state: true}})
                                            dispatch({type: "RESET_TRANSFER_PRODUCT_BASKET"});
                                            getTransfer();
                                        })
                                        .finally(() => setLoading(false))
                                }}>
                                    Salveaza
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </TabPanel>


                <TabPanel value="picking">
                    <PickingTab transferId={transferId}/>
                </TabPanel>

                <TabPanel value="packing">
                    <PackingTab transferId={transferId} />
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
                                                        id: productToBeAdded?.id,
                                                        product_id:productToBeAdded?.id,
                                                        product_name:productToBeAdded?.name,
                                                        quantity:0,
                                                    }
                                            })
                                        }
                                    dispatch({type:"SET_SNACKBAR", payload:{message: "Produse adaugate in cos!", type: 'success', state: true}})
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
