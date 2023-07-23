"use client"

import {StateContext} from "@/app/state/context";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {Box, Button, Divider, Grid, TextField, Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {callNextApi} from "@/helpers/apiMethods";
import {DataGrid, GridColDef, GridToolbar} from "@mui/x-data-grid";
import CustomToolbar from "@/components/common/CustomToolbar";

const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
        return;
    }
};


const InvoiceEdit = () => {
    const [state, dispatch] = useContext(StateContext)
    const {register, handleSubmit} = useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<string>();
    const [inputValue, setInputValue] = useState('');
    const debounce = require('lodash.debounce');
    const [selectionModel, setSelectionModel] = useState<any>({})
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })
    //const [allProducts, setAllProducts] = useState<any>();

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

    useEffect(()=>console.log("Checkbox Selected: ", selectionModel), [selectionModel])
    useEffect(()=>console.log("Product basket: ", state?.productBasket), [state.productBasket])


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
                <Typography textAlign={"center"} id="new_invoice_modal" variant="h6" component="h2">
                  Alege produse
              </Typography>
              <Grid alignItems={"center"} justifyItems={"center"} justifyContent={"center"} container spacing={3} flexDirection={"column"} sx={{mt: 5}}>
                    <Grid item xs={10} sm={10} md={10} lg={10} xl={10} alignItems={"center"} justifyItems={"center"} justifyContent={"center"} >
                        <TextField
                        sx={{width:'30rem'}}
                            onChange={handleSearch}
                            label={'Denumire / SKU / ID'}
                      />
                  </ Grid>

                  <Grid item xs={10} sm={10} md={10} lg={10} xl={10} sx={{width: "80%"}}>
                      <DataGrid
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
                          rowSelectionModel={state.selectionModel}
                          autoPageSize={false}
                          loading={loading}
                      />
                  </ Grid>


                  <Grid item xs={10} sm={10} md={10} lg={10} xl={10} alignItems={"center"} justifyItems={"center"} justifyContent={"center"} >
                      <Divider sx={{mt: 3, mb: 3}} />
                      <Button disabled={selectionModel?.length==0} variant="contained" onClick={()=>{
                            selectionModel?.forEach((itemSelected:any)=>{
                                try {
                                    dispatch({type: "SET_PRODUCT_BASKET", payload: state.productResult.find((productObject:any)=>productObject.id==itemSelected
                                        )})
                                }catch(error){console.log("Error in adding products to invoice!", error)}
                                })
                          }} sx={{width:"10rem"}}>
                          Add
                      </Button>
                  </Grid>
              </Grid>


            </Box>
        </>
    );
}

export default InvoiceEdit;
