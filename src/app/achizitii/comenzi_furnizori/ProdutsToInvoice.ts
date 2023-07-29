import {StateContext} from "@/app/state/context"
import {GridColDef} from "@mui/x-data-grid"
import {useContext} from "react"

export default function ProductsToInvoice() {
    const [state, dispatch] = useContext(StateContext)


    const columns: GridColDef[] = [
        {field: 'crt', headerName: 'Crt', width: 50},
        {field: 'Furnizor', headerName: 'Furnizor', width: 100},
        {field: 'Serie_Factura', headerName: 'Serie factura', width: 100},
        {field: 'invoiceNumber', headerName: 'Numar factura', width: 110},
        {field: 'date', headerName: 'Data', width: 100},
        {field: 'product', headerName: 'Produs', width: 130},
        {field: 'EAN', headerName: 'EAN', width: 110}, //INPUT FIELD
        {field: 'TVA', headerName: 'TVA ???', width: 130},
        {field: 'discount', headerName: 'Discount', width: 130},
        {field: 'buy_price', headerName: 'Pret achizitie', width: 130},
        {field: 'nrceva', headerName: 'Numere seriale', width: 130},
        {field: 'deposit', headerName: 'Depozit', width: 130},
        {field: 'sofer', headerName: 'Sofer', width: 130},
        // si un X probabil
    ];

    return columns;
}

