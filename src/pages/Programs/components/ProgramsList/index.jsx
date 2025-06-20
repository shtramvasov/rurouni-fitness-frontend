import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTrainingProgramsList } from "@store/slices/TrainingPrograms/training_programs.thunks";
import { isLoading, isSuccess, isFailed, PAGINATION } from "@constants/redux.constants";
import { Grid2, Typography, useTheme } from "@mui/material";
import { CustomCard, UIAlert, CardSkeleton, TrainingProgramCard } from "@components";
import useDebounce from "@hooks/useDebounce";


function ProgramsList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()

  const [searchParams] = useSearchParams();
  const [activePrograms, setActivePrograms] = useState([]);
  const [inactivePrograms, setInactivePrograms] = useState([]);

  const { trainingProgramsList } = useSelector(state => state.trainingPrograms)

  const debouncedSearch = useDebounce(searchParams.get('search'), 500);


  const loadTrainingPrograms  = async (offsetValue) => {
      const search   = searchParams.get("search");
  
      await dispatch(getTrainingProgramsList({ 
        params: { 
          search:  search,
          offset:  offsetValue ? offsetValue : undefined,
          limit:   PAGINATION.DEFAULT_LIMIT
        }
      }));
    }

  useEffect(() => {
    loadTrainingPrograms()
  }, [debouncedSearch])

  useEffect(() => {
    // Разделяем программы на активные и неактивные
    const active    = trainingProgramsList.data.filter(program => program.is_active);
    const inactive  = trainingProgramsList.data.filter(program => !program.is_active);

    setActivePrograms(active);
    setInactivePrograms(inactive);
  }, [trainingProgramsList.data])


  return (
    <Grid2 size={12} container sx={{ flexDirection: 'column', alignItems: 'start', pb: 2, gap: 3 }}>
      <CustomCard 
        sx={{  
          width: '100%',
          p: 3, 
          justifyContent: 'center',
          gap: 0,
        }}
      >
        <Typography variant="h5" sx={{ pb: 2 }}>Активные программы тренировок</Typography>
        {isFailed(trainingProgramsList.loadingStatus)     && (<UIAlert />)}

        {(isLoading(trainingProgramsList.loadingStatus))  && (<CardSkeleton quantity={1} />)}

        {(isSuccess(trainingProgramsList.loadingStatus) && activePrograms.length == 0) && (
          <UIAlert severity='warning' title='У вас нет активных программ тренировок на текущий момент' />
        )}

        {(isSuccess(trainingProgramsList.loadingStatus) && activePrograms.length > 0) && (
          <Grid2 container spacing={2.5} sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pb: 2 }}>
            {activePrograms?.map(program => ( <TrainingProgramCard program={program}/> ))} 
          </Grid2>
        )}
      </CustomCard>

      <CustomCard 
        sx={{  
          width: '100%',
          p: 3, 
          justifyContent: 'center',
          gap: 0,
        }}
      >
        <Typography variant="h5" sx={{ pb: 2 }}>Неактивные программы тренировок</Typography>
        {isFailed(trainingProgramsList.loadingStatus)     && (<UIAlert />)}

        {(isLoading(trainingProgramsList.loadingStatus))  && (<CardSkeleton quantity={1} />)}

        {(isSuccess(trainingProgramsList.loadingStatus) && inactivePrograms.length == 0) && (
          <UIAlert severity='warning' title='У вас нет неактивных программ тренировок на текущий момент' />
        )}

        {(isSuccess(trainingProgramsList.loadingStatus) && inactivePrograms.length > 0) && (
          <Grid2 container spacing={2.5} sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pb: 2 }}>
            {inactivePrograms?.map(program => ( <TrainingProgramCard program={program}/> ))} 
          </Grid2>
        )}
      </CustomCard>

    </Grid2>
  )
}

export default ProgramsList