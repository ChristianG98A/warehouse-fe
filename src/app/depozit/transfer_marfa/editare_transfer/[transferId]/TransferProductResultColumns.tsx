import {GridColDef} from "@mui/x-data-grid"

export default function TransferProductResultColumns() {


    const columns: GridColDef[] = [
        {field: 'crt', headerName: 'Crt', flex: 1},
        {field: 'id', headerName: 'ID Produs', flex: 1},
        {field: 'name', headerName: 'Denumire Produs', flex: 4},
        {field: 'model', headerName: 'Model', flex: 4},
        {field: 'available_quantity', headerName: 'Cantitate Disponibila', flex: 4},
        {field: 'warehouse_name', headerName: 'Depozit', flex: 4},
    ];

    return columns;
}
