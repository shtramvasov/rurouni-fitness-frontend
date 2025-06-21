import { Box } from "@mui/material";
import { ProgramsList, SearchSection } from "./components";


function Programs() {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <SearchSection />
      <ProgramsList />
    </Box>
  )
}

export default Programs