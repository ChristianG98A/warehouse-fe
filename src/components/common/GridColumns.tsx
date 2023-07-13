import {ToggleButtonGroup, ToggleButton} from "@mui/material";
import {GridCellParams, GridColDef} from "@mui/x-data-grid";
import {useState} from "react";

export default function GridColumns() { // implement type here................


    const gridCol: GridColDef[] = [

        //    {headerName: "Id", field: "id", minWidth: 30, disableColumnMenu: true, sortable: false},
        {headerName: "First Name", field: "firstName", minWidth: 150, disableColumnMenu: true, sortable: false},
        {headerName: "Last Name", field: "lastName", minWidth: 150, disableColumnMenu: true, sortable: false},
        {headerName: "Username", field: "username", minWidth: 280, disableColumnMenu: true, sortable: false},
        {headerName: "Email", field: "email", minWidth: 250, disableColumnMenu: true, sortable: false},
        //           {headerName: "Phone Number", field: "phoneNumber", minWidth: 150, disableColumnMenu: true, sortable: false},
        {
            headerName: "Account",
            field: "active", minWidth: 50, disableColumnMenu: true, sortable: true
        },
    ]
    return gridCol;
}
