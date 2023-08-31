"use client"

import {StateContext} from "@/app/state/context";
import {Button} from "@mui/material";
import React, {useContext} from "react";

const CustomToolbar = () => {
    const [state, dispatch] = useContext(StateContext);
    return (
        <div>
            <Button
                color="primary"
                size="large"
                onClick={() => dispatch({type:"SET_PRODUCT_BASKET_MODAL", payload:true})}
                style={{marginLeft: "1rem"}}
            >
                Adauga Produse
            </Button>
        </div>
    );
}

export default CustomToolbar;
