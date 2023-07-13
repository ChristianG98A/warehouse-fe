import {Drawer, Typography} from "@mui/material";

export default function CustomDrawer (){
        return(
          <Drawer
            style={{width:260}}
            variant="permanent"
            anchor="left"
          >
            <div>
              <Typography variant="h5">Sa mearga dreq</Typography>
            </div>
          </Drawer>
        )
    }
