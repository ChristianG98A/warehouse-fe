"use client"
import {Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import React, {ReactElement} from "react";
import {redirect} from "next/dist/server/api-utils";
import Link from "next/link";
import {useRouter} from "next/navigation";

interface SidebarDDMenuItem {
    name: string;
    link: string
}

export default function SidebarListDropdown(props: {index: number, item: string, menuItems:SidebarDDMenuItem[], icon:ReactElement}) {
    const [openSubMenu, setOpenSubMenu] = React.useState(false);
    const router = useRouter();

    const handleSubMenuClick = () => {
        setOpenSubMenu(!openSubMenu);
    };

        return(
            <>
                <ListItem key={props.item} disablePadding>
                    <ListItemButton onClick={handleSubMenuClick}>
                        <ListItemIcon>
                            {props.icon}
                        </ListItemIcon>
                        <ListItemText primary={props.item} />
                        {openSubMenu ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                </ListItem>

                <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {props.menuItems.map((item, index) => (
                            <ListItemButton onClick={() => {
                                router.push(item.link)
                            }} key={"KeyY2" + item.name}>
                                    <ListItem sx={{pl: 9}} key={"Key" + item.name}>
                                        <ListItemText primary={item.name} />
                                    </ListItem>
                                </ListItemButton>
                        ))}
                    </List>
                </Collapse>

            </>

        )
    }
