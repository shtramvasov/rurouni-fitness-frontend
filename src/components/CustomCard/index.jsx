import { Card } from "@mui/material"


function CustomCard({ children, sx = {}, ...props }) {

  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.5s ease',
        boxShadow: (theme) => theme.shadows[1],
        "&:hover": { boxShadow: (theme) => theme.shadows[2] },
        ...sx
      }}
      {...props}
    >
      {children}
    </Card>
  )
}

export default CustomCard