import { Box } from "@mui/material";
import { ContainerWrapper } from "@components";
import { ProgramsList } from "./components";


function Programs() {

  return (
    <ContainerWrapper>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ProgramsList />
      </Box>
    </ContainerWrapper>
  )
}

export default Programs