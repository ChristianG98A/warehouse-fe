"use client"

import {StateContext} from "@/app/state/context";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {Autocomplete, Box, Button, Divider, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography, useStepContext} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {callNextApi} from "@/helpers/apiMethods";


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
    const [allProducts, setAllProducts] = useState<any>();

//    const allProducts = [
//        {label: 'The Shawshank Redemption', id: 1994},]

    useEffect(() => {
        setLoading(true)
        state.currentInvoice ?? router.push('/receptie_marfa/comenzi_furnizori')

        callNextApi("POST", "purchase/getProductsList", {}).catch(e => console.log("Error caught in calling proxy api!\n", e))
            .then((r: any) => {
                console.log(r)
                //dispatch({type: "SET_INVOICES", payload: r?.response})
                setAllProducts(
                r.response.map((product:{id:string, name:string})=>({label:product.name}))
                )
                setLoading(false)
            });
    }, [])

    useEffect(()=>console.log("All products\n", allProducts), [allProducts])
    console.log(state)

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
                    Alege produs
                </Typography>
                <Grid alignItems={"center"} justifyItems={"center"} justifyContent={"center"} container spacing={3} flex={3}>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4} sx={{mt:"2rem"}}>
                        <Autocomplete
                            disablePortal
                            id="product_selection"
                            sx={{width: "100%"}}
                            options={allProducts}
                            renderInput={(params:any) => <TextField {...params} label="Alege Produs" />}
                        />
                    </ Grid>
                </Grid>
                <Divider sx={{mt: 10}} />
                <Box sx={{display: "flex", justifyContent: "right", gap: "5rem", pt: 2}} >
                    <Button variant="contained" type={"submit"}>
                        Save
                    </Button>
                    <Button variant="contained" type={"submit"} onClick={handleClose}  >
                        Cancel
                    </Button>
                </Box>

            </Box>
        </>
    );
}

export default InvoiceEdit;
