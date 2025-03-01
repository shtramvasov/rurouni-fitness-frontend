import { useState, useEffect } from 'react';
import { useNavigate, matchPath, useLocation } from 'react-router-dom'
import { Box, Button, Grid2, Typography, useTheme, useMediaQuery, IconButton, SwipeableDrawer, Divider } from '@mui/material';
import { Menu, CloseRounded } from '@mui/icons-material';
import { ROUTES } from '@constants/routes.constants';
import { ProfileMenu } from '@components';


function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()

  const isDesktopScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(true)

  // Функция для проверки, активен ли маршрут
  const isRouteActive = (route) => {
    return route.PATH === ROUTES.DASHBOARD.PATH
      ? location.pathname === route.PATH
      : matchPath({ path: route.PATH, end: false }, location.pathname);
  }

  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [location.key])


  return (
    <Box>
      <Grid2 container alignItems='center' spacing={6}>
        <Typography color={theme.palette.gray[700]} variant='h6'>Rurouni Fitness</Typography>

        {isDesktopScreen ? (
          <>
            <Box display='flex' gap={1}>
            {Object.values(ROUTES).map(route =>  {
              if(route.HIDDEN_NAV) return;
              const isActive = isRouteActive(route)

              return (
                <Button 
                  key={route.PATH} 
                  onClick={() => !route.IN_DEVELOPEMENT && navigate(route.PATH)} 
                  variant='text' 
                  color='info' 
                  size='small'
                  sx={{
                    color:      route.IN_DEVELOPEMENT ? theme.palette.grey[400] : 'default',
                    bgcolor:    isActive ? theme.palette.brand[100] : route.IN_DEVELOPEMENT ? theme.palette.grey[100] : null,
                    border:     isActive && `1px solid ${theme.palette.brand[200]}`,
                    fontWeight: isActive && 600,

                    '&:hover': { bgcolor: isActive ? theme.palette.brand[100] : route.IN_DEVELOPEMENT ? theme.palette.gray[100]  : 'white' }
                  }}
                >
                  {route.NAME}
                </Button>
              )
            })}
            </Box>

            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1.5, flex: 1, justifyContent: 'flex-end'}}>
              <ProfileMenu />
              <Button onClick={() => navigate(ROUTES.ADD_WORKOUT.PATH)} variant='contained' color='primary' size='small'>
                {ROUTES.ADD_WORKOUT.NAME}
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1.5, flex: 1, justifyContent: 'flex-end'}}>
            <ProfileMenu />
            <IconButton onClick={() => setIsMobileNavOpen(true)} size='small'><Menu /></IconButton>
          </Box>
        )}
      </Grid2>  

      {/* Свипер для мобильной навигации */}
      <SwipeableDrawer
        anchor='right'
        onOpen={() => {}}
        open={isMobileNavOpen && !isDesktopScreen}
        onClose={() => setIsMobileNavOpen(false)}
      >
        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', flex: 1, bgcolor: theme.palette.gray[50], px: 2.1, py: 1.7 }}>
          <Grid2 container>
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
              <IconButton onClick={() => setIsMobileNavOpen(false)} size='small'> <CloseRounded /></IconButton>
            </Box>
         </Grid2>

          <Grid2 container sx={{ flexDirection: 'column', gap: 0.3, minWidth: '20rem'}}>
            {Object.values(ROUTES).map(route =>  {
              if(route.HIDDEN_NAV) return;
              const isActive = isRouteActive(route)

              return (
                <Typography 
                  key={route.PATH} 
                  onClick={() => !route.IN_DEVELOPEMENT && navigate(route.PATH)} 
                  sx={{
                    cursor: 'pointer',
                    py: 1.5,
                    px: 3,
                    borderRadius: 1,
                    bgcolor:    isActive && theme.palette.brand[50],
                    border:     isActive && `1px solid ${theme.palette.gray[200]}`,
                    fontWeight: isActive ? 600 : 500,
                    color:      route.IN_DEVELOPEMENT ? theme.palette.gray[400] : theme.palette.gray[600], 

                    '&:hover': { bgcolor: isActive ? theme.palette.brand[50] : route.IN_DEVELOPEMENT ? null : theme.palette.gray[100] }
                  }}
                >
                  {route.NAME}                
                </Typography>
              )
            })}
          </Grid2>
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'end', gap: 3 }}>
              <Divider flexItem />
              <Button onClick={() => navigate(ROUTES.ADD_WORKOUT.PATH)} fullWidth variant='contained' color='primary' size='small'>
                {ROUTES.ADD_WORKOUT.NAME}
              </Button>
          </Box>
        </Box>
      </SwipeableDrawer>
    </Box>
  )
}

export default Navigation