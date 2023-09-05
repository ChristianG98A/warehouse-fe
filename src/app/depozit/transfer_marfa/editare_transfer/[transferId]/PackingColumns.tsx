import {GridColDef} from "@mui/x-data-grid"

export default function PackingColumns() {


    const columns: GridColDef[] = [
        {field: 'product_id', headerName: 'ID Produs', flex: 2},
        {field: 'product_name', headerName: 'Denumire Produs', flex: 3},
        {field: 'total_quantity', headerName: 'Totala', flex: 2},
        {field: 'processed_quantity', headerName: 'Procesat', flex: 2},
        {field: 'not_processed_quantity', headerName: 'Neprocesat', flex: 2},
    ];

    return columns;
}
