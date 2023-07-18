"use client"
import {StateContext} from "@/app/state/context";
import CloseIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import WidgetsIcon from '@mui/icons-material/Widgets';
import {IconButton, Tooltip} from "@mui/material";
import {GridColDef} from "@mui/x-data-grid";
import {useContext} from "react";


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
        {field: 'crt', headerName: 'Crt', width: 50},
        {field: 'id', headerName: 'ID Comanda', width: 100},
        {field: 'status', headerName: 'Status', width: 100},
        {field: 'whStatus', headerName: 'Status depozit', width: 110},
        {field: 'produse_alocate', headerName: 'Produse / Alocate', width: 100},
        {field: 'totalNoVat', headerName: 'Total fara TVA', width: 130},
        {field: 'totalWithVat', headerName: 'Total cu TVA', width: 110},
        {field: 'nr_comanda_client', headerName: 'Nr. comanda client', width: 130},
        {field: 'order_notes', headerName: 'Note', width: 130},
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

