import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getTrainingProgramsList } from "@store/slices/TrainingPrograms/training_programs.thunks";
import { getWorkoutsList } from "@store/slices/Workouts/workouts.thunks";
import { Box } from "@mui/material";


function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTrainingProgramsList())
    dispatch(getWorkoutsList())
  }, [])


  return (
      <Box>
        Dashboard
      </Box>
  )
}

export default Dashboard