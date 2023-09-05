import {GridColDef} from "@mui/x-data-grid";

export default function StockGridColumns() {


    const columns: GridColDef[] = [
        {field: 'id', headerName: 'Id', flex: 1, maxWidth: 80},
        {field: 'ean', headerName: 'EAN', flex: 2, maxWidth: 400},
        {field: 'supplier_name', headerName: 'Furnizor', flex: 2, maxWidth: 400},
        {field: 'warehouse_name', headerName: 'Depozit', flex: 2, maxWidth: 400},
        {field: 'acquisition_price', headerName: 'Pret Achizitie', flex: 2, maxWidth: 400},
        {field: 'status', headerName: 'Status', flex: 2, maxWidth: 400},
        {field: 'acquired_date', headerName: 'Data achizitie', flex: 2, maxWidth: 400},
        {field: 'invoice_in', headerName: 'factura', flex: 2, maxWidth: 400},
        {field: 'order_id', headerName: 'ID Comanda', flex: 2, maxWidth: 400},
        {field: 'transfer_id', headerName: 'ID transfer', flex: 2, maxWidth: 400},
    ];

    return columns;
}
