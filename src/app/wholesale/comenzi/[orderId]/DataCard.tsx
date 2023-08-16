import {Card, CardContent, Grid, Typography, Divider} from "@mui/material";

const DataCard = (props:any) => {
    const orderData = props.orderData

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{mb: 1}}>Detalii client</Typography>
                <Divider sx={{mb: 1}} />

                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <Typography>Customer Name</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography>{orderData?.invoice_data[0].invoice_company}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography>Company</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography>{orderData?.invoice_data[0].invoice_company}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography>Email</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography>{orderData?.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography>Phone</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography>{orderData?.phone}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default DataCard;
