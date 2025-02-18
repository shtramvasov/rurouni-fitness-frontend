import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Grid2, CircularProgress, useTheme, Typography } from "@mui/material";
import { getWorkoutsList } from "@store/slices/Workouts/workouts.thunks";
import { getMuscleGroupUsedCount } from "@store/slices/Exercises/exercises.thunks";
import { isLoading, isLoaded, isFailed } from "@constants/redux.constants";
import dayjs from "dayjs";
import { PieChartCard } from "@components";
import { getTrainingProgramsList } from "@store/slices/TrainingPrograms/training_programs.thunks";
import { CustomCard } from "@components/index";


function TrainingPrograms() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { trainingProgramsList } = useSelector(state => state.trainingPrograms)

  console.log('t', trainingProgramsList)

  useEffect(() => {
    dispatch(getTrainingProgramsList())
  }, [])
  

  return (
    <Grid2 size={{ lg: 6, xs: 12 }} spacing={3} sx={{ flexDirection: 'column', alignItems: 'start', pb: 2 }}>
      <CustomCard 
        sx={{  
          p: 3, 
          width: "100%",
          minHeight: '100%',
          justifyContent: 'center',
          gap: 0,
          textAlign: 'center', 
          boxShadow: theme.shadows[1],
          "&:hover": { boxShadow: theme.shadows[2] }
        }}
      >
        
      </CustomCard>
    </Grid2>
  )
}

export default TrainingPrograms