import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExercisesList } from "@store/slices/Exercises/exercises.thunks";
import { Autocomplete, TextField, CircularProgress, Box, Grid2, useTheme, Popover, Paper, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import MuscleDiagram from "@assets/muscles/muscleDiagram";
import { isLoading } from "@constants/redux.constants";
import { CustomCard } from "@components";


function AddProgram() {
  const theme = useTheme()
  const dispatch = useDispatch()

  const { exercisesList } = useSelector(state => state.exercises)

  const [activeMuscles, setActiveMuscles] = useState({})

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMuscle, setCurrentMuscle] = useState(null);

  useEffect(() => {
    dispatch(getExercisesList({ params: { limit: 200 } }))
  }, [])


  const onMouseEnter = (event, muscleGroup) => {
    setAnchorEl(event.currentTarget);
    setCurrentMuscle(muscleGroup);
  };

  const handleMuscleLeave = () => {
    setAnchorEl(null);
    setCurrentMuscle(null);
  };

  const getSelectedExercises = () => {
    if (!currentMuscle || !activeMuscles?.muscle_group) return [];
    
    if (activeMuscles?.muscle_group === currentMuscle) {
      return [activeMuscles];
    }
    return [];
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CustomCard 
        sx={{  
          width: '100%',
          p:  { xs: 1, sm: 3 },
          justifyContent: 'center',
          gap: 0,
        }}
      >
        <Grid2 sx={{ justifyContent: 'center' }} container>
          <Grid2 item
            size={{ xs: 12 }}
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              height: 400,
              width: '100%'
            }} 
          >
            <MuscleDiagram activeMuscles={[activeMuscles?.muscle_group]} onMouseEnter={onMouseEnter} onMuscleLeave={handleMuscleLeave} />
            {getSelectedExercises().length > 0 && (
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleMuscleLeave}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{
                  pointerEvents: 'none',
                  '& .MuiPopover-paper': { pointerEvents: 'auto', overflow: 'auto'}
                }}
                disableRestoreFocus
              >
                <Paper>
                  <Grid2 p={2} container sx={{ flexDirection: 'column', gap: 2 }}>
                    <Grid2 sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>                
                      <Typography sx={{ fontWeight: 500, lineHeight: 1 }}>Упражнения</Typography>  
                      {getSelectedExercises().map((ex, index) => (
                        <Typography sx={{ fontSize: 14, display: 'flex', gap: 0.5, pl: 1 }} key={ex.exercise_id}>
                          <Typography sx={{ color: theme.palette.gray[500] }}>{++index}</Typography>
                          <Typography sx={{ color: theme.palette.gray[800] }}>{ex.name}</Typography>
                        </Typography>
                      ))}
                    </Grid2>
                  </Grid2>
                </Paper>
              </Popover>
            )}
                
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4, lg: 3 }} item>
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
      </CustomCard>
    </Box>
  )
}

export default AddProgram;