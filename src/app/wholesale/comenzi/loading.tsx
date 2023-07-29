import {Box, LinearProgress, Skeleton} from "@mui/material";
import React from "react";

                //<Skeleton variant="circular" width={40} height={40} />
                //<Skeleton variant="rounded" width={210} height={60} />

export default function LoadingWholesaleProducts(){
        return(
            <Box sx={{width: '100%'}}>
                <LinearProgress />
            </Box>
        )



    }

            //<div style={{paddingTop:"4rem"}}>
            //    <Skeleton variant="text" sx={{fontSize: '5rem'}} />

            //    <Skeleton variant="circular" width={"10rem"} height={"10rem"} />
            //    <Skeleton variant="rectangular" width={610} height={120} />
            //    <Skeleton variant="rounded" width={610} height={120} />
            //</ div>
