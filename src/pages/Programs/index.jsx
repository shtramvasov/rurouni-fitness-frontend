import { Box } from "@mui/material";
import { ProgramsList } from "./components";


function Programs() {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ProgramsList />
    </Box>
  )
}

export default Programs