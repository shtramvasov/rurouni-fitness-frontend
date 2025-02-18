import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { getExerciseDetails } from "@store/slices/Exercises/exercises.thunks";
import { Box } from "@mui/material";
import { ExerciseStats, ExerciseLineChart } from "./components";

function ExerciseDetail() {
  const dispatch = useDispatch()
  const { id: params_id } = useParams()

  useEffect(() => {
    dispatch(getExerciseDetails(params_id))
  } ,[])
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <ExerciseStats />
      <ExerciseLineChart />
    </Box>
  )
}

export default ExerciseDetail