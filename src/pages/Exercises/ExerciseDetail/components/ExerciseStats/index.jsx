import { Box, Grid2, CircularProgress, useTheme, Typography } from "@mui/material";
import { useSelector } from 'react-redux'
import { CustomCard } from "@components"


function ExerciseStats() {
  const theme = useTheme();

  const { exerciseDetails } = useSelector(state => state.exercises)
  const { current_weight, personal_record, total_calories , unit, history } = exerciseDetails.data


  return (
    <Grid2 container spacing={3}>
      <Grid2 item size={{ lg: 3, md: 6, xs: 12 }} sx={{ flexDirection: 'column' }}>
        <CustomCard sx={{ p: 3, justifyContent: 'center' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.gray[900] }}>Текущий вес</Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 400, color: theme.palette.gray[500] }}>{current_weight ?? 0} {unit}</Typography>
        </CustomCard>
      </Grid2>

      <Grid2 item size={{ lg: 3, md: 6, xs: 12 }} sx={{ flexDirection: 'column' }}>
        <CustomCard sx={{ p: 3, justifyContent: 'center' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.gray[900] }}>Личный рекорд</Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 400, color: theme.palette.gray[500] }}>{personal_record ?? 0} {unit}</Typography>
        </CustomCard>
      </Grid2>

      <Grid2 item size={{ lg: 3, md: 6, xs: 12 }} sx={{ flexDirection: 'column' }}>
        <CustomCard sx={{ p: 3, justifyContent: 'center' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.gray[900] }}>Всего тренировок</Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 400, color: theme.palette.gray[500] }}>{history.length}</Typography>
        </CustomCard>
      </Grid2>

      <Grid2 item size={{ lg: 3, md: 6, xs: 12 }} sx={{ flexDirection: 'column' }}>
        <CustomCard sx={{ p: 3, justifyContent: 'center' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.gray[900] }}>Калорий сгорело</Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 400, color: theme.palette.gray[500] }}>{total_calories}</Typography>
        </CustomCard>
      </Grid2>

    </Grid2>
  )
}

export default ExerciseStats