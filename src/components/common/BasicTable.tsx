import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import dayjs from 'dayjs';


export default function BasicTable(props:any) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Serie factura</TableCell>
            <TableCell align="center">Numar Factura</TableCell>
            <TableCell align="center">Data Factura</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {props.rows.map((row:{invoiceSeries:string, invoiceNumber:string, date:any}) => (
            <TableRow
              key={row.invoiceNumber}
            >
              <TableCell component="th" scope="row" align='center'>
                {row.invoiceSeries}
              </TableCell>
              <TableCell contentEditable='false' align="center">{row.invoiceNumber}</TableCell>
              <TableCell align="center">{dayjs(row.date).format("YYYY-MM-DD")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
