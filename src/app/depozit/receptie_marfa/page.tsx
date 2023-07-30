"use client"
import {Purchase} from "@/app/api/purchase/types/types";
import {StateContext} from "@/app/state/context";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Alert, Grid, Paper, Snackbar, SpeedDial, SpeedDialAction, SpeedDialIcon, Typography} from "@mui/material";
import {DataGrid, GridRowsProp, GridToolbar} from "@mui/x-data-grid";
import {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {PersonPinCircleSharp} from "@mui/icons-material";
import {useRouter} from "next/navigation";
import {grey} from "@mui/material/colors";
import ReceptionsColumns from "./ReceptionsColumns";

const rowsPlaceholder: GridRowsProp = [
    {id: 1, crt: 1, Furnizor: "sc cacamaca", Serie_Factura: 12312313, invoiceNumber: 123132, date: "12.07.2023", product: "eau du saq", EAN: 523526, TVA: "19", discount: "0%", buy_price: 909.9, nrceva: 1324, deposit: "barbu v", sofer: "cutare"},
];

const rows: GridRowsProp | Purchase[] = [
    {id: 1, invoice_number: 1, crt: 1, invoice_date: "12-12-2012", supplier_name: "sc caca srl", invoice_series: "123", },
];


const rowsPerPageOptions = [10, 20, 100];
const ProviderOrders = () => {
    const [state, dispatch] = useContext(StateContext)
    const [snackBar, setSnackBar] = useState<any>({state: false, message: "Succes!", type: "success"});
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
                console.log(r)
                dispatch({type: "SET_RECEPTIONS", payload: r?.response})
                setLoading(false)
            });
        return null;
    }

    useEffect(() => {
        //console.log("this is the context api state:\n", state);
        console.log('initial datafetch')
        getReceptions();
        setLoading(true);
    }, [paginationModel])


    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setNewInvoiceModal(false);
        //     dispatch({type: "SET_OPEN_ERROR_SNACK", payload: false})
    };

    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBar({...snackBar, state: false})
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
            <Grid component={Paper} container direction="column" justifySelf={"center"} justifyItems={"center"} style={{width: '100%', height: "60vh"}} >
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
                    slots={{toolbar: GridToolbar}}
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

            <SpeedDial
                ariaLabel="Reception Action"
                sx={{position: 'absolute', bottom: "1rem", right: "2rem"}}
                icon={<SpeedDialIcon />}
            >
                <SpeedDialAction
                    key={"item_reception"}
                    icon={<PersonPinCircleSharp />}
                    tooltipTitle={"Receptioneaza"}
                    onClick={() => {
                        if (state?.currentInvoice) {
                            router.push(`/depozit/receptie_marfa/receptie_comanda/${state.currentInvoice}`)
                        }
                        else {
                            setSnackBar({message: "Selecteaza o comanda!", type: "error", state: true})
                        }
                    }
                    }
                />
            </SpeedDial>

            <Snackbar
                anchorOrigin={{"horizontal": "center", "vertical": "bottom"}}
                open={snackBar.state}
                autoHideDuration={3000}
                onClose={handleSnackClose}
            >
                <Alert onClose={handleSnackClose} severity={snackBar.type}>{snackBar.message}</Alert>
            </Snackbar>
        </>
    )
}


export default ProviderOrders;

