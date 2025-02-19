import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Grid2, Skeleton, Stack, useTheme, Typography, Divider, Chip, Grid } from "@mui/material";
import { getWorkoutsList } from "@store/slices/Workouts/workouts.thunks";
import { getMuscleGroupUsedCount } from "@store/slices/Exercises/exercises.thunks";
import { isSuccess, isLoading, isFailed } from "@constants/redux.constants";
import dayjs from "dayjs";
import { PieChartCard } from "@components";
import { getTrainingProgramsList } from "@store/slices/TrainingPrograms/training_programs.thunks";
import { CustomCard, UIAlert } from "@components/index";


function TrainingPrograms() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { trainingProgramsList } = useSelector(state => state.trainingPrograms)

  console.log('t', trainingProgramsList.data)

  useEffect(() => {
    dispatch(getTrainingProgramsList({ is_active: true }))
  }, [])
  

  return (
    <Grid2 size={{ lg: 6, xs: 12 }} spacing={3} sx={{ flexDirection: 'column', alignItems: 'start', pb: 2, order: { xs: 1, lg: 2 } }}>
      <CustomCard 
        sx={{  
          p: 3, 
          justifyContent: 'center',
          gap: 0,
        }}
      >
        <Typography variant="h5" sx={{ pb: 2 }}>Активные программы тренировок</Typography>

        {isFailed(trainingProgramsList.loadingStatus) && (<UIAlert />)}

        {(isLoading(trainingProgramsList.loadingStatus)) && (
          <Grid2 container spacing={2.5} sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pb: 2 }}>
            {Array.from({ length: 3 }).map((index) => (
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
              <Grid2 container spacing={2.25}>
                <Grid2 size={12} container spacing={0.25} sx={{ flexDirection: 'column' }}>
                  <Skeleton variant="text" width={200} height={25} />
                  <Skeleton variant="text" width={200} height={16} sx={{ mb: 2 }} />
                  <Divider flexItem/>
                </Grid2>

                <Grid2 container>
                  {Array.from({ length: 6 }).map((index) => (
                    <Grid2 key={index} container size={12} sx={{ alignItems: 'center' }} >
                      <Grid2 size sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.2 }}>
                        <Skeleton variant="text" width={300} height={20} />
                        <Skeleton variant="text" width={200} height={16} />
                      </Grid2>
                      <Grid2 size="auto"><Skeleton variant="text" width={50} height={25} /></Grid2>
                    </Grid2>
                  ))}
                </Grid2>
              </Grid2>
            </CustomCard>
          ))}
          </Grid2>
        )}

        {(isSuccess(trainingProgramsList.loadingStatus) && trainingProgramsList.data.length == 0) && (
          <UIAlert severity='warning' title='У вас нет активных программ тренировок на текущий момент' />
        )}

        {(isSuccess(trainingProgramsList.loadingStatus) && trainingProgramsList.data.length > 0) && (  
          <Grid2 container spacing={2.5} sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pb: 2 }}>
            {            
              trainingProgramsList?.data?.map(program => (
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
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }} color={theme.palette.grey[900]}>{program.name}</Typography>
                    <Typography sx={{ pb: 1 }} variant="body2" color={theme.palette.grey[500]}>{program.description}</Typography>
                    <Divider flexItem/>
                  </Grid2>

                  <Grid2 container>
                    {program.exercises.map((exercise, index) => (
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
                          <Grid2 sx={{ display: 'flex' }} gap={0.75}>
                            <Typography sx={{ fontWeight: 500, color: theme.palette.gray[900] }}>{exercise.name}</Typography>
                              <Typography sx={{ fontSize: 12, fontWeight: 300, color: theme.palette.gray[500] }}>
                              {exercise.reps}х{exercise.sets}
                            </Typography>
                          </Grid2>
                          <Grid2 sx={{ display: 'flex' }} gap={0.4}>
                            <Typography sx={{ fontWeight: 300, fontSize: 12, color: theme.palette.gray[500] }}>
                              {exercise.recent_weight}{exercise.unit}
                            </Typography>
                            <Typography sx={{ fontWeight: 300, fontSize: 12, color: theme.palette.gray[500] }}>
                              {exercise.recent_reps}х{exercise.recent_sets}
                            </Typography>
                            <Typography sx={{ fontWeight: 300, fontSize: 12, color: theme.palette.gray[500] }}>
                              {exercise.recent_created_on_tz 
                                ?  `от ${dayjs(exercise.recent_created_on_tz).format('D MMM YYYY')}`
                                : null
                              }                           
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
            ))   
            }         
          </Grid2>    
        )}
      </CustomCard>
    </Grid2>
  )
}

export default TrainingPrograms