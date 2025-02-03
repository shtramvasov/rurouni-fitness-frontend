import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getTrainingProgramsList } from "@store/slices/TrainingPrograms/training_programs.thunks";
import { Box } from "@mui/material";
import { WorkoutsGraphs } from "./components";


function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTrainingProgramsList())
  }, [])


  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <WorkoutsGraphs />
      </Box>
  )
}

export default Dashboard