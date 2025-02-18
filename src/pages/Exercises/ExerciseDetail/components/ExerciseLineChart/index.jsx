import { Grid2, useTheme } from "@mui/material";
import { useSelector } from 'react-redux'
import { LineChartCard } from "@components";


function ExerciseLineChart() {
  const theme = useTheme();

  const { exerciseDetails } = useSelector(state => state.exercises)
  const { name, history } = exerciseDetails.data

  return (
    <Grid2 container spacing={2.5} sx={{ flexGrow: 1, alignItems: 'start' }}>
      <LineChartCard 
        data={history}
        title={name}
        loadingState={exerciseDetails.loadingStatus}
        colors={[theme.palette.brand[400]]}
        xAxisKey='created_on_tz'
        yAxisKey='weight'
        valueIsNumber
      />
    </Grid2>
  )
}

export default ExerciseLineChart