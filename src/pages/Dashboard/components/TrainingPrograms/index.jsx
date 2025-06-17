import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Grid2, useTheme, Typography, Divider, Chip } from "@mui/material";
import { isSuccess, isLoading, isFailed } from "@constants/redux.constants";
import dayjs from "dayjs";
import { getTrainingProgramsList } from "@store/slices/TrainingPrograms/training_programs.thunks";
import { CustomCard, UIAlert, CardSkeleton } from "@components";


function TrainingPrograms() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { trainingProgramsList } = useSelector(state => state.trainingPrograms)

  useEffect(() => {
    dispatch(getTrainingProgramsList({ is_active: true }))
  }, [])
  

  return (
    <Grid2 size={{ lg: 6, xs: 12 }} container spacing={3} sx={{ flexDirection: 'column', alignItems: 'start', pb: 2, order: { xs: 1, lg: 2 } }}>
      <CustomCard 
        sx={{  
          p: 3, 
          justifyContent: 'center',
          gap: 0,
        }}
      >
        <Typography variant="h5" sx={{ pb: 2 }}>Активные программы тренировок</Typography>

        {isFailed(trainingProgramsList.loadingStatus)     && (<UIAlert />)}

        {(isLoading(trainingProgramsList.loadingStatus))  && (<CardSkeleton quantity={3} />)}

        {(isSuccess(trainingProgramsList.loadingStatus) && trainingProgramsList.data.length == 0) && (
          <UIAlert severity='warning' title='У вас нет активных программ тренировок на текущий момент' />
        )}

        {(isSuccess(trainingProgramsList.loadingStatus) && trainingProgramsList.data.length > 0) && (  
          <Grid2 container spacing={2.5} sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pb: 2 }}>
            {            
              trainingProgramsList?.data?.map(program => (
              <CustomCard 
                key={program.program_id}
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

                  <Grid2 container sx={{ flexGrow: 1 }}>
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
                          <Grid2 sx={{ display: 'flex' }} >
                            <Grid2 container gap={0.75} position='relative'>
                              <Typography sx={{ fontWeight: 500, color: theme.palette.gray[900] }}>{exercise.name}</Typography>
                              <Typography sx={{ fontSize: 12, fontWeight: 300, color: theme.palette.gray[500], position: 'absolute', right: -28 }}>
                                {exercise.reps}х{exercise.sets}
                              </Typography>
                            </Grid2>
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