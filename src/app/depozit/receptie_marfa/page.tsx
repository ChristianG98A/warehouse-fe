"use client"
import {Purchase} from "@/app/api/purchase/types/types";
import {StateContext} from "@/app/state/context";
import {Action, State} from "@/app/state/types/stateTypes";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {PersonPinCircleSharp} from "@mui/icons-material";
import {Alert, Grid, Paper, Snackbar, SpeedDial, SpeedDialAction, SpeedDialIcon, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import {DataGrid, GridRowsProp, GridToolbar} from "@mui/x-data-grid";
import {useRouter} from "next/navigation";
import {useContext, useEffect, useState} from "react";
import ReceptionGridToolbar from "./ReceptionGridToolbar";
import ReceptionsColumns from "./ReceptionsColumns";

const rowsPlaceholder: GridRowsProp = [
    {id: 1, crt: 1, Furnizor: "sc cacamaca", Serie_Factura: 12312313, invoiceNumber: 123132, date: "12.07.2023", product: "eau du saq", EAN: 523526, TVA: "19", discount: "0%", buy_price: 909.9, nrceva: 1324, deposit: "barbu v", sofer: "cutare"},
];

const rows: GridRowsProp | Purchase[] = [
    {id: 1, invoice_number: 1, crt: 1, invoice_date: "12-12-2012", supplier_name: "sc caca srl", invoice_series: "123", },
];


const rowsPerPageOptions = [10, 20, 100];
const ProviderOrders = () => {
    const [state, dispatch] : [State, Action] = useContext(StateContext)
    const [newInvoiceModal, setNewInvoiceModal] = useState(false);
    const [pageSize, setPageSize] = useState<number>(rowsPerPageOptions[0]);
    const [loading, setLoading] = useState(false);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })
    const router = useRouter();


    // Initial Data Fetch

    const getReceptions = async () => {
        setLoading(true)
        await callNextApi("POST", "inventory/getReceptionsList", {limit: 300, offset: 0}).catch(e => console.log("Error caught in calling proxy api!\n", e))
            .then((r: any) => {
                console.log("RECEPTIONSSS! ", r)
                dispatch({type: "SET_RECEPTIONS", payload: r?.response})
                setLoading(false)
            });
        return null;
    }

    useEffect(() => {
        //console.log("this is the context api state:\n", state);
        //console.log('initial datafetch')
        dispatch({type: "SET_CURRENT_INVOICE", payload: null})
        getReceptions();
        setLoading(true);
    }, [paginationModel])

    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch({type:"SET_SNACKBAR", payload:{...state.snackBar, state:false}})

    };

    return (
        <>
            <Typography textAlign={'center'} variant={"h5"} fontWeight={800} sx={{mb: 2}} gutterBottom >Receptie Marfa</Typography>
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
                ]}
            />
            <Grid component={Paper} container justifySelf={"center"} justifyItems={"center"} style={{height: "60vh"}} >
                <DataGrid
                    rowSelection={true}
                    columnHeaderHeight={60}
                    rows={state.receptions ?? []}
                    columns={ReceptionsColumns()}
                    initialState={{pagination: {paginationModel: {pageSize: pageSize}}}}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50]}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        dispatch({type: "SET_CURRENT_INVOICE", payload: newRowSelectionModel})
                    }}
                    rowSelectionModel={state.selectionModel}
                    autoPageSize={false}
                    loading={loading}
                    // slots={{toolbar: CustomToolbar}}
                    slots={{toolbar: ReceptionGridToolbar}}
                    getRowSpacing={params => ({
                        top: params.isFirstVisible ? 0 : 5,
                        bottom: params.isLastVisible ? 0 : 5
                    })}
                    sx={{
                        minHeight:"55vh",
                        '& .MuiDataGrid-row': {
                            backgroundColor: grey[200],
                        },
                    }}
                />
            </Grid>


            <Snackbar
                anchorOrigin={{"horizontal": "center", "vertical": "bottom"}}
                open={state.snackBar?.state}
                autoHideDuration={3000}
                onClose={handleSnackClose}
            >
                <Alert onClose={handleSnackClose} severity={state?.snackBar?.type}>{state?.snackBar?.message}</Alert>
            </Snackbar>
        </>
    )
}


export default ProviderOrders;

