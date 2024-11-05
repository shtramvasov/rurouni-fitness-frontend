
import { Box } from '@mui/material'
import { Navigation } from '@components'


function ContainerWrapper({ children }) {
  
  return (
    <Box 
      sx={{ 
        p: 2,
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        gap: 2.5
      }}
    >
      <Navigation />

      <Box>
        {children}
      </Box>
    </Box>
  )
}

export default ContainerWrapper