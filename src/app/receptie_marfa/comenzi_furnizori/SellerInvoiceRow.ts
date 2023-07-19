import {StateContext} from "@/app/state/context"
import {GridColDef} from "@mui/x-data-grid"
import {useContext} from "react"

export default function ProductsToInvoice() {
    const [state, dispatch] = useContext(StateContext)


    const columns: GridColDef[] = [
        {field: 'number', headerName: 'Number', width: 300},
        {field: 'order', headerName: 'Comanda', width: 100},
        {field: 'buyer', headerName: 'Cumparator', width: 300},
        {field: 'gross_amount', headerName: 'Pret brut', width: 100},
        {field: 'date', headerName: 'Data', width: 100},
        {field: 'correction', headerName: 'Correction??', width: 200},
        {field: 'action', headerName: 'Action??', width: 200},
        // si un X probabil
    ];

    return columns;
}

