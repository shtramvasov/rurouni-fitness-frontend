import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTrainingProgramsList } from "@store/slices/TrainingPrograms/training_programs.thunks";
import { isLoading, isSuccess, isFailed } from "@constants/redux.constants";
import { Grid2, Card, Box, Typography, useTheme } from "@mui/material";
import { ROUTES } from "@constants/routes.constants";

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
          <Card 
            variant="outlined"  
            //onClick={() => navigate(`${ROUTES.PROGRAMS.PATH}/${program.program_id}`)}
            sx={{ 
              display: 'flex',
              flexDirection: 'column',         
              p: 3, 
              gap: 0.8,
              textAlign: 'center', 
              cursor: 'pointer',
              transition: "box-shadow 0.5s ease",
              boxShadow: theme.shadows[1],
              "&:hover": { boxShadow: theme.shadows[2] },
              "&:hover .program-name": { color: theme.palette.brand[400] },
            }}
          >
            <Typography sx={{ transition: "color 0.5s ease" }} className="program-name" variant="h5">{program.name}</Typography>
            <Typography variant="caption" fontWeight={300}>
              <Typography variant="caption" color={theme.palette.gray[700]} fontWeight={600}>{program.description}</Typography>
            </Typography>       
          </Card>
        </Grid2>        
      ))}
    </Grid2>
  )
}

export default ProgramsList