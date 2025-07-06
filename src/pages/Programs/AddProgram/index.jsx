import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExercisesList } from "@store/slices/Exercises/exercises.thunks";
import { Autocomplete, TextField, CircularProgress, Box, Grid2, useTheme, Divider } from "@mui/material";
import MuscleDiagram from "@assets/muscles/muscleDiagram";
import { isLoading } from "@constants/redux.constants";



function AddProgram() {
  const theme = useTheme()
  const dispatch = useDispatch()

  const { exercisesList } = useSelector(state => state.exercises)

  const [activeMuscles, setActiveMuscles] = useState({})

  useEffect(() => {
    dispatch(getExercisesList({ params: { limit: 200 } }))
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Grid2 sx={{ justifyContent: 'center', mt: 6 }} container>
        <Grid2 item
          size={{ xs: 12, lg: 3 }}
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            height: 400,
            width: '100%'
          }} 
        >
          <MuscleDiagram activeMuscles={[activeMuscles?.muscle_group]} />
        </Grid2>
        <Grid2 size={{ xs: 12, lg: 3 }} item>
          <Grid2 item >
            <Autocomplete
              value={ activeMuscles?.exercise_id ? exercisesList.data.find(ex => ex.exercise_id === activeMuscles?.exercise_id) : null }
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => setActiveMuscles(newValue)}
              options={exercisesList.data}
              filterOptions={(options, { inputValue }) => {
                return options.filter(option =>
                  option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                  (option.muscle_group && option.muscle_group.toLowerCase().includes(inputValue.toLowerCase()))
                );
              }}
              renderOption={(props, option) => (
                <li {...props} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {option.image_url && (
                    <img 
                      src={option.image_url} 
                      alt={option.name} 
                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 12 }}>{option.name}</div>
                    <div style={{ fontSize: 12, color: theme.palette.gray[400] }}>{option.muscle_group}</div>
                  </div>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Упражнение"
                  size="small"
                  fullWidth                   
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoading(exercisesList.loadingStatus) && <CircularProgress color="inherit" size={16} />}
                          {params.InputProps?.endAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
            />
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  )
}

export default AddProgram;