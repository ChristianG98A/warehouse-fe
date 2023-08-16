import {StateContext} from "@/app/state/context";
import {GridColDef} from "@mui/x-data-grid";
import {useContext} from "react";

export default function OrderColumns() {
    //const [state, dispatch] = useContext(StateContext)


    const columns: GridColDef[] = [
        {field: 'id', headerName: 'Id', flex: 1},
        {field: 'name', headerName: 'Denumire', flex: 2},
        {field: 'toBeInserted', headerName: 'Medie Pret AC', flex: 1},
        {field: 'toBeInsertedd', headerName: 'Pret AC', flex: 1},
        {field: 'asb', headerName: 'Marja Adaos', flex: 1},
        {field: 'price_netto', headerName: 'Pret Vz', flex: 1},
        {field: 'quantity', headerName: 'Cant', flex: 1},
        {field: 'asda', headerName: 'Stoc', flex: 1},
        {field: 'quantity', headerName: 'Alocate', flex: 1},
        {field: 'price_netto', headerName: 'Valoare', flex: 1},
        {field: 'dawadwa', headerName: 'TVA', flex: 1},
        {field: 'totalNoVat', headerName: 'Total (fara TVA)', flex: 1},
        {field: 'currency', headerName: 'Moneda', flex: 1},

    ];

    return columns;
}
