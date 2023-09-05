'use client'

import {StateContext} from "@/app/state/context";
import WholesaleDatagridFooter from "@/app/wholesale/comenzi/WholesaleDatagridFooter";
import GridColumns from "@/components/common/GridColumns";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {ProductStockLine} from "@/model/products/ProductsTypes";
import {Grid, Paper} from "@mui/material";
import {grey} from "@mui/material/colors";
import {DataGrid, GridRowSelectionModel} from "@mui/x-data-grid";
import {useParams} from "next/navigation";
import {useContext, useEffect, useState} from "react";
import {getStockLines} from "./service";
import StockGridColumns from "./StockGridColumnx";


const rowsPerPageOptions = [10, 20, 100];
const StockPerUnit = (params:{productId:number})=>{
    const [pageSize, setPageSize] = useState<number>(rowsPerPageOptions[0]);
    const [state, dispatch] = useContext(StateContext);
    const [loading, setLoading] = useState(false);
    const [stockRows, setStockRows] = useState<ProductStockLine[]>([]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })
    const {productId} = useParams()
    console.log(productId) // bingoo


    const handleRowSelectionModelChange = (newRowSelectionModel: GridRowSelectionModel) => {
        dispatch({type: "SET_SELECTION_MODEL", payload: newRowSelectionModel})
    }

        useEffect(()=>{
                setLoading(true)

                getStockLines(parseInt(productId)).then(r=>{
                        setStockRows(r?.response)
                        setLoading(false);
                    })
            }, [])

        useEffect(()=>{
                console.log('stock rows' , stockRows)
            }, [stockRows])

        return(
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
                    {
                        name: `Editare ${state?.productEdit?.product_name}`,
                        path: `/produse/lista_produse/${productId}`,
                    },
                    {
                        name: "Stock Unitar",
                        path: `/produse/lista_produse/${productId}/stock_unitar`,
                    },

                ]}
            />
            <Grid container component={Paper }>
                <Grid item xs={12}>
                    <DataGrid
                        rows={stockRows?.length > 0 ? stockRows : []}
                        columns={StockGridColumns()}
                        paginationModel={paginationModel}
                        initialState={{pagination: {paginationModel: {pageSize: pageSize}}}}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[10, 25, 50]}
                        onRowSelectionModelChange={handleRowSelectionModelChange}
                        rowSelectionModel={state.selectionModel}
                        autoPageSize={false}
                        loading={loading}
                        slots={{
                            pagination: WholesaleDatagridFooter
                        }}
                         sx={{
                             width:'85vw',
                             minHeight:'30rem'

                             }}
                    />
                </Grid>
            </Grid>
        </>
    )
}
export default StockPerUnit;
