import { useSelector } from "react-redux"; 
import { useNavigate } from "react-router-dom";
import { Grid2, Typography, Link, useTheme } from "@mui/material";
import { WorkoutsList , WorkoutDetail } from "./components";
import { CustomCard } from "@components";
import { isSuccess } from "@constants/redux.constants";
import { ROUTES } from "@constants/routes.constants";


function Workouts() {
  const navigate = useNavigate();
  const theme = useTheme();

  const { workoutsList } = useSelector(state => state.workouts)

  return (
    <Grid2 container sx={{ flexDirection: 'row' }} spacing={2.5}>
      {(isSuccess(workoutsList.loadingStatus) && workoutsList.data.length == 0) 
          ? (
            <Grid2 size={12} container spacing={2.5} sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pb: 2 }}>
              <CustomCard 
                sx={{  
                  p: 2,
                  width: "100%",
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: 0,
                  boxShadow: 0,
                  "&:hover": { boxShadow: 0 }
                }}
              >
                <Grid2 size={12} container spacing={1} sx={{ flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 600 }} color={theme.palette.grey[700]}>У вас ещё не было проведенных тренировок</Typography>
                  <Typography sx={{ pb: 1 }} variant="body2" color={theme.palette.grey[500]}>
                    Возможно вам захочется{' '}
                    <Link sx={{ cursor: 'pointer', color: theme.palette.brand[600] }} onClick={() => navigate(ROUTES.ADD_WORKOUT.PATH)}>
                      записать тренировку
                    </Link>                 
                  </Typography>
                </Grid2>
              </CustomCard>
            </Grid2>
        ) : (
            <>      
            <WorkoutsList />
            <WorkoutDetail />
            </>
        )}
    </Grid2>
  )
}

export default Workouts