import { Box, Grid2, useTheme, Typography } from "@mui/material";
import { useSelector } from 'react-redux'
import { CustomCard } from "@components"
import { WeightsImage, RecordImage, CupImage, CaloriesImage } from "@assets/images";


function ExerciseStats() {
  const theme = useTheme();

  const { exerciseDetails } = useSelector(state => state.exercises)
  const { current_weight, personal_record, total_calories , unit, history } = exerciseDetails.data


  return (
    <Grid2 container spacing={3}>
      <Grid2 item size={{ lg: 3, md: 6, xs: 12 }} sx={{ flexDirection: 'column' }}>
        <CustomCard sx={{ p: 2, flexDirection: 'row' }}>
          <Box component="img" src={WeightsImage} alt="Текущий вес" sx={{ width: 75, height: 75, objectFit: 'contain' }} />
          <Grid2 sx={{ mt: 1 }} >
            <Typography variant="h5">Текущий вес</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: theme.palette.brand[500] }}>{current_weight ?? 0} {unit}</Typography>
          </Grid2>
        </CustomCard>
      </Grid2>

      <Grid2 item size={{ lg: 3, md: 6, xs: 12 }} sx={{ flexDirection: 'column' }}>
        <CustomCard sx={{ p: 2, flexDirection: 'row' }}>
          <Box component="img" src={RecordImage} alt="Личный рекорд" sx={{ width: 75, height: 75, objectFit: 'contain' }} />
          <Grid2 sx={{ mt: 1 }} >
            <Typography variant="h5">Личный рекорд</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: theme.palette.brand[500] }}>{personal_record ?? 0} {unit}</Typography>
          </Grid2>
        </CustomCard>
      </Grid2>

      <Grid2 item size={{ lg: 3, md: 6, xs: 12 }} sx={{ flexDirection: 'column' }}>
        <CustomCard sx={{ p: 2, flexDirection: 'row' }}>
          <Box component="img" src={CupImage} alt="Всего тренировок" sx={{ width: 75, height: 75, objectFit: 'contain' }} />
          <Grid2 sx={{ mt: 1 }} >
            <Typography variant="h5">Всего тренировок</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: theme.palette.brand[500] }}>{history?.length ?? 0} </Typography>
          </Grid2>
        </CustomCard>
      </Grid2>

      <Grid2 item size={{ lg: 3, md: 6, xs: 12 }} sx={{ flexDirection: 'column' }}>
        <CustomCard sx={{ p: 2, flexDirection: 'row' }}>
          <Box component="img" src={CaloriesImage} alt="Калорий сгорело" sx={{ width: 75, height: 75, objectFit: 'contain' }} />
          <Grid2 sx={{ mt: 1 }} >
            <Typography variant="h5">Калорий сгорело</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: theme.palette.brand[500] }}>{total_calories ?? 0}</Typography>
          </Grid2>
        </CustomCard>
      </Grid2>

    </Grid2>
  )
}

export default ExerciseStats