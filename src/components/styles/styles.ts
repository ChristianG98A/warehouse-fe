import {makeStyles} from "@mui/material";

const useStyles = makeStyles((theme:any) => ({
  disabledTextField: {
    '& .MuiInputBase-root.Mui-disabled': {
      color: theme.palette.text.secondary, // Change this color to your desired black shade (e.g., black[200])
    },
  },
}));

export default useStyles;
