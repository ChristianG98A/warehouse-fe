import {ToggleButtonGroup, ToggleButton, IconButton} from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import WidgetsIcon from '@mui/icons-material/Widgets';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CreateIcon from '@mui/icons-material/Create';
import CloseIcon from '@mui/icons-material/Close';
import {GridCellParams, GridColDef} from "@mui/x-data-grid";
import {useState} from "react";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';


export default function GridColumns() { // implement type here................


    const columns: GridColDef[] = [
        {field: 'crt', headerName: 'Crt', width: 50},
        {field: 'id', headerName: 'ID Comanda', width: 100},
        {field: 'status', headerName: 'Status', width: 100},
        {field: 'status_deposit', headerName: 'Status depozit', width: 150},
        {field: 'produse_alocate', headerName: 'Produse / Alocate', width: 150},
        {field: 'total_fara_tva', headerName: 'Total fara TVA', width: 150},
        {field: 'total_cu_tva', headerName: 'Total cu TVA', width: 150},
        {field: 'nr_comanda_client', headerName: 'Nr. comanda client', width: 150},
        {field: 'note', headerName: 'Note', width: 150},
        {
            field: 'actions',
            headerName: 'Actions',
            align:"center",
            headerAlign:"center",
            width: 330,
            renderCell:(params)=>{
                    const handleClick = ()=>{
                            console.log('Buzz')
                        }

                    return(
                    <>
                      <IconButton aria-label="Test Me!" onClick={handleClick}>
                        <PictureAsPdfIcon color="primary" />
                      </IconButton>

                      <IconButton aria-label="Test Me!" onClick={handleClick}>
                        <DescriptionIcon color="primary" />
                      </IconButton>

                      <IconButton aria-label="Test Me!" onClick={handleClick}>
                        <FormatListBulletedIcon color="success" />
                      </IconButton>

                      <IconButton aria-label="Test Me!" onClick={handleClick}>
                        <WidgetsIcon  color="success" />
                      </IconButton>

                      <IconButton aria-label="Test Me!" onClick={handleClick}>
                        <DescriptionIcon color="secondary" />
                      </IconButton>

                      <IconButton aria-label="Test Me!" onClick={handleClick}>
                        <CreateIcon color="primary" />
                      </IconButton>

                      <IconButton aria-label="Test Me!" onClick={handleClick}>
                        <CloseIcon color="error" />
                      </IconButton>

                    </>
                    )
                }
        },
    ];

    return columns;
}

