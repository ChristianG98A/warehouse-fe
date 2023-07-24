"use client"

import {StateContext} from "@/app/state/context";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {Alert, Box, Button, Divider, Grid, Modal, Snackbar, TextField, Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {callNextApi} from "@/helpers/apiMethods";
import {DataGrid, GridActionsCellItem, GridEventListener, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel} from "@mui/x-data-grid";
import CustomToolbar from "@/components/common/CustomToolbar";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';



const InvoiceEdit = () => {
    const [state, dispatch] = useContext(StateContext)
    const {register, handleSubmit} = useForm();
    const [productCart, setProductCart] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<string>();
    const [inputValue, setInputValue] = useState('');
    const [snackBar, setSnackBar] = useState<any>({state: false, message: "Succes!", type: "success"});
    const debounce = require('lodash.debounce');
    const [selectionModel, setSelectionModel] = useState<any>([0])
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };


    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar({...snackBar, state: false})
    };

    //!!!!!!!10
    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}});
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}});
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        return null;
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: {mode: GridRowModes.View, ignoreModifications: true},
        });
    }
    //

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


    useEffect(() => {
        state.currentInvoice ?? router.push('/receptie_marfa/comenzi_furnizori')
    }, [])

    useEffect(() => console.log("Checkbox Selected: ", selectionModel), [selectionModel])
    useEffect(() => console.log("Product basket: ", state?.productBasket), [state.productBasket])



    return (
        <>
            <Typography variant={"h6"} sx={{mb: 2}} gutterBottom >{"Lista note intrare-receptie id: " + state.currentInvoice}</ Typography>
            <PageBreadcrumbs
                items={[
                    {
                        name: "Receptie marfa",
                        path: "/receptie_marfa",
                    },
                    {
                        name: "Comenzi Furnizori",
                        path: "/comenzi_furnizori",
                    },
                    {
                        name: "Editare N.I.R.",
                        path: "/editare_nir",
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
                            rowSelection={true}
                            columnHeaderHeight={60}
                            checkboxSelection
                            rows={state.productBasket}
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
                                {
                                    field: 'actions',
                                    type: 'actions',
                                    headerName: 'Actions',
                                    width: 100,
                                    cellClassName: 'actions',
                                    getActions: ({id}) => {
                                        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                                        if (isInEditMode) {
                                            return [
                                                <GridActionsCellItem
                                                    icon={<SaveIcon />}
                                                    label="Save"
                                                    sx={{
                                                        color: 'primary.main',
                                                    }}
                                                    onClick={handleSaveClick(id)}
                                                />,
                                                <GridActionsCellItem
                                                    icon={<CancelIcon />}
                                                    label="Cancel"
                                                    className="textPrimary"
                                                    onClick={handleCancelClick(id)}
                                                    color="inherit"
                                                />,
                                            ];
                                        }

                                        return [
                                            <GridActionsCellItem
                                                icon={<EditIcon />}
                                                label="Edit"
                                                className="textPrimary"
                                                onClick={handleEditClick(id)}
                                                color="inherit"
                                            />,
                                            <GridActionsCellItem
                                                icon={<DeleteIcon />}
                                                label="Delete"
                                                onClick={handleDeleteClick(id)}
                                                color="inherit"
                                            />,
                                        ];
                                    },
                                },
                            ]}
                            rowSelectionModel={selectionModel}
                            autoPageSize={false}
                            loading={loading}
                            slots={{toolbar: CustomToolbar}}
                        />
                    </ Grid>

                    <Grid item xs={10} sm={10} md={10} lg={10} xl={10} >
                        <Button disabled={state.productBasket.length == 0} variant="contained" sx={{mt: 2}} onClick={async () => {
                            await callNextApi("POST", "purchase/addProduct", {
                                invoice_id: parseInt(state?.currentInvoice[0]),
                                products: state.productBasket.map((product: any) => {
                                    return ({
                                        "product_id": parseInt(product.id),
                                        "product_name": product.name,
                                        "acquisition_price": "125.99",
                                        "quantity": 222,
                                        "tax": "1.19"
                                    })
                                }),
                            })
                                .catch(e => {
                                    console.log("Error in submitting products: \n", e)
                                    setSnackBar({message: "Eroare!", type: "error", state: true})
                                })
                                .then(
                                    r => {
                                        dispatch({
                                            type: "RESET_PRODUCT_BASKET"
                                        })
                                        setProductCart(false)
                                        setSnackBar({type: "success", message: "Produse alocate cu succes!", state: true})
                                    }

                                )
                        }}>
                            Salveaza
                        </Button>
                    </Grid>
                </Grid>

                <Modal
                    open={state.productBasketModal}
                    aria-labelledby="Product Cart"
                    aria-describedby="Product-Cart-Modal"
                    sx={{
                        position: "absolute",
                        width: "80vw",
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
                                    editMode="row"

                                    rowModesModel={rowModesModel}
                                    onRowModesModelChange={handleRowModesModelChange}
                                    onRowEditStop={handleRowEditStop}

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
                                        try {
                                            dispatch({
                                                type: "SET_PRODUCT_BASKET", payload: state.productResult.find((productObject: any) => productObject.id == itemSelected
                                                )
                                            })
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
                </Modal>

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

export default InvoiceEdit;
