import {GridColDef} from "@mui/x-data-grid";

export default function ProductColumns() {


    const columns: GridColDef[] = [
        {field: 'id', headerName: 'Id', flex: 1},
        {field: 'product_name', headerName: 'Denumire', flex: 3},
        {field: 'man_name', headerName: 'Brand', flex: 2},
        {field: 'status', headerName: 'Status', flex: 2},
    ];

    return columns;
}
