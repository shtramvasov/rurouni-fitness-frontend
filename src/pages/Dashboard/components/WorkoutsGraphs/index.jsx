import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom";
import { Grid2, useTheme } from "@mui/material";
import { getWorkoutsList } from "@store/slices/Workouts/workouts.thunks";
import { getMuscleGroupUsedCount } from "@store/slices/Exercises/exercises.thunks";
import { PieChartCard } from "@components";
import { clearWorkoutsList } from "@store/slices/Workouts/workouts.slice";
import { getChartTitle } from "@helpers/getChartTitle";


function WorkoutsGraphs() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [searchParams, setSearchParams] = useSearchParams();

  const { workoutsList } = useSelector(state => state.workouts)
  const { muscleGroupStats } = useSelector(state => state.exercises)


  useEffect(() => {
    dispatch(getWorkoutsList({  date_start_tz: searchParams.get('date_start_tz'), date_end_tz: searchParams.get('date_end_tz') }))
    dispatch(getMuscleGroupUsedCount({ date_start_tz: searchParams.get('date_start_tz'), date_end_tz: searchParams.get('date_end_tz') }))

    return () => {
      dispatch(clearWorkoutsList())
    }
  }, [searchParams])

  const resetFilter = () => {
    searchParams.delete("date_start_tz");
    searchParams.delete("date_end_tz");

    setSearchParams(searchParams);
  }

  return (
    <Grid2 size={{ lg: 6, xs: 12 }} sx={{ alignItems: 'start', order: { xs: 2, lg: 1 } }}>
        <PieChartCard 
          data={workoutsList.data}
          getData={getWorkoutsList()}
          title={getChartTitle('Тренировки')}
          loadingState={workoutsList.loadingStatus}
          resetFilter={resetFilter}
          colors={[theme.palette.gray[300], theme.palette.gray[400], theme.palette.gray[500]]}
        />
        <PieChartCard 
          data={muscleGroupStats.data}
          loadingState={muscleGroupStats.loadingStatus}
          resetFilter={resetFilter}
          title={getChartTitle('Работа по группам мышц')}
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