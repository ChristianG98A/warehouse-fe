import {ToggleButtonGroup, ToggleButton} from "@mui/material";
import {GridCellParams, GridColDef} from "@mui/x-data-grid";
import {useState} from "react";

export default function GridColumns() { // implement type here................


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

    return columns;
}

