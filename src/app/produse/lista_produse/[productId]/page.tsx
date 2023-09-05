'use client'

import {StateContext} from "@/app/state/context";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {callNextApi} from "@/helpers/apiMethods";
import {Action, State} from "@/model/appstate/AppStateTypes";
import {Alert, Button, Card, CardContent, CardHeader, Divider, FormControl, Grid, IconButton, List, ListItem, ListItemText, Paper, Snackbar, TextField, Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import StyledTextarea from "./StyledTextArea";
import DeleteIcon from '@mui/icons-material/Delete';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import {ProductEanCode} from "@/model/products/ProductsTypes";
import {useRouter} from "next/navigation";


const rowsPerPageOptions = [10, 20, 100];
const ProductPage = ({params}: {params: {productId: string}}) => {
    //const [productData, setProductData] = useState<any>();
    const [state, dispatch]: [State, Action] = useContext(StateContext);
    const [newEanObject, setNewEanObject] = useState({ean:"", valid:true});
    const router = useRouter();

    const productId = parseInt(params.productId);

    const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch({type:"SET_SNACKBAR", payload:{...state.snackBar, state:false}})

    };

    const deleteEan = async (rowId:number) => {
        await callNextApi("POST", "products/deleteEan", {row_id: rowId})
            .then((r: any) => {
                dispatch({type:"SET_SNACKBAR", payload:{type:'success', message:'EAN sters cu succes', state:true}})
                getProductDetails();
            })
    }

    const addEan = async () => {
        if(newEanObject.valid){
            //console.log('the post:', {product_id:productId, ean:parseInt(newEanObject.ean)})
            await callNextApi("POST", "products/addEan", {product_id:productId, ean:parseInt(newEanObject.ean)})
                .then((r: any) => {
                    dispatch({type: "SET_SNACKBAR", payload: {type: 'success', message: 'EAN adaugat cu succes', state: true}})
                    getProductDetails();
                })
                .finally(()=>setNewEanObject({ean:"", valid:false}))
            }
            else{
                dispatch({type:'SET_SNACKBAR', payload:{state:true, message:"EAN invalid!", type:'error'}})
                }
    }

    const getProductDetails = async () => {
        await callNextApi("POST", "products/getProduct", {product_id: productId})
            .catch((e: Error) => console.log("Error in fetching product data: ", e))
            .then((r: any) => {
                //setProductData(r?.response)
                try {
                    dispatch({
                        type: "SET_PRODUCT_EDIT", payload: {
                            product_name: r?.response.product[0].product_name,
                            man_name: r?.response.product[0].man_name,
                            description: r?.response.product[0].description,
                            product_ean_codes: r?.response?.product_ean_codes,
                        }
                    })
                } catch (e) {console.log(e)}
            })
    }

    useEffect(() => {
        setNewEanObject({
            ...newEanObject, valid: newEanObject?.ean?.length == 13 ? true : false
        })
    }, [newEanObject?.ean]);
    //useEffect(() => console.log("product data", state?.productEdit), [state?.productEdit]);
    useEffect(() => {
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
                        name: `Editare ${state?.productEdit?.product_name}`,
                        path: `/produse/lista_produse/${productId}`,
                    },
                ]}
            />


            <Grid container component={Paper} p={3} elevation={3}>
                <Grid item xs={12}>
                    <Typography textAlign={'center'} variant={"h5"} fontWeight={800} gutterBottom >{state?.productEdit?.product_name}</Typography>
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
                                            onChange={(e) => dispatch({type: 'SET_PRODUCT_EDIT_NAME', payload: e.target.value})}
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
                                            onChange={(e) => dispatch({type: 'SET_PRODUCT_EDIT_MAN_NAME', payload: e.target.value})}
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
                                            onChange={(e) => dispatch({type: 'SET_PRODUCT_EDIT_DESCRIPTION', payload: e.target.value})}
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
                                    title={"Inventar"}
                                    titleTypographyProps={{variant: 'h6'}}
                                    action={<Button onClick={()=>router.push(`${params.productId}/stock_unitar`)} >Vezi stock unitar</Button>}
                                />
                                <Divider sx={{width: '40%'}} />
                            </Card>

                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader
                                    title={"EAN"}
                                    titleTypographyProps={{variant: 'h6'}}
                                />
                                <Divider sx={{width: '40%'}} />
                                <CardContent>
                                    <List>

                                        {state?.productEdit?.product_ean_codes?.length > 0 ? state?.productEdit?.product_ean_codes?.map((eanObject:ProductEanCode, i)=>(
                                        <ListItem
                                            key={i}
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="delete" onClick={()=>deleteEan(parseInt(eanObject.row_id))}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            }

                                        >
                                            <ListItemText
                                                primary={eanObject.ean}
                                            />
                                        </ListItem>
                                        )):null}
                                    </List>
                                    <ListItem
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="addEan" onClick={()=>addEan()}>
                                                    <AddSharpIcon />
                                                </IconButton>
                                            }
                                    >
                                        <TextField
                                            label={'Adauga EAN'}
                                            value = {newEanObject.ean}
                                            onChange = {e=>setNewEanObject({...newEanObject, ean:e.target.value})}
                                            error={!newEanObject.valid && newEanObject.ean.length != 0}
                                        />
                                    </ListItem>
                                </CardContent>
                            </Card>

                        </Grid>
                    </Grid>
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
const center = {display: "flex", justifyContent: 'center'}
export default ProductPage;
