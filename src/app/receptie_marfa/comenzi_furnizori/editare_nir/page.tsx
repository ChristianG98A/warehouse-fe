"use client"

import {StateContext} from "@/app/state/context";
import {PageBreadcrumbs} from "@/components/features/PageBreadcrumbs";
import {Autocomplete, Box, Button, Divider, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography, useStepContext} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {callNextApi} from "@/helpers/apiMethods";
const _ = require('lodash');

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
    //const [allProducts, setAllProducts] = useState<any>();

    const handleSearch = _.debounce((event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value)
        callNextApi("POST", "purchase/searchProduct", {searchterm: event.target.value})
        .catch(e=>console.log("Error searching for product: ", e))
        .then((r:any)=>{
            console.log(r.response)
                let id_key =1
                const result=r.response.map((product:{id:string, name:string})=>({label:`${id_key++}: ${product.name}`}))
                dispatch({type:"SET_PRODUCT_RESULT", payload:result})
            })
    }, 1000)

    const allProducts = [
        {label: 'The Shawshank Redemption', },
        {label: 'The ssaShawshank Redemption', },
        {label: 'The ar2rShawshank Redemption', },
        ]

    useEffect(() => {
        setLoading(true)
        state.currentInvoice ?? router.push('/receptie_marfa/comenzi_furnizori')
    }, [])

    useEffect(()=>console.log("All products\n", state.productResult), [state.productResult])

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
                <Grid alignItems={"center"} justifyItems={"center"} justifyContent={"center"} container spacing={3} flex={3} sx={{mt:5}}>
                        <Autocomplete
                            disablePortal
                            id="product_selection"
                            sx={{width: "80%"}}
                            options={state.productResult}
                            renderInput={(params: any) => {
                                const { key, id, ...otherParams } = params;
                                return (<TextField  {...otherParams} onChange={handleSearch} label="Alege Produs" />)
                            }}
                        />
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
