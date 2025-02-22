import { Box, Grid2, useTheme, Typography } from "@mui/material";
import { useSelector } from 'react-redux'
import { CustomCard } from "@components"
import { WeightsImage, RecordImage, CupImage, CaloriesImage } from "@assets/images";


function ExerciseStats() {
  const theme = useTheme();

  const { exerciseDetails } = useSelector(state => state.exercises)
  const { current_weight, personal_record, total_calories , unit, history } = exerciseDetails.data

  const stats = [
    { image: WeightsImage,    title: "Текущий вес",       value: current_weight   ?? 0, unit },
    { image: RecordImage,     title: "Личный рекорд",     value: personal_record  ?? 0, unit },
    { image: CupImage,        title: "Всего тренировок",  value: history?.length  ?? 0 },
    { image: CaloriesImage,   title: "Калорий сгорело",   value: total_calories   ?? 0 }
  ];


  return (
    <Grid2 container spacing={3}>
      {stats.map(({ image, title, value, unit }, index) => (
        <Grid2 key={index} item size={{ lg: 3, md: 6, xs: 12 }} sx={{ flexDirection: "column" }}>
          <CustomCard sx={{ p: 2, flexDirection: "row" }}>
            <Box component="img" src={image} alt={title} sx={{ width: 75, height: 75, objectFit: "contain" }} />
            <Grid2 sx={{ mt: 1 }}>
              <Typography variant="h5" color={theme.palette.grey[700]}>{title}</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 600, color: theme.palette.brand[700] }}>
                {value} {unit ?? ""}
              </Typography>
            </Grid2>
          </CustomCard>
        </Grid2>
      ))}
    </Grid2>
  )
}

export default ExerciseStats