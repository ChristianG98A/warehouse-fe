"use client"

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BusinessIcon from '@mui/icons-material/Business';
import InventoryIcon from '@mui/icons-material/Inventory';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ScienceIcon from '@mui/icons-material/Science';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Avatar, Fade, ListSubheader, Menu, MenuItem, Tooltip} from '@mui/material';
import SidebarListDropdown from '../common/SidebarListDropdown';

const drawerWidth = 260;

const settings = ['Profile', 'Logout'];

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
}

export default function SideDrawer(props: Props) {
    const {window} = props;
    const [open, setOpen] = React.useState(true);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                <Fade in={open}>
                    <ListSubheader children={"MAGAZIN"} />
                </Fade>
                <SidebarListDropdown item="Achizitii" index={1}
                    menuItems={[
                        {name: 'Comenzi Furnizori', link: "/achizitii/comenzi_furnizori"}]
                    }
                    icon={<ShoppingCartIcon />}
                />

                <SidebarListDropdown item="Wholesale" index={2}
                    menuItems={[
                        {name: 'Comenzi', link: '/wholesale/comenzi'},
                        {name: 'Export produse', link: '/wholesale/export_produse'},
                        {name: 'Clienti', link: "/wholesale/clienti"}]}
                    icon={<BusinessIcon />}
                />

                <SidebarListDropdown item="Depozit" index={3}
                    menuItems={[
                        {name: 'Receptie Marfa', link: '/depozit/receptie_marfa'},
                        {name: 'Transfer Marfa', link: '/depozit/transfer_marfa'},
                    ]}
                    icon={<InventoryIcon  />}
                />

                <SidebarListDropdown item="Produse" index={3}
                    menuItems={[
                        {name: 'Lista Produse', link: '/produse/lista_produse'},
                    //    {name: 'Transfer Marfa', link: '/depozit/transfer_marfa'},
                    ]}
                    icon={<ScienceIcon />}
                />
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: {lg: `calc(100% - ${drawerWidth}px)`, },
                    ml: {lg: `${drawerWidth}px`, md:`${drawerWidth}px`},
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {lg: 'none' }}}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            ml: 6,
                            display: {xs: 'none', md: 'flex', lg:'flex'},
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        ROMSCENT
                    </Typography>
                    <Box display={"flex"} alignItems={"center"} flexDirection={"row"} sx={{flexGrow: 0, marginLeft: "auto", paddingRight: "10%"}}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <Avatar alt="CurrentUser" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Typography noWrap variant='h6' sx={{ml: 3}}>{"Silvia"}</Typography>
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>


                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{width: {lg: drawerWidth }, flexShrink: {sm: 0, md: 0}}}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'block', md:'block', lg:'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', sm: 'none', md:'none', lg:'block'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}
