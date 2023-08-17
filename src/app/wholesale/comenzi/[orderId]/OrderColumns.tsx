import {StateContext} from "@/app/state/context";
import {GridColDef} from "@mui/x-data-grid";
import {useContext} from "react";

export default function OrderColumns() {
    //const [state, dispatch] = useContext(StateContext)


    const columns: GridColDef[] = [
        {field: 'id', headerName: 'Id', flex: 1},
        {field: 'name', headerName: 'Denumire', flex: 3},
        {field: 'toBeInserted', headerName: 'Medie Pret AC', flex: 2},
        {field: 'toBeInsertedd', headerName: 'Pret AC', flex: 2},
        {field: 'asb', headerName: 'Marja Adaos', flex: 2},
        {field: 'price_nettoo', headerName: 'Pret Vz', flex: 2},
        {field: 'quantity', headerName: 'Cant', flex: 2},
        {field: 'asda', headerName: 'Stoc', flex: 2},
        {field: 'quantityy', headerName: 'Alocate', flex: 2},
        {field: 'price_netto', headerName: 'Valoare', flex: 2},
        {field: 'dawadwa', headerName: 'TVA', flex: 2},
        {field: 'totalNoVat', headerName: 'Total (fara TVA)', flex: 2},
        {field: 'currency', headerName: 'Moneda', flex: 2},

    ];

    return columns;
}
