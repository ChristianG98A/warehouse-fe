import {Button} from "@mui/material";
import React from "react";

const CustomToolbar = () => {
    return (
        <div>
            <Button
                color="primary"
                size="large"
                onClick={() => (null)}
                style={{marginLeft: "1rem"}}
            >
                Adauga
            </Button>

        </div>
    );
}

export default CustomToolbar;
