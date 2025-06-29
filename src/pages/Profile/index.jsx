import { useState } from "react";
import { Box, Grid2, MenuItem, Typography, useTheme } from "@mui/material";
import { AccountCircleOutlined, NotificationsOutlined, LockOutlined  } from "@mui/icons-material";
import { ProfileCard, SecurityCard, NotificationCard } from "./components";


function Profile() {
  const theme = useTheme()

  const [selectedTab, setSelectedTab] = useState('profile')

  const MENU_OPTIONS = [
    { title: 'Профиль',       icon: <AccountCircleOutlined  sx={{ fontSize: 20 }} />,  value: 'profile'},
    { title: 'Оповещения',    icon: <NotificationsOutlined  sx={{ fontSize: 20 }} />,  value: 'notifications' },
    { title: 'Безопасность',  icon: <LockOutlined           sx={{ fontSize: 20 }} />,  value: 'security'},
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: { xs: 0.5, lg: '2rem 3.5rem' } }}>
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, lg: 2 }} item sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography sx={{ color: theme.palette.grey[500] }} variant="caption">Настройки</Typography>

          <Grid2 container sx={{ gap: 1 }}>
            {MENU_OPTIONS.map(option => {
              const isSelected = option.value === selectedTab

              return(
                <MenuItem
                  selected={isSelected}
                  disabled={option.in_developement}
                  onClick={() => setSelectedTab(option.value)}
                  sx={{ 
                    py: 1.25, 
                    display: 'flex', 
                    width: '100%', 
                    alignItems: 'center', 
                    gap: 1, 
                    fontWeight:   isSelected ? 500 : 400,
                    color:        isSelected ? theme.palette.brand[800] : theme.palette.grey[500],
                  }}
                >
                  {option.icon}
                  {option.title}
                </MenuItem>
              )
            }
            )}
          </Grid2>
        </Grid2>

        <Grid2 size={{ xs: 12, lg: 10 }} item>
          { selectedTab === 'profile'         && <ProfileCard /> }
          { selectedTab === 'notifications'   && <NotificationCard /> }
          { selectedTab === 'security'        && <SecurityCard /> }
        </Grid2>
      </Grid2>
    </Box>
  )
}


export default Profile;