import {Skeleton} from "@mui/material";
import React from "react";

                //<Skeleton variant="circular" width={40} height={40} />
                //<Skeleton variant="rounded" width={210} height={60} />

export default function LoadingWholesaleProducts(){
        return(
            <div style={{paddingTop:"4rem"}}>
                <Skeleton variant="rounded" width={210} height={30} />
                <Skeleton variant="text" sx={{fontSize: '2rem'}} />
                <Skeleton variant="rounded" width={210} height={30} />
                <Skeleton variant="text" sx={{fontSize: '2rem'}} />
                <Skeleton variant="rounded" width={210} height={30} />
                <Skeleton variant="text" sx={{fontSize: '2rem'}} />
                {/* For other variants, adjust the size with `width` and `height` */}
            </ div>
        )



    }
