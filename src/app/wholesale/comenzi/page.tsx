"use client"

//import {getOrders} from "@/api/orders";
import GridColumns from "@/components/common/GridColumns";
import {callNextApi, testApi} from "@/helpers/apiMethods";
import {Button} from "@mui/material";
import {DataGrid, GridColDef, GridRowsProp, GridToolbar} from "@mui/x-data-grid";
import {useEffect, useState} from "react";

const rows: GridRowsProp = [
  { crt:1, id:1, status:"merge", status_deposit:"si asta merge", produse_alocate:"aha", total_fara_tva:"adevarat", total_cu_tva:"nebunie", nr_comanda_client:"69", note:"da"},
];

const row={ crt:1, id:1, status:"merge", status_deposit:"si asta merge", produse_alocate:"aha", total_fara_tva:"adevarat", total_cu_tva:"nebunie", nr_comanda_client:10, note:"da"}

function generateRows(rowsNr:number, row:any){
        let localrows=[]
        for(var i=0; i<rowsNr; i++){
              localrows.push(row);
            }

        return localrows;
    }

const rowsPerPageOptions = [10, 20, 100];

const handlePaginationModelChange = ()=>{

    }



const Orders = ()=>{
    const [pageSize, setPageSize] = useState<number>(rowsPerPageOptions[0]);
    const [loading, setLoading]=useState(false);  //fetch lag.....
    const [orders, setOrders] = useState<any>([]);
    const [paginationModel, setPaginationModel] = useState({
            pageSize:10,
            page:0
        })

    {/*useEffect(()=>{
          setLoading(true);
          fetchOrders(0, pageSize).then(()=>setLoading(false));
        },[])
    */}

        return (
        <>
          <DataGrid
            rows={rows}
            columns={GridColumns()}

            paginationModel={paginationModel}
                        initialState={{pagination: {paginationModel:{pageSize:pageSize}}}}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[10,25,50]}

            autoPageSize={false}
            loading={loading}
            slots={{toolbar:GridToolbar}}
            />
            {/*rowCount={10}
            paginationMode={"server"}
            *rowsPerPageOptions
            */}


          <Button onClick={async()=>{
                  setOrders(await callNextApi("POST", "orders", {limit:20, offset:1},)
                  .catch((e)=>console.log("Error caught in fetching orders!\n", e))
                  .then((r)=>{console.log(r)}))
              }}>Click Me!!</Button>
        </>
        );
    }
export default Orders;


