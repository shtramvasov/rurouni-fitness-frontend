import { SearchSection, ListSection } from "./components";
import { Box } from "@mui/material";


function ExerciseList() {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <SearchSection />
      <ListSection />
    </Box>
  )
}

export default ExerciseList