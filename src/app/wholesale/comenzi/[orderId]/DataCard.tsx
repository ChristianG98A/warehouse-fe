"use client"
import {StateContext} from "@/app/state/context";
import {State} from "@/app/state/types/stateTypes";
import {Card, CardContent, Grid, Typography, Divider, CardHeader, SxProps, LinearProgress, Skeleton, CircularProgress} from "@mui/material";
import {Action} from "@reduxjs/toolkit";
import {useContext} from "react";

type DataCardValue = {
        name:string;
        value:any;
    }
type DataCardProps = {
        avatar:any;
        sx:SxProps;
        title:string;
        values:DataCardValue[];
        loading:boolean;
    }

const DataCard = (props:DataCardProps) => {
    const [state, dispatch]:[State, Action]= useContext(StateContext);
    let count = 0;
    console.log(props.loading)
    let test = true


    return (

            <Grid item xs={12} sm={6} md={4} sx={{padding: 2, width: {sm: "100%"}}}>
                <Card sx={{height: "100%"}}>
                    <CardHeader
                        sx={props.sx}
                        title={props.title}
                        avatar={props.avatar}
                        titleTypographyProps={{variant: 'h6'}}
                    />

                    <CardContent>
                        <Divider sx={{mb: 2}} />
                        <Grid container>
                            {props.loading? <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}><CircularProgress  /></Grid> :props.values.map((value) => (

                                <Grid container key={count++}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography>{value.name + ":"}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography fontWeight={800}>{value.value}</Typography>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>

                </Card>
            </Grid>
    )
}

export const LoadingFeedback = ()=>{
        return(
            <>
                <Grid item xs={12} sm={6} md={4} sx={{padding: 2, width: {sm: "100%"}}}>
                    <Skeleton variant="rounded" width={210} height={10} sx={{mt:1}}/>
                    <Skeleton variant="rounded" width={160} height={10} sx={{mt:1}}/>
                    <Skeleton variant="rounded" width={210} height={10} sx={{mt:1}}/>
                    <Skeleton variant="rounded" width={210} height={120} sx={{mt:1}}/>
                </Grid>

            </>
        )
    }

export default DataCard;
