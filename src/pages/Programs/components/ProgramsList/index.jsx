import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTrainingProgramsList } from "@store/slices/TrainingPrograms/training_programs.thunks";
import { isLoading, isSuccess, isFailed } from "@constants/redux.constants";
import { Grid2, Box, Typography, useTheme } from "@mui/material";
import { ROUTES } from "@constants/routes.constants";
import { CustomCard } from "@components/index";


function ProgramsList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()

  const { trainingProgramsList } = useSelector(state => state.trainingPrograms)


  useEffect(() => {
    dispatch(getTrainingProgramsList())
  }, [])


  return (
    <Grid2 container spacing={2.5}>
      {trainingProgramsList.data.map(program => (
        
        <Grid2 key={program.program_id} size={{ xs: 12, md: 6, lg: 3 }}>
          <CustomCard 
            // onClick={() => navigate(`${ROUTES.PROGRAMS.PATH}/${program.program_id}`)}
            sx={{ 
              p: 3, 
              gap: 0.8,
              textAlign: 'center',
              cursor: 'pointer',
              "&:hover .program-name": { color: theme.palette.brand[400] },
            }}
          >
            <Typography sx={{ transition: "color 0.5s ease" }} className="program-name" variant="h5">{program.name}</Typography>
            <Typography variant="caption" fontWeight={300}>
              <Typography variant="caption" color={theme.palette.gray[700]} fontWeight={600}>{program.description}</Typography>
            </Typography>       
          </CustomCard>
        </Grid2>        
      ))}
    </Grid2>
  )
}

export default ProgramsList