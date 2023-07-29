import {StateContext} from "@/app/state/context"
import {GridColDef} from "@mui/x-data-grid"
import {useContext} from "react"

export default function ProductsToInvoice() {
    const [state, dispatch] = useContext(StateContext)


    const columns: GridColDef[] = [
        //{field: 'crt', headerName: 'Crt', flex:1},
        {field: 'id', headerName: 'Id', flex: 1},
        {field: 'invoice_date', headerName: 'Data Factura', flex: 2},
        {field: 'due_date', headerName: 'Data Scadenta', flex: 2},
        {field: 'supplier_id', headerName: 'Id Furnizor', flex: 2},
        {field: 'invoice_series', headerName: 'Serie Factura', flex: 2},
        {field: 'supplier_name', headerName: 'Nume Furnizor', flex: 2},
        {field: 'supplier_code', headerName: 'Cod Furnizor', flex: 2},
        {field: 'driver', headerName: 'Sofer', flex: 2},
        {field: 'nr_auto', headerName: 'Numar Auto', flex: 2},
        {field: 'invoice_value', headerName: 'Valoare Factura', flex: 2},
        {field: 'reception_date', headerName: 'Data Receptie', flex: 2},
        {field: 'totalNoVat', headerName: 'Total Fara TVA - RON', flex: 2.5},
        {field: 'totalWithVat', headerName: 'Total Plus TVA - RON', flex: 2.5},
        // si un X probabil
    ];

    return columns;
}

        //{field: 'id', headerName: 'Id', flex: 1},
        //{field: 'invoice_number', headerName: 'Nr. Factura', flex: 1},
        //{field: 'invoice_date', headerName: 'Data Factura', flex: 1},
        //{field: 'supplier_name', headerName: 'Nume Furnizor', flex: 1},
        //{field: 'invoice_series', headerName: 'Serie Factura', flex: 1},
        //{field: 'invoice_number', headerName: 'Numar Factura', flex: 1},
        //{field: 'invoice_date', headerName: 'Data Factura', flex: 1},
        //{field: 'due_date', headerName: 'Data Scadenta', flex: 1},
        //{field: 'totalNoVat', headerName: 'Valoare fara TVA', flex: 1},
        //{field: 'totalWithVat', headerName: 'Valoare cu TVA', flex: 1},
        //{field: 'driver', headerName: 'Driver', flex: 1},
        //{field: 'nr_auto', headerName: 'Auto Nr.', flex: 1},
        //{field: 'driver', headerName: 'Driver', flex: 1},
