import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getWorkoutsList } from "@store/slices/Workouts/workouts.thunks";
import { Box } from "@mui/material";


function Workouts() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getWorkoutsList())
  }, [])


  return (
    <Box>
      Workouts
    </Box>
  )
}

export default Workouts