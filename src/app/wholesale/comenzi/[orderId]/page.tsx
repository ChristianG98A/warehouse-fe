"use client"

import {StateContext} from "@/app/state/context";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Action, State} from "@/model/appstate/AppStateTypes";
import {OrderData} from "@/model/orders/OrderTypes";
import AddchartIcon from '@mui/icons-material/Addchart';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {Button, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, Paper, TextField, Typography} from "@mui/material";
import {green, grey, purple, red, yellow} from "@mui/material/colors";
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
    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState<OrderData>();
    const [pageSize, setPageSize] = useState<number>(rowsPerPageOptions[0]);
    const [notes, setNotes] = useState("");
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })


    useEffect(() => {
        setLoading(true)
        dispatch({type: "SET_LOADING", payload: true})
        if (!orderId) {
            router.push('/depozit/receptie_marfa')
        } else {
            setLoading(false);
            dispatch({type: "SET_LOADING", payload: false})
            getOrderDetails(orderId).then(r => {
                setOrderData(r.response)
                console.log("data", r)
            })
        }
    }, [])

    return (
        <>
            <Typography textAlign={'center'} variant={"h5"} fontWeight={800} sx={{mb: 2}} gutterBottom>Comanda
                nr. {orderId}</Typography>
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

            <Grid component={Paper} container sx={{padding: {sm: 0, md: 3}}}>
                <DataCard
                    loading={loading}
                    sx={{variant: 'h6', bgcolor: red[100]}}
                    avatar={<PersonIcon />}
                    title={"Detalii client"}
                    values={[
                        {name: 'Customer Name', value: orderData?.invoice_data[0].invoice_company},
                        {name: 'Company', value: orderData?.invoice_data[0].invoice_company},
                        {name: 'Email', value: orderData?.email},
                        {name: 'Phone', value: orderData?.phone},
                    ]}
                />

                <DataCard
                    loading={loading}
                    sx={{variant: 'h6', bgcolor: red[100]}}
                    avatar={<DescriptionIcon />}
                    title={"Detalii comanda"}
                    values={[
                        {name: 'OrderTypes Id', value: orderData?.order_id},
                        {name: 'OrderTypes Date & Time', value: "???"},
                        {name: 'OrderTypes Status', value: orderData?.status},
                        {name: 'WOrder Status', value: orderData?.whStatus},
                        {name: 'Grand Total (with TAX)', value: orderData?.totalWithVat},
                        {name: 'Payment Information', value: orderData?.payment_method},
                        {name: 'Packing Method', value: "De pus dropbox"},
                        {name: 'Client OrderTypes Number', value: "de pus textfield"},
                    ]}
                />

                <DataCard
                    loading={loading}
                    sx={{variant: 'h6', bgcolor: red[100]}}
                    avatar={<LocalShippingIcon />}
                    title={"Detalii livrare"}
                    values={[
                        {name: 'Depozit', value: "de pus dropbox"},
                        {name: 'Adresa', value: orderData?.delivery_data[0].delivery_address},
                        {name: 'Email', value: orderData?.email},
                        {name: 'Phone', value: orderData?.phone},

                    ]}
                />

                <Grid item xs={12} sm={6} md={4} sx={{padding: 2}}>
                    <Card sx={{height: "100%"}}>
                        <CardHeader
                            sx={{bgcolor: green[100]}}
                            title={"Adauga produse din XLS"}
                            avatar={<AddchartIcon />}
                            titleTypographyProps={{variant: 'h6'}}
                        />
                        <CardContent>
                            <Divider sx={{mb: 2}} />
                            {loading ? <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}><CircularProgress /></Grid> : (

                                <Grid container>
                                    <Grid item xs={12} sm={6}>
                                        <Typography>Excel File</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography>{"de pus dropbox"}</Typography>
                                    </Grid>
                                </Grid>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4} sx={{padding: 2}}>
                    <Card sx={{height: "100%"}}>
                        <CardHeader
                            sx={{bgcolor: yellow[100]}}
                            title={"Notes"}
                            avatar={<PostAddIcon />}
                            titleTypographyProps={{variant: 'h6'}}
                        />
                        <CardContent>
                            <Divider sx={{mb: 2}} />
                            {loading ? <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}><CircularProgress /></Grid> : (
                                <Grid container>
                                    <Grid item xs={12} >
                                    {/*aici vine notes din payload*/}
                                        <Typography textAlign={'center'}>{orderData?.order_notes}</Typography>
                                    </Grid>
                                    <Grid item xs={8} sm={9} >
                                    {/*aici textfield cu post pe endpoint*/}
                                        <TextField
                                          sx={{...center, pt:2}}
                                          value={notes}
                                          onChange={(event)=>setNotes(event.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={4} sm={3} sx={{display:'flex', justifyContent:'center'}} >
                                        <Button onClick={() => {
                                            callNextApi("POST", "orders/setOrderNotes", {
                                                "order_id": orderId,
                                                "order_notes": notes,
                                            })
                                        }}
                                            sx={{...center, mt:2}} variant="outlined" >Add</Button>
                                    </Grid>
                                </Grid>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <DataCard
                    loading={loading}
                    sx={{variant: 'h6', bgcolor: purple[100]}}
                    avatar={<PostAddIcon />}
                    title={"Detalii facturare"}
                    values={[
                        {name: 'Adresa', value: orderData?.invoice_data[0].invoice_address},
                        {name: 'Localitate', value: orderData?.invoice_data[0].invoice_state},
                        {name: 'Judet', value: orderData?.invoice_data[0].invoice_city},
                    ]}
                />
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{padding:2}}>
                    <DataGrid
                        rowSelection={true}
                        columnHeaderHeight={60}
                        rows={orderData?.orderProducts ?? []}
                        columns={OrderColumns()}
                        initialState={{pagination: {paginationModel: {pageSize: pageSize}}}}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[10, 25, 50]}
                        onRowSelectionModelChange={() => {
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
                            minHeight:"18rem",
                            '& .MuiDataGrid-row': {
                                backgroundColor: grey[200],
                            },
                        }}
                    />
                </Grid>
            </Grid>
        </>)
}
const center = {display:'flex', alignContent:'center'}
export default EditOrder;
