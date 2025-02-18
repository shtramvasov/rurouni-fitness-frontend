import { Grid2 } from "@mui/material";
import { WorkoutsGraphs, TrainingPrograms } from "./components";

function Dashboard() {

  return (
      <Grid2 container sx={{ flexDirection: 'row' }} spacing={2.5}>
        <WorkoutsGraphs />
        <TrainingPrograms />
      </Grid2>
  )
}

export default Dashboard