import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Grid2, useTheme } from "@mui/material";
import { getWorkoutsList } from "@store/slices/Workouts/workouts.thunks";
import { getMuscleGroupUsedCount } from "@store/slices/Exercises/exercises.thunks";
import dayjs from "dayjs";
import { PieChartCard } from "@components";


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
  

  return (
    <Grid2 size={{ lg: 6, xs: 12 }} sx={{ alignItems: 'start', order: { xs: 2, lg: 1 } }}>
        <PieChartCard 
          data={workoutsList.data}
          title={`Статистика тренировок за ${dayjs(startOfMonth).format('MMMM')}`}
          loadingState={workoutsList.loadingStatus}
          colors={[theme.palette.gray[300], theme.palette.gray[400], theme.palette.gray[500]]}
        />
        <PieChartCard 
          data={muscleGroupStats.data}
          loadingState={muscleGroupStats.loadingStatus}
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
          valueKey='count'
        />
    </Grid2>
  )
}

export default WorkoutsGraphs