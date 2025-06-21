import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Grid2, useTheme, Typography } from "@mui/material";
import { isSuccess, isLoading, isFailed } from "@constants/redux.constants";
import { getTrainingProgramsList } from "@store/slices/TrainingPrograms/training_programs.thunks";
import { CustomCard, UIAlert, CardSkeleton, TrainingProgramCard } from "@components";


function TrainingPrograms() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { trainingProgramsList } = useSelector(state => state.trainingPrograms)

  useEffect(() => {
    dispatch(getTrainingProgramsList({ params: { is_active: true }}))
  }, [])
  

  return (
    <Grid2 size={{ lg: 6, xs: 12 }} container spacing={3} sx={{ flexDirection: 'column', alignItems: 'start', pb: 2, order: { xs: 1, lg: 2 } }}>
      <CustomCard 
        sx={{  
          p: { xs: 1, sm: 3 }, 
          justifyContent: 'center',
          gap: 0,
        }}
      >
        <Typography variant="h5" sx={{ pb: 2, pt: { xs: 1, sm: 0 }, pl: { xs: 1, sm: 0 } }}>Активные программы тренировок</Typography>

        {isFailed(trainingProgramsList.loadingStatus)     && (<UIAlert />)}

        {(isLoading(trainingProgramsList.loadingStatus))  && (<CardSkeleton quantity={3} />)}

        {(isSuccess(trainingProgramsList.loadingStatus) && trainingProgramsList.data.length == 0) && (
          <UIAlert severity='warning' title='У вас нет активных программ тренировок на текущий момент' />
        )}

        {(isSuccess(trainingProgramsList.loadingStatus) && trainingProgramsList.data.length > 0) && (  
          <Grid2 container spacing={2.5} sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pb: 2 }}>
            {            
              trainingProgramsList?.data?.map(program => (
              <TrainingProgramCard program={program}/>
            ))   
            }         
          </Grid2>    
        )}
      </CustomCard>
    </Grid2>
  )
}

export default TrainingPrograms