import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { getExercisesList } from "@store/slices/Exercises/exercises.thunks";
import { isLoading, isSuccess, isFailed } from "@constants/redux.constants";
import { Grid2, Card, Box, Typography, useTheme, LinearProgress } from "@mui/material";
import { UIAlert } from "@components";
import { ROUTES } from "@constants/routes.constants";
import useDebounce from "@hooks/useDebounce";
import { ChevronRightRounded } from "@mui/icons-material";



function ListSection() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const theme = useTheme()

  const { exercisesList } = useSelector(state => state.exercises)

  const debouncedSearch = useDebounce(searchParams, 500);

  useEffect(() => {
    dispatch(getExercisesList({ params: { 
      search:  searchParams.get("search"),
      order:   searchParams.get("order")
    }})
    )} , [debouncedSearch])


  // Обработка загрузки списка упражнений
  if(isLoading(exercisesList.loadingStatus)) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress sx={{ height: 5, zIndex: 100 }} color='info' />
      </Box>
    )
  }

  // Обработка ошибки при запросе
  if(isFailed(exercisesList.loadingStatus)) {
    return (
      <UIAlert description='Не удалось загрузить список упражнений. Пожалуйста, проверьте подключение к сети и попробуйте снова.' />
    )
  }

  // Если данных не найдено
  if(isSuccess(exercisesList.loadingStatus) && !exercisesList.data.length) {
    return (
      <UIAlert 
        severity="warning"
        title='Результаты не найдены'
        description='По вашему запросу не удалось найти упражнения. Попробуйте изменить параметры поиска и выполните запрос снова.'
      />
    )
  }

  return (
    <Grid2 container spacing={2.5}>
      {exercisesList.data.map(exercise => (
        
        <Grid2 key={exercise.exercise_id} size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
          <Card 
            variant="outlined"  
            onClick={() => navigate(`${ROUTES.EXERCISES.PATH}/${exercise.exercise_id}`)}
            sx={{ 
              display: 'flex',
              flexDirection: 'column',         
              p: 3, 
              minHeight: '100%',
              justifyContent: 'center',
              gap: 0.8,
              textAlign: 'center', 
              cursor: 'pointer',
              transition: "box-shadow 0.5s ease",
              boxShadow: theme.shadows[1],
              "&:hover": { boxShadow: theme.shadows[2] },
              "&:hover .exercise-name": { color: theme.palette.brand[400] },
            }}
          >
            <Typography sx={{ transition: "color 0.5s ease" }} className="exercise-name" variant="h5">{exercise.name}</Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center', alignSelf: 'center'  }} variant="caption" fontWeight={300}>
              Группа мышц
              <ChevronRightRounded sx={{ fontSize: 20, fill: theme.palette.brand[700] }} />
              <Typography variant="caption" color={theme.palette.gray[700]} fontWeight={600}>{exercise.muscle_group}</Typography>
            </Typography>       
          </Card>
        </Grid2>        
      ))}
    </Grid2>
  )
}

export default ListSection