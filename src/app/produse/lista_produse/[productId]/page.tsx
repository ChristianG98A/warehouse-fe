'use client'

import {StateContext} from "@/app/state/context";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Action, State} from "@/model/appstate/AppStateTypes";
import {Box, Card, CardContent, CardHeader, FormControl, Grid, Paper, TextareaAutosize, TextField, Typography} from "@mui/material";
import {useContext, useEffect, useReducer, useState} from "react";
import StyledTextarea from "./StyledTextArea";



const ProductPage = ({params}: {params: {productId: string}}) => {
    const [productData, setProductData] = useState<any>();
    const [state, dispatch]:[State, Action] = useContext(StateContext);

    const productId = parseInt(params.productId);

    const getProductDetails = async () => {
        await callNextApi("POST", "products/getProduct", {product_id: productId})
            .catch((e:Error) => console.log("Error in fetching product data: ", e))
            .then((r: any) => {
                //setProductData(r?.response)
                dispatch({
                    type: "SET_PRODUCT_EDIT", payload: {
                        product_name: r?.response.product[0].product_name,
                        man_name: r?.response.product[0].man_name,
                        description: r?.response.product[0].description,
                    }
                })
            })
    }


    useEffect(()=>console.log("product data", state?.productEdit),[state?.productEdit]);
    useEffect(()=>{
            getProductDetails();
        }, [])

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
                    {
                        name: "Lista Produse",
                        path: `/produse/lista_produse/${productId}`,
                    },
                ]}
            />


            <Grid container component={Paper} p={3} elevation={3}>
                <Grid item xs={12}>
                    <Typography textAlign={'center'} variant={"h5"} fontWeight={800} gutterBottom >Nume produs aici!</Typography>
                </Grid>


                <Grid item xs={12} sm={8}>
                    <Grid container>
                    <Grid item xs={12} >
                        <Card>
                            <CardHeader
                                title={"Informatii generale"}
                                titleTypographyProps={{variant: 'h6'}}
                            />
                            <CardContent >
                                <FormControl sx={{width: '100%', p: 1}}>
                                    <TextField
                                        label="Nume"
                                        value={state.productEdit?.product_name}
                                        onChange={(e)=>dispatch({type:'SET_PRODUCT_EDIT_NAME', payload:e.target.value})}
                                    />
                                </FormControl>
                                <FormControl sx={{width: '100%', p: 1}}>
                                    <TextField
                                        label="Model"
                                    />
                                </FormControl>
                                <FormControl sx={{width: '100%', p: 1}}>
                                    <TextField
                                        label="Producator"
                                        value={state.productEdit?.man_name}
                                        onChange={(e)=>dispatch({type:'SET_PRODUCT_EDIT_MAN_NAME', payload:e.target.value})}
                                    />
                                </FormControl>
                                <FormControl sx={{width: '100%', p: 1}}>
                                    <TextField
                                        label="Categorie"
                                    />
                                </FormControl>
                                <FormControl sx={{width: '100%', height: '20rem', p: 1}}>
                                    <StyledTextarea
                                        minRows={30}
                                        value={state.productEdit?.description}
                                        onChange={(e)=>dispatch({type:'SET_PRODUCT_EDIT_DESCRIPTION', payload:e.target.value})}
                                    />
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Grid>
                    </Grid>
                </Grid>


                <Grid item xs={12} sm={4} >
                    <Grid container flexDirection={'column'} gap={4}>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader
                                    title={"Optiuni"}
                                    titleTypographyProps={{variant: 'h6'}}
                                />
                                <CardContent>
                                    blabla
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader
                                    title={"Optiuni"}
                                    titleTypographyProps={{variant: 'h6'}}
                                />
                                <CardContent>
                                    blabla
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader
                                    title={"Optiuni"}
                                    titleTypographyProps={{variant: 'h6'}}
                                />
                                <CardContent>
                                    blabla
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        </>
    )
}
const center = {display: "flex", justifyContent: 'center'}
export default ProductPage;
