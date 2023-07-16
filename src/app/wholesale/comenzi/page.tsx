"use client"

import GridColumns from "@/components/common/GridColumns";
import {callNextApi} from "@/helpers/apiMethods";
import {Button} from "@mui/material";
import {DataGrid, GridRowSelectionModel, GridRowsProp, GridToolbar} from "@mui/x-data-grid";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {StateContext} from "@/app/state/context";

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


const Orders = ()=>{
    const [pageSize, setPageSize] = useState<number>(rowsPerPageOptions[0]);
    const [loading, setLoading]=useState(false);  //fetch lag.....
//    const [orders, setOrders] = useState<any>([]);
    const [state, dispatch] = useContext(StateContext)
    const [paginationModel, setPaginationModel] = useState({
            pageSize:10,
            page:0
        })

    // initial data fetch
    useEffect(()=>{
          //console.log("this is the context api state:\n", state);
          setLoading(true);
            callNextApi("POST", "orders", {limit:paginationModel.pageSize, offset:0}).catch(e=>console.log("Error caught in calling proxy api!\n", e))
          .then((r)=>{
              //console.log(r)
              dispatch({type:"SET_ORDERS", payload:r})
              setLoading(false)
          });
        },[paginationModel])
    useEffect(()=>{
            console.log("This is the actual state:\n", state);
        },[state])



        return (
        <>
          <DataGrid
            rows={useMemo(()=>{return state.orders},[state.orders])} //aici va veni Orders
            columns={useMemo(()=>{return GridColumns()},[])}
            checkboxSelection={true}
            paginationModel={paginationModel}
                        initialState={{pagination: {paginationModel:{pageSize:pageSize}}}}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[10,25,50]}

            onRowSelectionModelChange={(newRowSelectionModel)=>{
                   dispatch({type:"SET_SELECTION_MODEL", payload:newRowSelectionModel})
                }}
            rowSelectionModel={state.selectionModel}
            autoPageSize={false}
            loading={loading}
            slots={{toolbar:GridToolbar}}
            />
            {/*rowCount={10}
            paginationMode={"server"}
            *rowsPerPageOptions
            */}


            <Button onClick={async()=>{
                  console.log(state)
              }}>Log the State!</Button>

          {/*
               <Button onClick={async()=>{
                  setOrders(await callNextApi("POST", "orders", {limit:20, offset:1},)
                  .catch((e)=>console.log("Error caught in fetching orders!\n", e))
                  .then((r)=>{console.log(r)}))
              }}>Click Me!!</Button>
          */}
        </>
        );
    }
export default Orders;


