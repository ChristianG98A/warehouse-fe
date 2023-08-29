'use client'

import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {Card, CardContent, CardHeader, FormControl, Grid, Paper, TextareaAutosize, TextField, Typography} from "@mui/material";
import StyledTextarea from "./StyledTextArea";

const ProductPage = ({params}: {params: {productId: string}}) => {
    const productId = parseInt(params.productId);

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
                        name: "Lista Produse",
                        path: `/produse/lista_produse/${productId}`,
                    },
                ]}
            />
                <Grid container component={Paper} p={3} elevation={3}>
                    <Grid item xs={12}>
                        <Typography textAlign={'center'} variant={"h5"} fontWeight={800} gutterBottom >Nume produs aici!</Typography>
                    </Grid>
                    <Grid item xs={12} >
                        <Card>
                            <CardHeader
                                title={"Informatii generale"}
                                titleTypographyProps={{variant: 'h6'}}
                            />
                            <CardContent >
                                <FormControl sx={{width: '100%', p:1}}>
                                    <TextField
                                       label="Nume"
                                    />
                                </FormControl>
                                <FormControl sx={{width: '100%', p:1}}>
                                    <TextField
                                       label="Model"
                                    />
                                </FormControl>
                                <FormControl sx={{width: '100%', p:1}}>
                                    <TextField
                                       label="Producator"
                                    />
                                </FormControl>
                                <FormControl sx={{width: '100%', p:1}}>
                                    <TextField
                                       label="Categorie"
                                    />
                                </FormControl>
                                <FormControl sx={{width: '100%', height:'20rem', p:1}}>
                                <StyledTextarea
                                    minRows={20}
                                    aria-label="maximum height"
                                    placeholder="Maximum 4 rows"
                                    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                                     ut labore et dolore magna aliqua."
                                />
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
        </>
        )
    }
const center = {display:"flex", justifyContent:'center'}
    export default ProductPage;
