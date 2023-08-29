"use client"

import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {ProductQueryAction, ProductQueryState} from "@/model/products/ProductsTypes";
import {Button, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {useReducer} from "react";

const queryReducer = (state:ProductQueryState | any, action:ProductQueryAction | any)=>{
        switch(action.type){
                case "cacamaca":
                    return {...state, cacamaca:action.payload}
            }

    }

const ProductList = () => {
    const [queryState, queryDispatch] = useReducer(queryReducer, {})

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
            <Grid container component={Paper} p={3} elevation={3}>

                <Grid item xs={12} >
                    <Typography textAlign={'center'} variant={"h5"} fontWeight={800}  gutterBottom >Cauta produse</Typography>
                </Grid>
                <Grid item xs={12} p={4}>
                    <Divider  />
                </Grid>
                <Grid item xs={12} sm={12} md={3} sx={{...center}}>
                    <FormControl  sx={{width:'90%'}}>
                        <InputLabel id="cathegory-label">Categorie</InputLabel>
                        <Select
                            value={""}
                            label="Categorie"
                        >
                            <MenuItem value={'Accesorii'}>Accesorii</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={12} md={3} sx={{...center}}>
                    <FormControl  sx={{width:'90%'}}>
                        <InputLabel id="producer-label">Producator</InputLabel>
                        <Select
                            value={""}
                            label="Categorie"
                        >
                            <MenuItem value={'2kBeauty'}>2kBeauty</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={12} md={3} sx={{...center}}>
                    <FormControl  sx={{width:'90%'}}>
                        <InputLabel id="supplier-label">Furnizor</InputLabel>
                        <Select
                            value={""}
                            label="Furnizor"
                        >
                            <MenuItem value={'Amazon'}>Amazon</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={12} md={3} sx={{...center}}>
                    <FormControl  sx={{width:'90%'}}>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            value={""}
                            label="Status"
                        >
                            <MenuItem value={'activ'}>Activ</MenuItem>
                            <MenuItem value={'inactiv'}>Inactiv</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} mt={3} sx={{...center}} gap={2} >
                    <Button variant="contained" >Cauta</Button>
                    <Button variant="contained" >Reset</Button>
                </Grid>
            </Grid>

            {true && (
                <DataGrid columns={[]} rows={[]}
                />
            )}

        </>
    )
}
const center = {display:"flex", justifyContent:'center'}
export default ProductList;
