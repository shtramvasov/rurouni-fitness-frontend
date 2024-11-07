import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { getExercisesList } from "@store/slices/Exercises/exercises.thunks";
import { PAGINATION, isLoading, isSuccess, isFailed } from "@constants/redux.constants";
import { Grid2, Card, Box, Typography, useTheme, LinearProgress, Button } from "@mui/material";
import { UIAlert } from "@components";
import { ROUTES } from "@constants/routes.constants";
import useDebounce from "@hooks/useDebounce";
import { ChevronRightRounded, MoreHorizRounded } from "@mui/icons-material";


function ListSection() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()

  const [searchParams] = useSearchParams();
  const [infiniteScroll, setInfiniteScroll] = useState({
    offset: PAGINATION.DEFAULT_OFFSET,
    hasReachedLimit: false
  })

  const { exercisesList } = useSelector(state => state.exercises)

  const debouncedSearch = useDebounce(searchParams, 500);
  const infiniteRef = useRef(null)

  const loadExercises  = async (is_infinite, offsetValue) => {
    if(!is_infinite) setInfiniteScroll(() => ({ offset: 0, hasReachedLimit: false }))

    const responce = await dispatch(getExercisesList({ 
      params: { 
        search:  searchParams.get("search"),
        order:   searchParams.get("order"),
        offset:  offsetValue ? offsetValue : undefined,
        limit:   PAGINATION.DEFAULT_LIMIT
      },
      is_infinite
    }));
    
    const { result } = responce.payload;

    if(result && result.length < PAGINATION.DEFAULT_LIMIT) {
      setInfiniteScroll((prev) => ({ ...prev, hasReachedLimit: true }))
    } 
  }

  // Функция для загрузки дополнительных упражнений
  const loadMore = () => {
    if (infiniteScroll.hasReachedLimit) return;

    const newOffset = infiniteScroll.offset + PAGINATION.DEFAULT_LIMIT;
    setInfiniteScroll((prev) => ({ ...prev, offset: newOffset }))
    loadExercises(true, newOffset);
  }

  useEffect(() => {
    loadExercises()
  }, [debouncedSearch])


  // Обработка бесконечной загрузки
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading(exercisesList.loadingStatus) && !infiniteScroll.hasReachedLimit) {
          loadMore();
        }
      },
      { threshold: 1 }
    )

    if (infiniteRef.current) observer.observe(infiniteRef.current)

    return () => {
      if (infiniteRef.current) observer.unobserve(infiniteRef.current);
    }

  }, [loadMore, infiniteScroll, exercisesList.data.length]);


  // Обработка загрузки списка упражнений без бесконечной загрузки
  if(isLoading(exercisesList.loadingStatus) && infiniteScroll.offset == 0) {
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
    <Grid2 container sx={{  flexDirection: 'column', pb: 2 }} spacing={3}>
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

      {/* Загрузка для бесконечного списка */}
      {!infiniteScroll.hasReachedLimit && (
        <Grid2 ref={infiniteRef} container size={{ xs: 12, md: 3 }} sx={{ alignSelf: 'center', justifyContent: 'center' }} spacing={2}>
          <Button sx={{ bgcolor: theme.palette.gray[100] }} fullWidth variant="text">
            <MoreHorizRounded sx={{ fill: theme.palette.gray[400] }} />          
          </Button>
        </Grid2>
      )}

    </Grid2>
  )
}

export default ListSection