"use client"

import * as React from 'react';
import {styled, useTheme, Theme, CSSObject} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import {Avatar, Fade, ListSubheader, Menu, MenuItem, Tooltip} from '@mui/material';
import SidebarListDropdown from '../common/SidebarListDropdown';
import SidebarListItem from '../common/SidebarListItem';

const drawerWidth = 280;
const settings = ['Profile', 'Logout'];

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleCloseUserMenu = () => {
      setAnchorElUser(null);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
                <Toolbar>

                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{marginRight:5, ...(open && {display: 'none'})}}
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
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        ROMSCENT
                    </Typography>

                    {/*USER AVATAR (ON THE RIGHT)*/}
                    <Box display={"flex"} alignItems={"center"} flexDirection={"row"} sx={{flexGrow: 0, marginLeft: "auto", paddingRight: "10%"}}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <Avatar alt="CurrentUser" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Typography noWrap variant='h6' sx={{ml:3}}>{"Silvia"}</Typography>
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
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
                <List>
                    <ListItem key={"Dashboard"} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <MailIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Dashboard'} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />

                <List>
                <Fade in={open}>
                    <ListSubheader children={"DEPOZIT"} />
                </Fade>
                    <SidebarListDropdown item="Receptie marfa" index={1}
                            menuItems={[
                            {name: 'Comenzi Furnizori', link:"/receptie_marfa/comenzi_furnizori"}]
                            }/>
                    <SidebarListItem item='Comenzi in astepare' link='#' index={2}/>
                    <SidebarListItem item='Produse in asteptare' link='#' index={3}/>
                    <SidebarListItem item='Borderouri' link='#' index={4}/>

                    <SidebarListDropdown item="Wholesale" index={9}
                            menuItems={[
                            {name:'Comenzi', link:'/wholesale/comenzi'},
                            {name:'Export produse', link:'/wholesale/export_produse'},
                            {name: 'Clienti', link:"/wholesale/clienti"}]}/>

                    <SidebarListDropdown item="Inventare"  index={8}
                            menuItems={[
                            {
                                name:'Inventar general',
                                link:'/inventar/inventar_general'
                            },
                            {
                                name:'Inventar producator',
                            link:'/inventar/inventar_producator'}
                            ]}/>

                    <SidebarListItem item='Achizitii' link='#' index={7}/>
                </List>

                <Divider />

                <List>

                <Fade in={open}>
                    <ListSubheader children={"PARTENERI"} />
                </ Fade>
                    {['Amazon', 'eMag'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider />

                <List>
                <Fade in={open}>
                    <ListSubheader children={"MAGAZIN"} />
                </ Fade>
                    {['Produse', 'Promotii'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
      </Drawer>
    </Box>
  );
}

