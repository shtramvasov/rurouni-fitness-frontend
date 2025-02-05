import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { getExerciseDetails } from "@store/slices/Exercises/exercises.thunks";
import { isLoading, isSuccess, isFailed } from "@constants/redux.constants";
import { Grid2, Card, Box, Typography, useTheme } from "@mui/material";
import { ExerciseStats } from "./components";

function ExerciseDetail() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id: params_id } = useParams()
  const theme = useTheme()

  const { exerciseDetails } = useSelector(state => state.exercises)


  useEffect(() => {
    dispatch(getExerciseDetails(params_id))
  } ,[])
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ExerciseStats />
    </Box>
  )
}

export default ExerciseDetail