'use client';

import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from './Logo';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import DiscountIcon from '@mui/icons-material/Discount';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LogoutIcon from '@mui/icons-material/Logout';
import { ROUTES } from '@/utils/paths';
import { useLogout } from '@/hooks/auth';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, href: ROUTES.DASHBOARD.HOME },
  {
    text: 'Music manager',
    icon: <MusicNoteIcon />,
    href: ROUTES.DASHBOARD.MUSIC_MANAGER.HOME,
  },
  {
    text: 'Shop manager',
    icon: <ShoppingBagIcon />,
    href: ROUTES.DASHBOARD.SHOP.HOME,
  },
  {
    text: 'Coupons',
    icon: <DiscountIcon />,
    href: ROUTES.DASHBOARD.COUPONS.HOME,
  },
  { text: 'Orders', icon: <ShoppingCartIcon />, href: ROUTES.DASHBOARD.ORDERS },
  {
    text: 'Shipping Zones',
    icon: <LocationOnIcon />,
    href: ROUTES.DASHBOARD.SHIPPING_ZONES.HOME,
  },
  {
    text: 'Blackbox',
    icon: <SportsEsportsIcon />,
    href: ROUTES.DASHBOARD.BLACKBOX.HOME,
  },
  {
    text: 'Countdown',
    icon: <AccessTimeIcon />,
    href: ROUTES.DASHBOARD.COUNTDOWN.HOME,
  },
  { text: 'Users', icon: <PeopleIcon />, href: ROUTES.DASHBOARD.USERS },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const logout = useLogout();
  const isDashboardHome = pathname === ROUTES.DASHBOARD.HOME;

  return (
    <Box
      sx={{
        width: 250,
        height: '100vh',
        bgcolor: '#f9f9f9',
        borderRight: '1px solid #eaeaea',
        position: 'fixed',
        left: 0,
        top: 0,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Logo />
      </Box>

      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              href={item.href}
              selected={
                isDashboardHome
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
              }
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  bgcolor: '#2FD65D',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#2AC152',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <ListItem disablePadding>
        <ListItemButton
          component={Link}
          href="/login"
          onClick={() => {
            logout.mutate();
          }}
          sx={{
            borderRadius: 1,
            color: 'text.secondary',
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Log out" />
        </ListItemButton>
      </ListItem>
    </Box>
  );
};
