'use client'

import {StateContext} from "@/app/state/context";
import WholesaleDatagridFooter from "@/app/wholesale/comenzi/WholesaleDatagridFooter";
import GridColumns from "@/components/common/GridColumns";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {Action, State} from "@/model/appstate/AppStateTypes";
import {ProductStockLine} from "@/model/products/ProductsTypes";
import {Alert, Grid, LinearProgress, Paper, Snackbar, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import {DataGrid, GridRowSelectionModel} from "@mui/x-data-grid";
import {useParams} from "next/navigation";
import {useContext, useEffect, useState} from "react";
import {getStockLines, setEan} from "./service";
import StockGridColumns from "./StockGridColumnx";


const rowsPerPageOptions = [10, 20, 100];
const StockPerUnit = (params: {productId: number}) => {
    const [pageSize, setPageSize] = useState<number>(rowsPerPageOptions[0]);
    const [state, dispatch]: [State, Action] = useContext(StateContext);
    const [loading, setLoading] = useState(false);
    const [stockRows, setStockRows] = useState<ProductStockLine[]>([]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })
    const {productId} = useParams()
    console.log(productId) // bingoo


    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch({type: "SET_SNACKBAR", payload: {...state.snackBar, state: false}})

    };
    //const handleRowSelectionModelChange = (newRowSelectionModel: GridRowSelectionModel) => {
    //    dispatch({type: "SET_SELECTION_MODEL", payload: newRowSelectionModel})
    //}
    const handleRowUpdate = (newRow: ProductStockLine, oldRow: ProductStockLine) => {
        console.log('new row:', newRow)
        console.log('old row:', oldRow)
        //const index = state?.productBasket?.findIndex((item: any) => item.id === data.id);
        //console.log("New row data: ", data, index)
        //dispatch({type: "SET_PRODUCT_BASKET", payload: data})
        if (newRow?.ean?.length == 13) {
            setEan(parseInt(newRow.id), parseInt(newRow.ean)).then(r => {
                dispatch({type: 'SET_SNACKBAR', payload: {state: true, message: 'Ean actualizat', type: "success"}})
                getStockLines(parseInt(productId)).then(r => {
                    setStockRows(r?.response)
                    setLoading(false);
                })
            })
        }else{
                dispatch({type:"SET_SNACKBAR", payload:{state:true, message:"EAN-ul trebuie sa contina 13 caractere", type:'error'}})
            }
        return newRow;
    }

        useEffect(() => {
            setLoading(true)

            getStockLines(parseInt(productId)).then(r => {
                setStockRows(r?.response)
                setLoading(false);
            })
        }, [])

    useEffect(() => {
        console.log('stock rows', stockRows)
    }, [stockRows])

    return (
        <>
            <Typography variant={"h5"} fontWeight={800} sx={{mb: 2}} textAlign='center' gutterBottom >{`Stock unitar`}</ Typography>
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
            <Grid container component={Paper}>
                <Grid item xs={12}>{loading? <LinearProgress /> :null}</Grid>
                <Grid item xs={12}>
                    <DataGrid
                        rows={stockRows?.length > 0 ? stockRows : []}
                        columns={StockGridColumns()}
                        paginationModel={paginationModel}
                        initialState={{pagination: {paginationModel: {pageSize: pageSize}}}}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[10, 25, 50]}
                        //onRowSelectionModelChange={handleRowSelectionModelChange}
                        rowSelectionModel={state.selectionModel}
                        autoPageSize={false}
                        loading={loading}
                        processRowUpdate={handleRowUpdate}
                        slots={{
                            pagination: WholesaleDatagridFooter
                        }}
                        sx={{
                            width: '85vw',
                            minHeight: '30rem'

                        }}
                    />
                </Grid>
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
export default StockPerUnit;
