import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Box, Grid2, Divider, IconButton, Menu, MenuItem, Typography, useTheme } from "@mui/material"
import { Person } from '@mui/icons-material';
import { logout } from "@store/slices/Auth/auth.thunks";

function ProfieMenu() {
  const dispatch = useDispatch()
  const theme = useTheme()

  const { user } = useSelector(state => state.auth)

  const [profileMenu, setProfileMenu] = useState({ anchor: null, isOpen: false })


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
          <Typography variant="caption" sx={{ p: 1, fontWeight: 500, color: theme.palette.gray[800] }}>
            Ваш профиль, <b>{user.display_name || user.username}</b>
          </Typography>
          <Divider flexItem/>

          <MenuItem 
              sx={{ py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: theme.palette.red[300] }}
              onClick={() => dispatch(logout())} 
            >
              Выйти
          </MenuItem>
        </Grid2>
      </Menu>

    </Box>
  )
}

export default ProfieMenu