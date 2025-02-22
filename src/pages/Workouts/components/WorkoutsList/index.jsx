import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { isFulfilled } from "@reduxjs/toolkit";
import { getWorkoutsList } from "@store/slices/Workouts/workouts.thunks";
import useUpdateSearchParams from "@hooks/useUpdateSearchParams";
import { Grid2, useTheme, Typography, Divider, useMediaQuery, Button, CircularProgress } from "@mui/material";
import { isSuccess, isLoading, isFailed, PAGINATION } from "@constants/redux.constants";
import { CustomCard, UIAlert, WorkoutListSkeleton } from "@components";
import dayjs from "dayjs";
import { capitalizeFirstLetter } from "@helpers/capitalizeFirstLetter";
import { clearWorkoutsList } from "@store/slices/Workouts/workouts.slice";


function WorkoutsList() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const updateSearchParams = useUpdateSearchParams();
  const [searchParams] = useSearchParams()

  const isDesktopScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const { workoutsList } = useSelector(state => state.workouts)

  const loadWorkouts = async (offset) => {
    const result = await dispatch(getWorkoutsList({ limit: PAGINATION.DEFAULT_LIMIT, offset }))

    if(isFulfilled(result) && !searchParams.get('workout_id')) {
      const { workout_id } = result.payload[0]
      updateSearchParams('workout_id', String(workout_id))
    }
  }

  useEffect(() => {
    loadWorkouts()   

    return () => {
      dispatch(clearWorkoutsList())
    }
  }, [])


  return (
    <Grid2 container size={{ lg: 6, xs: 12 }} spacing={3} sx={{ flexDirection: 'column', pb: 2 }}>
       <CustomCard 
        sx={{  
          p: 3, 
          gap: 0,
          maxHeight: isDesktopScreen ? '90vh' : '40vh' ,
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.gray[300]} ${theme.palette.gray[50]}`,
        }}
        >
          {isFailed(workoutsList.loadingStatus)     && (<UIAlert />)}

          {(isLoading(workoutsList.loadingStatus))  && (<WorkoutListSkeleton quantity={2} />)}

          {(isSuccess(workoutsList.loadingStatus) && workoutsList.data.length == 0) && (
            <UIAlert severity='warning' title='У вас нет истории тренировок на текущий момент' />
          )}

          {(isSuccess(workoutsList.loadingStatus) && workoutsList.data.length > 0) && (
            <Grid2 container spacing={3.5} sx={{ flexDirection: 'column', justifyContent: 'center' }} >
              {
                // Делим по месяцам
                Object.entries(workoutsList.data.reduce((acc, workout) => {
                    const month = dayjs(workout.created_on_tz).format("MMMM");

                    if (!acc[month]) acc[month] = [];
                    acc[month].push(workout);

                    return acc;
                  }, {})
                ).map(([month, workouts]) => (
                  <Grid2 container direction='column' spacing={1.5} key={month}>
                    
                    <Grid2 container direction='column' spacing={1}>
                      <Typography sx={{ fontSize: 16, fontWeight: 600, color: theme.palette.gray[700] }}>
                        {capitalizeFirstLetter(month)}
                      </Typography>
                      <Divider flexItem />
                    </Grid2>

                    <Grid2 container>
                      {workouts.map((workout, index) => (
                        <Grid2 
                          key={workout.workout_id} 
                          container 
                          size={12}
                          onClick={() => updateSearchParams('workout_id', String(workout.workout_id))}
                          sx={{ 
                            alignItems: 'center', 
                            p: 1.5,
                            borderRadius: 1,
                            transition: '450ms ease',
                            cursor: 'pointer',
                            bgcolor:  searchParams.get('workout_id') == workout.workout_id ? theme.palette.gray[50] : null,
                            border:   searchParams.get('workout_id') == workout.workout_id 
                              ? `1px solid ${theme.palette.gray[300]}` 
                              : `1px solid white`,
                            '&:hover': { bgcolor: theme.palette.gray[50] } 
                          }}
                        >
                          <Grid2 size="auto" sx={{ pr: 0.5 }}>
                            <Typography variant="caption" color={theme.palette.gray[500]}>{++index}</Typography>
                          </Grid2>

                          <Grid2 size sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Typography 
                                sx={{ 
                                fontWeight: 500, 
                                color:  searchParams.get('workout_id') == workout.workout_id ? theme.palette.brand[500]  : theme.palette.gray[900] 
                                }}
                                >
                                  {workout.title}
                              </Typography>
                              <Typography sx={{ fontSize: 12, fontWeight: 300, color: theme.palette.gray[500] }}>
                              {dayjs(workout.created_on_tz).format('DD MMMM YYYY')}
                            </Typography>
                          </Grid2>
                        </Grid2>
                      ))}
                    </Grid2>
                  </Grid2>           
                ))}
                  {
                    workoutsList.data.length == PAGINATION.DEFAULT_LIMIT && (
                    <Grid2 container size={{ xs: 12 }} sx={{ alignSelf: 'center' }} spacing={2}>
                      <Button 
                        onClick={() => loadWorkouts(workoutsList.data.length + PAGINATION.DEFAULT_LIMIT)}
                        disabled={isLoading(workoutsList.loadingStatus)} 
                        variant='contained' 
                        color='primary' 
                        size='small' 
                        fullWidth
                        sx={{ "&.Mui-disabled": { color: theme.palette.gray[300] } }}
                      >
                        <Grid2 container sx={{ alignItems: 'center' }} spacing={1}>
                          {isLoading(workoutsList.loadingStatus) && <CircularProgress size={20} sx={{ color: theme.palette.gray[400] }} />  }    
                          <Typography>Загрузить больше  тренировок</Typography>
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

export default WorkoutsList