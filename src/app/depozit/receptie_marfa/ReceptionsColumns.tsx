import {StateContext} from "@/app/state/context"
import {GridColDef} from "@mui/x-data-grid"
import {useContext} from "react"

export default function ReceptionsColumns() {
    const [state, dispatch] = useContext(StateContext)


    const columns: GridColDef[] = [
        {field: 'id', headerName: 'Id', flex: 1},
        {field: 'supplier_name', headerName: 'Nume Furnizor', flex: 2},
        {field: 'invoice_series', headerName: 'Serie Factura', flex: 2},
        {field: 'invoice_number', headerName: 'Numar Factura', flex: 2},
        {field: 'invoice_date', headerName: 'Data Factura', flex: 2},
        {field: 'invoice_value', headerName: 'Valoare Factura', flex: 2},
        {field: 'currency', headerName: 'Moneda', flex: 1},
        {field: 'total_quantity', headerName: 'Cantitate Totala', flex: 2},
        {field: 'receptioned_quantity', headerName: 'Receptionat', flex: 2},
        {field: 'not_receptioned_quantity', headerName: 'Ramas de Receptionat', flex: 2},

    ];

    return columns;
}
