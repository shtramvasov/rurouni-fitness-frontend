import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Grid2, Skeleton, Stack, useTheme, Typography, Divider } from "@mui/material";
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
    dispatch(getTrainingProgramsList())
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
        <Typography variant="h5" sx={{ pb: 2 }}>Программа тренировок</Typography>

        {isFailed(trainingProgramsList.loadingStatus) && (<UIAlert />)}

        {/* loading */}

        {(isSuccess(trainingProgramsList.loadingStatus) && trainingProgramsList.data.length == 0) && (
          <UIAlert severity='warning' title='У вас нет программ тренировок на текущий момент' />
        )}

        {(isSuccess(trainingProgramsList.loadingStatus) && trainingProgramsList.data.length > 0) && (  
          <Grid2 container spacing={2.5} sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pb: 2 }}>
            {            
              trainingProgramsList?.data?.map(program => (
              <CustomCard 
                sx={{  
                  p: 1.5,
                  width: "100%",
                  justifyContent: 'center',
                  gap: 0,
                  boxShadow: 0,
                  "&:hover": { boxShadow: 0 }
                }}
              >
                <Grid2 container spacing={1.5}>
                  <Grid2 size={12} container spacing={0.5} sx={{ flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }} color={theme.palette.grey[900]}>{program.name}</Typography>
                    <Typography sx={{ pb: 0.5 }} variant="body2" color={theme.palette.grey[500]}>{program.description}</Typography>
                    <Divider  flexItem/>
                  </Grid2>

                  <Grid2 container spacing={0.5} sx={{ flexGrow: 1 }}>
                    {program.exercises.map(exercise => (
                      <Grid2 size={12} container spacing={0.5} sx={{  }}>
                        <Typography>{exercise.name}</Typography>
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