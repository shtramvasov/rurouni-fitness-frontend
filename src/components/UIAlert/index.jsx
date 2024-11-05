import {  Box, Alert, AlertTitle } from "@mui/material"


function UIAlert({ severity = 'error', title = 'Произошла ошибка', description}) {
  return (
    <Box sx={{ width: '100%' }}>
        <Alert severity={severity}>
          <AlertTitle>{title}</AlertTitle>
          { description }
        </Alert>
      </Box>
  )
}

export default UIAlert