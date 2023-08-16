"use client"
import {StateContext} from "@/app/state/context";
import {Action, State} from "@/app/state/types/stateTypes";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {OrderData} from "@/components/types/Order";
import {Card, CardContent, Divider, Grid, Paper, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import {DataGrid} from "@mui/x-data-grid";
import {useRouter} from "next/navigation";
import {useContext, useEffect, useState} from "react";
import DataCard from "./DataCard";
import getOrderDetails from "./helpers";
import OrderColumns from "./OrderColumns";



const rowsPerPageOptions = [10, 20, 100];
const EditOrder = ({params}: {params: {orderId: string}}) => {
    const [state, dispatch]: [State, Action] = useContext(StateContext);
    const router = useRouter();
    const orderId = parseInt(params.orderId);
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState<OrderData>();
    const [pageSize, setPageSize] = useState<number>(rowsPerPageOptions[0]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })


    useEffect(() => {
        setLoading(true)
        if (!orderId) {
            router.push('/depozit/receptie_marfa')
        } else {
            setLoading(false);
            getOrderDetails(orderId).then(r => setOrderData(r.response))
        }
    }, [])

    return (
        <>
            <Typography textAlign={'center'} variant={"h5"} fontWeight={800} sx={{mb: 2}} gutterBottom >Comanda nr. {orderId}</Typography>
            <PageBreadcrumbs
                items={[
                    {
                        name: "Wholesale",
                        path: "#",
                    },
                    {
                        name: "Comenzi",
                        path: "/wholesale/comenzi",
                    },
                    {
                        name: `Editare comanda nr. ${orderId}`,
                        path: `/wholesale/comenzi/${orderId}`,
                    },
                ]}
            />

            <Grid component={Paper} container sx={{padding: 3}}>
                <Grid item xs={12} sm={4} sx={{padding:2}}>
                    <Card sx={{height:"100%"}}>
                        <CardContent>
                            <Typography variant="h5" sx={{mb: 1}}>Detalii client</Typography>
                            <Divider sx={{mb: 1}} />

                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Customer Name</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{orderData?.invoice_data[0].invoice_company}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Company</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{orderData?.invoice_data[0].invoice_company}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Email</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{orderData?.email}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Phone</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{orderData?.phone}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4} sx={{padding:2}} >
                    <Card sx={{height:"100%"}}>
                        <CardContent>
                            <Typography variant="h5" sx={{mb: 1}}>Detalii comanda</Typography>
                            <Divider sx={{mb: 1}} />

                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Order Id</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{orderData?.order_id}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Order Date & Time</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{"???"}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Order Status</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{orderData?.status}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>WOrder Status</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{orderData?.whStatus}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Grand Total (with TAX)</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{orderData?.totalWithVat}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Payment Information</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{orderData?.payment_method}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Packing Method</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{"De pus dropbox"}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Client Order Number</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{"De pus textfield"}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4} sx={{padding:2}} >
                    <Card sx={{height:"100%"}}>
                        <CardContent>
                            <Typography variant="h5" sx={{mb: 1}}>Detalii livrare</Typography>
                            <Divider sx={{mb: 1}} />

                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Depozit</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{"de pus dropbox"}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Adresa</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{orderData?.delivery_data[0].delivery_address}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Email</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{orderData?.email}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Phone</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{orderData?.phone}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4} sx={{padding:2}} >
                    <Card sx={{height:"100%"}}>
                        <CardContent>
                            <Typography variant="h5" sx={{mb: 1}}>Adauga produse din XLS</Typography>
                            <Divider sx={{mb: 1}} />

                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Excel File</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{"de pus dropbox"}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4} sx={{padding:2}} >
                    <Card sx={{height:"100%"}}>
                        <CardContent>
                            <Typography variant="h5" sx={{mb: 1}}>Notes</Typography>
                            <Divider sx={{mb: 1}} />

                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <Typography>De aduagat textfield + buton</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{"..."}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4} sx={{padding:2}} >
                    <Card sx={{height:"100%"}}>
                        <CardContent>
                            <Typography variant="h5" sx={{mb: 1}}>Detalii facturare</Typography>
                            <Divider sx={{mb: 1}} />

                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Adresa</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{orderData?.invoice_data[0].invoice_address}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Localitate</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{orderData?.invoice_data[0].invoice_state}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>Judet</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography>{orderData?.invoice_data[0].invoice_city}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
                <DataGrid
                    rowSelection={true}
                    columnHeaderHeight={60}
                    rows={orderData?.orderProducts ?? []}
                    columns={OrderColumns()}
                    initialState={{pagination: {paginationModel: {pageSize: pageSize}}}}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50]}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        //dispatch({type: "SET_CURRENT_INVOICE", payload: newRowSelectionModel})
                    }}
                    rowSelectionModel={state.selectionModel}
                    autoPageSize={false}
                    loading={loading}
                    // slots={{toolbar: CustomToolbar}}
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
        </>)
}

export default EditOrder;
