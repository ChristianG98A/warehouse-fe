import {ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

export default function SidebarListItem(props:{index:number, item:string, link:string|null}){
        return(
            <ListItem key={props.index} disablePadding>
                <ListItemButton>
                    {/*/ buuuuuuullshiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiit*/}
                    <ListItemIcon>
                        {props.index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={props.item} />
                </ListItemButton>
            </ListItem>
        )
    }
