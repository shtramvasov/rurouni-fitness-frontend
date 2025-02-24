import { Box, Alert, AlertTitle, Typography } from "@mui/material"


function UIAlert({ severity = 'error', title = 'Произошла ошибка', description}) {
  return (
    <Box sx={{ width: '100%' }}>
        <Alert severity={severity}>
          <AlertTitle>{title}</AlertTitle>
          <Typography sx={{ textAlign: 'left' }}>{ description }</Typography>
        </Alert>
    </Box>
  )
}

export default UIAlert