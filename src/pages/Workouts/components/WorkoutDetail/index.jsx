import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getWorkoutDetails } from "@store/slices/Workouts/workouts.thunks";
import { clearWorkoutDetails } from "@store/slices/Workouts/workouts.slice";
import { Grid2, useTheme, Typography, Divider, Chip } from "@mui/material";
import { isSuccess, isLoading, isFailed } from "@constants/redux.constants";
import { CustomCard, UIAlert, CardSkeleton } from "@components";
import dayjs from "dayjs";

function WorkoutDetail() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [searchParams] = useSearchParams();

  const { workoutsList, workoutDetails } = useSelector(state => state.workouts)


  useEffect(() => {
    if(searchParams.get("workout_id") && !isLoading(workoutDetails.loadingStatus)) {
      dispatch(getWorkoutDetails(searchParams.get("workout_id")))
    }

    return () => {
      dispatch(clearWorkoutDetails())
    }
  }, [searchParams.get("workout_id")])


  return (
    <Grid2 size={{ lg: 6, xs: 12 }} container spacing={3} sx={{ flexDirection: 'column', alignItems: 'start', pb: 2 }}>
      <CustomCard 
        sx={{  
          p: 3, 
          width: '100%',
          justifyContent: 'center',
          gap: 0,
        }}
      >
        {isFailed(workoutDetails.loadingStatus)     && (<UIAlert />)}

        {(isLoading(workoutDetails.loadingStatus))  && (<CardSkeleton />)}

        {((isSuccess(workoutDetails.loadingStatus) && isSuccess(workoutsList.loadingStatus)) && workoutsList.data?.length == 0) && (
          <UIAlert severity='warning' title='У вас не было  упражнений на этой тренировке. Но как?' />
        )}

        {((isSuccess(workoutDetails.loadingStatus) && isSuccess(workoutsList.loadingStatus)) && workoutDetails.data?.exercises.length > 0) && (
          <Grid2 container spacing={2.5} sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pb: 2 }}>
            {
              <CustomCard 
                sx={{  
                  p: 2,
                  width: "100%",
                  justifyContent: 'center',
                  gap: 0,
                  boxShadow: 0,
                  "&:hover": { boxShadow: 0 }
                }}
              >
                <Grid2 container spacing={1.25}>
                  <Grid2 size={12} container spacing={0.5} sx={{ flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }} color={theme.palette.grey[900]}>{workoutDetails.data.title}</Typography>
                    <Typography sx={{ pb: 1 }} variant="body2" color={theme.palette.grey[500]}>
                      {dayjs(workoutDetails.data.created_on_tz).format('DD MMMM YYYY')}
                    </Typography>
                    <Divider flexItem/>
                  </Grid2>

                  <Grid2 size={12} container>
                    {workoutDetails.data?.exercises?.map((exercise, index) => (
                      <Grid2 
                        key={exercise.exercise_id} 
                        container 
                        size={12} 
                        sx={{ 
                          alignItems: 'center', 
                          p: 1.5,
                          borderRadius: 1,
                          transition: '450ms ease',
                          '&:hover': { bgcolor: theme.palette.gray[50] } 
                        }}
                      >
                        <Grid2 size="auto" sx={{ pr: 0.5 }}>
                          <Typography variant="caption" color={theme.palette.gray[500]}>{++index}</Typography>
                        </Grid2>

                        <Grid2 size sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography sx={{ fontWeight: 500, color: theme.palette.gray[900] }}>{exercise.exercise_name}</Typography>
                          <Grid2 sx={{ display: 'flex' }} gap={0.4}>
                            <Typography sx={{ fontWeight: 300, fontSize: 12, color: theme.palette.gray[500] }}>
                              {exercise.weight}{exercise.unit}
                            </Typography>
                            <Typography sx={{ fontWeight: 300, fontSize: 12, color: theme.palette.gray[500] }}>
                              {exercise.reps}х{exercise.sets}
                            </Typography>
                          </Grid2>
                        </Grid2>

                        <Grid2 size="auto">
                          <Chip label={exercise.muscle_group}/>
                        </Grid2>
                      </Grid2>
                    ))}                
                  </Grid2>
                </Grid2>      
              </CustomCard>
            }
          </Grid2>
        )}
      </CustomCard>
    </Grid2>
  )
}

export default WorkoutDetail