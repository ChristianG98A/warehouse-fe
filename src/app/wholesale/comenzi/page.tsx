"use client"

import {getOrders} from "@/api/orders";
import GridColumns from "@/components/common/GridColumns";
import {Button} from "@mui/material";
import {DataGrid, GridColDef, GridRowsProp} from "@mui/x-data-grid";
import {useEffect, useState} from "react";

const rows: GridRowsProp = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
];



const Orders = ()=>{
    const [orders, setOrders] = useState({});
    useEffect(()=>{
          console.log(orders)
        },[orders])

        return (
        <>
          <DataGrid rows={rows} columns={columns} />
          <Button onClick={async()=>{
                  setOrders(await getOrders().catch((e)=>console.log("Error caught in fetching orders!")))
              }}>Click Me!!</Button>
        </>
        );
    }
export default Orders;
