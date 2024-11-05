import { ContainerWrapper } from "@components";
import { SearchSection, ListSection } from "./components";
import { Box } from "@mui/material";


function ExerciseList() {

  return (
    <ContainerWrapper>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <SearchSection />
        <ListSection />
      </Box>
    </ContainerWrapper>
  )
}

export default ExerciseList