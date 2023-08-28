import {StateContext} from "@/app/state/context";
import {callNextApi} from "@/helpers/apiMethods";
import {Action, State} from "@/model/appstate/AppStateTypes";
import {Select, MenuItem, Typography} from "@mui/material";
import {width} from "@mui/system";
import {GridPagination, GridToolbarColumnsButton, GridToolbarContainer} from "@mui/x-data-grid";
import {useContext} from "react";


const WholesaleDatagridFooter = (props:any) => {
  const { paginationProps } = props;
  const itemsPerPageOptions = [300, 1000, 999999]; // Hardcoded number options
  const [state, dispatch]:[State, Action] = useContext(StateContext)
  let counter = 0


  return (
    <GridToolbarContainer>
      <Typography>Total entries: </Typography>
      <Select
          labelId="paginationSelect"
          id="paginationSelect"
          label="Total"
          variant="standard"
          value = {state.wholesaleOffset}
          sx={{width:"5rem"}}
          onChange={(e)=>console.log(e.target.value)}
        >
        {itemsPerPageOptions.map(item=>
        (<MenuItem key={counter++}
            onClick={() => dispatch({type: "SET_WHOLESALE_OFFSET", payload: item})}
            value={item} >{item == 999999? 'MAX': item}</MenuItem>))}
        </Select>
      <GridPagination {...paginationProps} />
    </GridToolbarContainer>
  );
};
export default WholesaleDatagridFooter;
