"use client"

import {Product} from "@/app/api/purchase/types/types";
import {StateContext} from "@/app/state/context";
import WholesaleDatagridFooter from "@/app/wholesale/comenzi/WholesaleDatagridFooter";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Action, State} from "@/model/appstate/AppStateTypes";
import {ProductQueryAction, ProductQueryState} from "@/model/products/ProductsTypes";
import {Button, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import {DataGrid, GridRowSelectionModel} from "@mui/x-data-grid";
import {useRouter} from "next/navigation";
import {useContext, useEffect, useReducer, useState} from "react";
import ProductColumns from "./ProductColumns";

const queryReducer = (state:ProductQueryState | any, action:ProductQueryAction | any)=>{
        switch(action.type){
                case "cacamaca":
                    return {...state, cacamaca:action.payload}
            }

    }

const ProductList = () => {
    const [state, dispatch]:[State, Action] = useContext(StateContext);
    const [queryState, queryDispatch] = useReducer(queryReducer, {})
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })



    const getProducts = async () => {
        await callNextApi('POST', "products/getProductsList", {limit:state?.wholesaleOffset, offset:0})
            .then((r: any) => {
                setProducts(r.response?? []);
            })
    }

    const handleRowSelectionModelChange = (newRowSelectionModel: GridRowSelectionModel) => {
        dispatch({type: "SET_SELECTION_MODEL", payload: newRowSelectionModel})
    }

    useEffect(()=>console.log(state.wholesaleOffset), [state.wholesaleOffset]);
    // Initial Data Fetch
    useEffect(() => {
        setLoading(true)
        getProducts().then(r=>setLoading(false));
    }, [state?.wholesaleOffset])

    return (
        <>
            <PageBreadcrumbs
                items={[
                    {
                        name: "Produse",
                        path: "/produse",
                    },
                    {
                        name: "Lista Produse",
                        path: "/produse/lista_produse",
                    },
                ]}
            />
            <Grid container >

                <Grid item xs={12} >
                    <Typography textAlign={'center'} variant={"h5"} fontWeight={800}  gutterBottom >Lista produse</Typography>
                </Grid>
                <Grid item xs={12} p={4}>
                    <Divider  />
                </Grid>
            </Grid>

                <DataGrid
                    rowSelection={true}
                    columnHeaderHeight={60}
                    autoHeight={true}
                    rows={products ?? []}
                    columns={ProductColumns()}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{pagination: {paginationModel: paginationModel}}}
                    onPaginationModelChange={setPaginationModel}
                    onRowSelectionModelChange={handleRowSelectionModelChange}
                    rowSelectionModel={state.selectionModel}
                    autoPageSize={false}
                    loading={loading}
                    getRowSpacing={params => ({
                        top: params.isFirstVisible ? 0 : 5,
                        bottom: params.isLastVisible ? 0 : 5
                    })}
                    onRowClick={row=>router.push(`lista_produse/${row.id?.toString()}`)}
                    slots={{
                        pagination: WholesaleDatagridFooter
                    }}
                    sx={{
                        '& .MuiDataGrid-row': {
                            backgroundColor: grey[200],
                        },
                    }}
                />

        </>
    )
}
const center = {display:"flex", justifyContent:'center'}
export default ProductList;
