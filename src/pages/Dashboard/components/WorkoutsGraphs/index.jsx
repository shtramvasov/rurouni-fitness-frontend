import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Grid2, CircularProgress, useTheme, Typography } from "@mui/material";
import { getWorkoutsList } from "@store/slices/Workouts/workouts.thunks";
import { getMuscleGroupUsedCount } from "@store/slices/Exercises/exercises.thunks";
import { isLoading, isLoaded, isFailed } from "@constants/redux.constants";
import dayjs from "dayjs";
import { PieChartCard, UIAlert, CustomCard } from "@components";


function WorkoutsGraphs() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { workoutsList } = useSelector(state => state.workouts)
  const { muscleGroupStats } = useSelector(state => state.exercises)

  const startOfMonth =  dayjs().startOf('month').toISOString();
  const endOfMonth =    dayjs().endOf('month').toISOString();

  useEffect(() => {
      dispatch(getWorkoutsList({ date_start_tz: startOfMonth, date_end_tz: endOfMonth }))
      dispatch(getMuscleGroupUsedCount({ date_start_tz: startOfMonth, date_end_tz: endOfMonth }))
  }, [])
  

  function loadingFallback(title) {
    return (    
        <CustomCard sx={{ p: 3, justifyContent: 'center', textAlign: 'center', gap: 3,  }}>
          {title && (<Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.gray[900] }}>{title}</Typography>)}
          <Box><CircularProgress size={55}/></Box>
        </CustomCard>   
    )
  }

  function errorFallback(title) {
    return (    
        <CustomCard sx={{ p: 3, justifyContent: 'center', textAlign: 'center', gap: 3,  }}>
          {title && (<Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.gray[900] }}>{title}</Typography>)}
          <UIAlert />
        </CustomCard>   
    )
  }

  return (
    <Grid2 container sx={{  flexDirection: 'column', pb: 2 }} spacing={3}>
      <Grid2 container spacing={2.5} sx={{ flexGrow: 1, alignItems: 'start' }}>
        {isLoading(workoutsList.loadingStatus) && (loadingFallback(`Статистика тренировок за ${dayjs(startOfMonth).format('MMMM')}`))}

        {isFailed(workoutsList.loadingStatus) && (errorFallback(`Статистика по группам мышц за ${dayjs(startOfMonth).format('MMMM')}`))}

        {isLoaded(workoutsList.loadingStatus) && (
          <PieChartCard 
            data={workoutsList.data}
            title={`Статистика тренировок за ${dayjs(startOfMonth).format('MMMM')}`}
            colors={[theme.palette.gray[300], theme.palette.gray[400], theme.palette.gray[500]]}
            showLegend
          />
        )}

        {isLoading(muscleGroupStats.loadingStatus) && (loadingFallback(`Статистика по группам мышц за ${dayjs(startOfMonth).format('MMMM')}`))}

        {isFailed(muscleGroupStats.loadingStatus) && (errorFallback(`Статистика по группам мышц за ${dayjs(startOfMonth).format('MMMM')}`))}

        {isLoaded(muscleGroupStats.loadingStatus) && (
          <PieChartCard 
            data={muscleGroupStats.data}
            title={`Статистика по группам мышц за ${dayjs(startOfMonth).format('MMMM')}`}
            colors={[
              theme.palette.brand[200], 
              theme.palette.brand[300], 
              theme.palette.brand[600], 
              theme.palette.gray[200], 
              theme.palette.gray[300], 
              theme.palette.gray[500], 
            ]}
            titleKey="muscle_group"
            showLegend
          />
        )}
      </Grid2>
      

    </Grid2>
  )
}

export default WorkoutsGraphs