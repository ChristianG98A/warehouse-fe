"use client"

import {Card, CardActionArea, CardContent, CardMedia, Grid, Paper, Typography} from '@mui/material'
import warehouseImage from "@../../public/warehouse.png"
import Image from 'next/image'

export default function Home() {

    return (
        <>
                <Grid alignItems={"center"} justifyItems={"center"} justifyContent={"center"} container spacing={3} flex={3}>
                <Grid item xs={12}>
                    <Typography textAlign={'center'} variant={"h5"} fontWeight={800} sx={{mb: 2, }} gutterBottom >Dashboard</Typography>
                </Grid>
                    <Grid item xs={4}>
                        <Card sx={{maxWidth: 345}}>
                            <CardActionArea>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Achizitii
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card sx={{maxWidth: 345}}>
                            <CardActionArea>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Wholesale
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>

                    </Grid>
                    <Grid item xs={4}>
                        <Card sx={{maxWidth: 345}}>
                            <CardActionArea>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Depozit
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>

                    </Grid>
                </Grid>
        </>

    )
}
