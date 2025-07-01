import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { getExercisesList } from "@store/slices/Exercises/exercises.thunks";
import { PAGINATION, isLoading, isSuccess, isFailed } from "@constants/redux.constants";
import { Grid2, Typography, useTheme, Button, Divider, useMediaQuery, Chip } from "@mui/material";
import { UIAlert, CustomCard, ListSkeleton } from "@components";
import { ROUTES } from "@constants/routes.constants";
import useDebounce from "@hooks/useDebounce";
import dayjs from "dayjs";
import { capitalizeFirstLetter } from "@helpers/capitalizeFirstLetter";


function ListSection() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()

  const [searchParams] = useSearchParams();

  const { exercisesList } = useSelector(state => state.exercises)

  const isDesktopScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const debouncedSearch = useDebounce(searchParams.get('search'), 500);

  const loadExercises  = async (offsetValue) => {
    const search   = searchParams.get("search");

    await dispatch(getExercisesList({ 
      params: { 
        search:  search,
        offset:  offsetValue ? offsetValue : undefined,
        limit:   200
      }
    }));
  }

  useEffect(() => {
    loadExercises()
  }, [debouncedSearch])


  const exerciseCard = (exercise) => {
    return (
      <Grid2 
        key={exercise.exercise_id} 
        container 
        size={12}
        onClick={() => navigate(`${ROUTES.EXERCISES.PATH}/${exercise.exercise_id}`)}
        sx={{ 
          alignItems: 'center', 
          p:  { xs: 1, sm: 1.5 },
          px: { xs: 1, sm: 1.5 },
          borderRadius: 1,
          transition: '450ms ease',
          cursor: 'pointer',
          '&:hover': { bgcolor: theme.palette.gray[50] },
          '&:hover .exercise-name': { color: theme.palette.brand[500] } 
        }}
      >
        <Grid2 size='auto'>
          <img 
            src={exercise.image_url} 
            loading="lazy"
            decoding="async"
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'cover',
              padding: 4,
              borderRadius: 12,
              backgroundColor: theme.palette.gray[100]
            }}
          />
        </Grid2>
        <Grid2 size sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography className="exercise-name" sx={{ fontWeight: 500, color: theme.palette.gray[900]}}>{exercise.name}</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 300, color: theme.palette.gray[500], gap: 1, display: 'inline-flex' }}>
            <Chip label={exercise.muscle_group}/>
            <Divider orientation="vertical" flexItem />
            {exercise.last_trained_on_tz ? dayjs(exercise.last_trained_on_tz).format('D MMMM YYYY') : 'Не использовалось'}
          </Typography>
        </Grid2>
      </Grid2>
    )
  }


  // Сортируем упражнения по группе мышц, если указан order
  const sortedExercises = () => {
    const muscleGroupMap = {
      shoulders: "плечи",
      biceps: "бицепс",
      triceps: "трицепс",
      chest: "грудь",
      back: "спина",
      legs: "ноги",
    }

    const muscleGroups = exercisesList.data.reduce((acc, exercise) => {
      const muscleGroup = exercise.muscle_group

      if (!acc[muscleGroup]) acc[muscleGroup] = []
      acc[muscleGroup].push(exercise)

      return acc
    }, {})

    const order = searchParams.get("order")
    const orderMuscleGroup = order ? muscleGroupMap[order] : null

    if (orderMuscleGroup) {
      const orderedExercises = {}
      if (muscleGroups[orderMuscleGroup]) {
        orderedExercises[orderMuscleGroup] = muscleGroups[orderMuscleGroup]
        delete muscleGroups[orderMuscleGroup]
      }
      return { orderedExercises, remainingGroups: muscleGroups }
    }

    return { orderedExercises: {}, remainingGroups: muscleGroups }
  }

  const { orderedExercises, remainingGroups } = sortedExercises()

  return (
    <Grid2 container size={{ lg: 6, xs: 12 }} spacing={3} sx={{ flexDirection: 'column', pb: 3 }}>
      <CustomCard 
        sx={{  
          p:  { xs: 1, sm: 3 }, 
          gap: 0,
          maxHeight: isDesktopScreen ? null : '82vh' ,
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.gray[300]} ${theme.palette.gray[50]}`,
        }}
        >
          {(isFailed(exercisesList.loadingStatus)) && (
            <UIAlert description='Не удалось загрузить список упражнений. Пожалуйста, проверьте подключение к сети и попробуйте снова.' />
          )}

          {(isLoading(exercisesList.loadingStatus)) && <ListSkeleton quantity={2} /> }

          {(isSuccess(exercisesList.loadingStatus) && exercisesList.data.length == 0) && (
             <UIAlert 
              severity="warning"
              title='Результаты не найдены'
              description='По вашему запросу не удалось найти упражнения. Попробуйте изменить параметры поиска и выполните запрос снова.'
            />
          )}

          {(isSuccess(exercisesList.loadingStatus) && exercisesList.data.length > 0) && (
            <Grid2 container spacing={3.5} sx={{ flexDirection: 'column', justifyContent: 'center' }} >
            
            <Grid2 container direction='column' spacing={1.5}>
              <Grid2 container direction='column' spacing={1}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: theme.palette.gray[700] }}>Недавно использованные упражнения</Typography>
                <Divider flexItem />
              </Grid2>

              <Grid2 container>
                {exercisesList.data.slice(0, 10).map((exercise) => (exerciseCard(exercise)))}
              </Grid2>
            </Grid2> 

            {/* Группа из order, если она есть */}
            {orderedExercises && Object.entries(orderedExercises).map(([muscleGroup, exercises]) => (
              <Grid2 container direction='column' spacing={1.5} key={muscleGroup}>
                <Grid2 container direction='column' spacing={1}>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: theme.palette.gray[700] }}>
                    {capitalizeFirstLetter(muscleGroup)}
                  </Typography>
                  <Divider flexItem />
                </Grid2>

                <Grid2 container>
                  {exercises.map((exercise) => (exerciseCard(exercise)))}
                </Grid2>
              </Grid2>
            ))}

            {/* Остальные группы */}
            {Object.entries(remainingGroups).map(([muscleGroup, exercises]) => (
              <Grid2 container direction='column' spacing={1.5} key={muscleGroup}>
                <Grid2 container direction='column' spacing={1}>
                  <Grid2 sx={{ display: 'flex', gap: 1, alignItems: 'center' }} >
                    <Chip label={Object.entries(remainingGroups[muscleGroup]).length}/>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, color: theme.palette.gray[700] }}>
                      {capitalizeFirstLetter(muscleGroup)}
                    </Typography>
                  </Grid2>
                  <Divider flexItem />
                </Grid2>

                <Grid2 container>
                  {exercises.map((exercise) => (exerciseCard(exercise)))}
                </Grid2>
              </Grid2>
            ))}
            {
              exercisesList.data.length == PAGINATION.DEFAULT_LIMIT && (
                <Grid2 container size={{ xs: 12 }} sx={{ alignSelf: 'center' }} spacing={2}>
                  <Button 
                    onClick={() => loadExercises(exercisesList.data.length + PAGINATION.DEFAULT_LIMIT)}
                    disabled={isLoading(exercisesList.loadingStatus)} 
                    variant='contained' 
                    color='primary' 
                    size='small' 
                    fullWidth
                    sx={{ "&.Mui-disabled": { color: theme.palette.gray[300] } }}
                  >
                    <Grid2 container sx={{ alignItems: 'center' }} spacing={1}>
                      {isLoading(exercisesList.loadingStatus) && <CircularProgress size={20} sx={{ color: theme.palette.gray[400] }} />  }    
                      <Typography>Загрузить больше упражнений</Typography>
                    </Grid2>
                  </Button>
                </Grid2>
              )
            }
          </Grid2>
          )}
        </CustomCard>
    </Grid2>
  )
}

export default ListSection