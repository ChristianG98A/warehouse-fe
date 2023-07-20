"use client"
import {Purchase} from "@/app/api/purchase/types/types";
import {StateContext} from "@/app/state/context";
import CustomToolbar from "@/components/common/CustomToolbar";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Grid, Paper, Typography} from "@mui/material";
import {DataGrid, GridRowsProp} from "@mui/x-data-grid";
import {useContext, useEffect, useState} from "react";
import SellerInvoiceRow from "./SellerInvoiceRow";

const rowsPlaceholder: GridRowsProp = [
    {id: 1, crt: 1, Furnizor: "sc cacamaca", Serie_Factura: 12312313, invoiceNumber: 123132, date: "12.07.2023", product: "eau du saq", EAN: 523526, TVA: "19", discount: "0%", buy_price: 909.9, nrceva: 1324, deposit: "barbu v", sofer: "cutare"},
];

const rows: GridRowsProp | Purchase[]= [
    {id: 1, invoice_number: 1, crt: 1, invoice_date: "12-12-2012", supplier_name: "sc caca srl", invoice_series: "123", },
];


const rowsPerPageOptions = [10, 20, 100];
const ProviderOrders = () => {
    const [state, dispatch] = useContext(StateContext)
    console.log(state)
    const [pageSize, setPageSize] = useState<number>(rowsPerPageOptions[0]);
    const [loading, setLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })

    useEffect(() => {
        //console.log("this is the context api state:\n", state);
        console.log('initial datafetch')
        setLoading(true);
        callNextApi("POST", "purchase/purchaseList", {limit: paginationModel.pageSize, offset: 0}).catch(e => console.log("Error caught in calling proxy api!\n", e))
            .then((r:any) => {
                console.log(r)
                dispatch({type: "SET_INVOICES", payload: r.response})
                setLoading(false)
            });
    }, [paginationModel])

    useEffect(()=>{
            console.log(state)
        }, [state.invoices])


    return (
        <>
            <Typography variant={"h6"} sx={{mb: 2}} gutterBottom >Lista note intrare-receptie</Typography>
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
                ]}
            />
            <Grid component={Paper} container direction="column" justifySelf={"center"} justifyItems={"center"} style={{width: '100%', height: "60vh"}} >
                <DataGrid
                    rowSelection={false}
                    columnHeaderHeight={60}
                    //rows={useMemo(() => {return state.orders}, [state.orders])} //aici va veni Orders
                    rows={state.invoices}
                    columns={SellerInvoiceRow()}
                    initialState={{pagination: {paginationModel: {pageSize: pageSize}}}}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50]}
                    //onRowSelectionModelChange={(newRowSelectionModel) => {
                    //    dispatch({type: "SET_SELECTION_MODEL", payload: newRowSelectionModel})
                    //}}
                    //rowSelectionModel={state.selectionModel}
                    autoPageSize={false}
                    loading={loading}
                    slots={{toolbar: CustomToolbar}}
                //    slots={{toolbar: GridToolbar}}
                />
            </Grid>
        </>
    )
}


export default ProviderOrders;

