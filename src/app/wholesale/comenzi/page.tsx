"use client"

import {getOrders} from "@/api/orders";
import GridColumns from "@/components/common/GridColumns";
import {Button} from "@mui/material";
import {DataGrid, GridColDef, GridRowsProp} from "@mui/x-data-grid";
import {useEffect, useState} from "react";

const rows: GridRowsProp = [
  { crt:1, id:1, status:"merge", status_deposit:"si asta merge", produse_alocate:"aha", total_fara_tva:"adevarat", total_cu_tva:"nebunie", nr_comanda_client:"69", note:"da"},
];

const columns: GridColDef[] = [
  { field: 'crt', headerName: 'Crt', width: 50 },
  { field: 'id', headerName: 'ID Comanda', width: 150 },
  { field: 'status', headerName: 'Status', width: 150 },
  { field: 'status_deposit', headerName: 'Status depozit', width: 150 },
  { field: 'produse_alocate', headerName: 'Produse / Alocate', width: 150 },
  { field: 'total_fara_tva', headerName: 'Total fara TVA', width: 150 },
  { field: 'total_cu_tva', headerName: 'Total cu TVA', width: 150 },
  { field: 'nr_comanda_client', headerName: 'Nr. comanda client', width: 150 },
  { field: 'note', headerName: 'Note', width: 150 },
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
                  setOrders(await getOrders(20, 1).catch((e)=>console.log("Error caught in fetching orders!")))
              }}>Click Me!!</Button>
        </>
        );
    }
export default Orders;
