"use client"
import {StateContext} from "@/app/state/context";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {Grid, Paper, Typography} from "@mui/material";
import {DataGrid, GridRowsProp} from "@mui/x-data-grid";
import {useContext, useState} from "react";
import SellerInvoiceRow from "./SellerInvoiceRow";


const rows: GridRowsProp = [
    {id:1, crt: 1, Furnizor: "sc cacamaca", Serie_Factura: 12312313, invoiceNumber: 123132, date: "12.07.2023", product: "eau du saq", EAN: 523526, TVA: "19", discount: "0%", buy_price:909.9, nrceva:1324, deposit:"barbu v", sofer:"cutare"},
];


const ProviderOrders = ()=>{
    const [state, dispatch] = useContext(StateContext)
    const [loading, setLoading] = useState(false);

    return (
        <>
            <Typography variant={"h6"} sx={{mb: 2}} gutterBottom >Comenzi Furnizori</Typography>
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
                        <Grid component={Paper} container direction="column" justifySelf={"center"} justifyItems={"center"} style={{width: '100%', height: "50vh"}} >
                        <DataGrid
                        columnHeaderHeight={60}
                            //rows={useMemo(() => {return state.orders}, [state.orders])} //aici va veni Orders
                            rows={rows}
                            columns={SellerInvoiceRow()}
                            pageSizeOptions={[10, 25, 50]}
                            onRowSelectionModelChange={(newRowSelectionModel) => {
                                dispatch({type: "SET_SELECTION_MODEL", payload: newRowSelectionModel})
                            }}
                            rowSelectionModel={state.selectionModel}
                            autoPageSize={false}
                            loading={loading}
                        //    slots={{toolbar: GridToolbar}}
                        />
                </Grid>
        </>
    )
}


export default ProviderOrders;

