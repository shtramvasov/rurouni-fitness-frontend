import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom";
import { Grid2, useTheme } from "@mui/material";
import { getWorkoutsList } from "@store/slices/Workouts/workouts.thunks";
import { getMuscleGroupUsedCount } from "@store/slices/Exercises/exercises.thunks";
import dayjs from "dayjs";
import { PieChartCard } from "@components";
import { clearWorkoutsList } from "@store/slices/Workouts/workouts.slice";


function WorkoutsGraphs() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [searchParams, setSearchParams] = useSearchParams();

  const { workoutsList } = useSelector(state => state.workouts)
  const { muscleGroupStats } = useSelector(state => state.exercises)

  const dateStart = searchParams.get("date_start_tz") || dayjs().startOf('month').startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]');
  const dateEnd = searchParams.get("date_end_tz") || dayjs().endOf('month').add(1, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]');
 
  const getTitle = (text) => {
    const startDate = dayjs(dateStart);
    const endDate = dayjs(dateEnd);
  
    // Проверка, если даты лежат в одном месяце
    const isSameMonth = startDate.isSame(endDate, "month");
  
    // Проверка, если период полный (с 1 числа месяца до последнего)
    const isFullMonth = startDate.date() === 1 && endDate.date() === endDate.daysInMonth();
  
    // Проверка, если начало периода с 1 числа месяца и конец периода с 1 числа следующего месяца
    const isStartOfMonthToStartOfNextMonth = startDate.date() === 1 && endDate.date() === 1 && startDate.month() !== endDate.month();
  
    // Если начало и конец в одном месяце и полный месяц
    if (isFullMonth) {
      return `${text} за ${startDate.format("MMMM")}`;
    }
  
    // Если начало с 1 числа месяца, а конец с 1 числа следующего месяца
    if (isStartOfMonthToStartOfNextMonth) {
      return `${text} за ${startDate.format("MMMM")}`;  // Показать только месяц начала
    }
  
    // Если частичный месяц (например с 1 по 10 число)
    if (isSameMonth && startDate.date() !== 1 && endDate.date() !== endDate.daysInMonth()) {
      return `${text} за период с ${startDate.format("D MMMM YYYY")} по ${endDate.format("D MMMM YYYY")}`;
    }
  
    // Для всех других случаев, когда даты не в одном месяце
    return `${text} за период с ${startDate.format("D MMMM YYYY")} по ${endDate.format("D MMMM YYYY")}`;
  };

  useEffect(() => {
    dispatch(getWorkoutsList({  date_start_tz: dateStart, date_end_tz: dateEnd }))
    dispatch(getMuscleGroupUsedCount({ date_start_tz: dateStart, date_end_tz: dateEnd }))

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
          title={getTitle('Тренировки')}
          loadingState={workoutsList.loadingStatus}
          resetFilter={resetFilter}
          colors={[theme.palette.gray[300], theme.palette.gray[400], theme.palette.gray[500]]}
        />
        <PieChartCard 
          data={muscleGroupStats.data}
          loadingState={muscleGroupStats.loadingStatus}
          resetFilter={resetFilter}
          title={getTitle('Работа по группам мышц')}
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