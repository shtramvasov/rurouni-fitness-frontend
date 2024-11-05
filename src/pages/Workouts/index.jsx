import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getWorkoutsList } from "@store/slices/Workouts/workouts.thunks";
import { Box } from "@mui/material";
import { ContainerWrapper } from "@components";

function Workouts() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getWorkoutsList())
  }, [])


  return (
    <ContainerWrapper>
      <Box>
        Workouts
      </Box>
    </ContainerWrapper>
  )
}

export default Workouts