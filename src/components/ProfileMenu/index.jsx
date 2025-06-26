import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Box, Grid2, Divider, IconButton, Menu, MenuItem, Typography, Avatar, useTheme } from "@mui/material"
import { Logout as LogoutIcon, Person, Settings } from '@mui/icons-material';
import { logout } from "@store/slices/Auth/auth.thunks";
import { capitalizeFirstLetter } from "@helpers/capitalizeFirstLetter";

function ProfieMenu() {
  const dispatch = useDispatch()
  const theme = useTheme()

  const { user } = useSelector(state => state.auth)

  const [profileMenu, setProfileMenu] = useState({ anchor: null, isOpen: false })

  const username = user.display_name ?? user.username;


  return (
    <Box>
      <IconButton onClick={(e) => setProfileMenu({ anchor: e.currentTarget, isOpen: !profileMenu.isOpen })}  size='small'><Person /></IconButton>

      <Menu
        anchorEl={profileMenu.anchor}
        open={profileMenu.isOpen}
        onClose={() => setProfileMenu({ anchor: null, isOpen: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Grid2 container sx={{ flexDirection: 'column', p: 0.5 , minWidth: '12rem'}} spacing={0.5}>
          <Grid2 container sx={{ justifyContent: 'center', textAlign: 'center' }}>
            <Grid2 sx={{ display: 'flex', alignItems: 'center',  flexDirection: 'column', gap: 1 }}>
              <Typography variant="body1" fontWeight={500} sx={{ color: theme.palette.grey[800] }} >{capitalizeFirstLetter(username)}</Typography>
              <Avatar src={user.avatar_url} sx={{ bgcolor: theme.palette.primary.main }} alt={username}>{capitalizeFirstLetter(username.charAt(0))}</Avatar>
              <Typography variant="caption" fontWeight={300} sx={{ color: theme.palette.grey[400] }} >{user.email}</Typography>
            </Grid2>
          </Grid2>
          <Divider flexItem/>
          <MenuItem 
              sx={{ py: 1.25, display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.grey[600] }}
              // onClick={() => dispatch(logout())} 
            >
              <Settings sx={{ fontSize: 18 }} />
              Настройки
          </MenuItem>

          <MenuItem 
              sx={{ py: 1.25, display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.red[300] }}
              onClick={() => dispatch(logout())} 
            >
              <LogoutIcon sx={{ fontSize: 18 }} />
              Выйти
          </MenuItem>
        </Grid2>
      </Menu>

    </Box>
  )
}

export default ProfieMenu