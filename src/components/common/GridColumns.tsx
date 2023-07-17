"use client"
import {ToggleButtonGroup, ToggleButton, IconButton, Tooltip} from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import WidgetsIcon from '@mui/icons-material/Widgets';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CreateIcon from '@mui/icons-material/Create';
import CloseIcon from '@mui/icons-material/Close';
import {GridCellParams, GridColDef} from "@mui/x-data-grid";
import {MouseEventHandler, useContext, useState} from "react";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import {callNextApi} from "@/helpers/apiMethods";
import {StateContext} from "@/app/state/context";


//type buttonId = "export_pdf_proforma_button" | "export_xls_proforma_button" | "export_pregatire_produse_button" | "order_edit_button" | "delete_order_button"

const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
  const buttonId = event.currentTarget.id;

  switch (buttonId) {
    case 'export_pdf_proforma_button':
      console.log("export_pdf_proforma_button clicked")
      break;

    case 'export_xls_produse_proforma_button':
      console.log('export_xls_proforma_button clicked');
      break;

    case 'export_pregatire_produse_button':
      console.log('export_pregatire_produse_button clicked');
      break;

    case 'order_edit_button':
      console.log('order_edit_button clicked');
      break;

    case 'delete_order_button':
      break;

    default:
      console.log('Unknown button clicked!');
  }
};

export default function GridColumns() { // implement type here................
    const [state, dispatch] = useContext(StateContext)





    const columns: GridColDef[] = [
        {field: 'crt', headerName: 'Crt', width: 70},
        {field: 'id', headerName: 'ID Comanda', width: 150},
        {field: 'status', headerName: 'Status', width: 150},
        {field: 'whStatus', headerName: 'Status depozit', width: 150},
        {field: 'produse_alocate', headerName: 'Produse / Alocate', width: 150},
        {field: 'totalNoVat', headerName: 'Total fara TVA', width: 150},
        {field: 'totalWithVat', headerName: 'Total cu TVA', width: 150},
        {field: 'nr_comanda_client', headerName: 'Nr. comanda client', width: 100},
        {field: 'order_notes', headerName: 'Note', width: 100},
        {
            field: 'actions',
            headerName: 'Actions',
            align:"center",
            headerAlign:"center",
            width: 330,
            renderCell: (params) => {

//type buttonId = "export_pdf_proforma_button" | "export_xls_proforma_button" | "export_pregatire_produse_button" | "order_edit_button" | "delete_order_button"
                return (
                    <>
                        <Tooltip title="Export pdf proforma">
                          <IconButton id='export_pdf_proforma_button' aria-label="Test Me!" onClick={handleClick}>
                              <PictureAsPdfIcon color="primary" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Export xls proforma">
                          <IconButton id='export_xls_produse_proforma_button' aria-label="Test Me!" onClick={handleClick}>
                              <DescriptionIcon color="primary" />
                          </IconButton>
                        </Tooltip>


                        <Tooltip title="Export pregatire produse">
                          <IconButton id='export_pregatire_produse_button' aria-label="Test Me!" onClick={handleClick}>
                              <WidgetsIcon color="success" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Editare comanda">
                          <IconButton id='order_edit_button' aria-label="Test Me!" onClick={handleClick}>
                              <CreateIcon color="primary" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Stergere comanda">
                            <IconButton id='delete_order_button' aria-label="Test Me!" onClick={ async () => {
                                    dispatch({type:"SET_DELETE_PROMPT", payload:true})
                            }}>
                              <CloseIcon color="error" />
                          </IconButton>
                        </Tooltip>
                    </>
                )
            }
        },
    ];

    return columns;
}

