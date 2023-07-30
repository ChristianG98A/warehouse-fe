import {Box, LinearProgress, Skeleton} from "@mui/material";
import React from "react";

                //<Skeleton variant="circular" width={40} height={40} />
                //<Skeleton variant="rounded" width={210} height={60} />

export default function Loading(){
        return(
        <Box sx={{width: '100%'}}>
            <LinearProgress />
        </Box>)

    }
