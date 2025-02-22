import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getExercisesList } from "@store/slices/Exercises/exercises.thunks";
import { getTrainingProgramsList } from "@store/slices/TrainingPrograms/training_programs.thunks";
import { Grid2, useTheme, Typography, Divider, TextField, Autocomplete, FormLabel, OutlinedInput, styled, Button, IconButton, Tooltip } from "@mui/material";
import { Add, Delete, Done } from "@mui/icons-material";
import { isSuccess, isLoading, isFailed } from "@constants/redux.constants";
import { CustomCard } from "@components";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";


function AddWorkout() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { exercisesList } = useSelector(state => state.exercises)
  const { trainingProgramsList } = useSelector(state => state.trainingPrograms)

  const [hasDatePicker, setHasDatePicker] = useState(false)
  const [submitData, setSubmitData] = useState({
    program_id: undefined,
    name: undefined,
    created_on_tz: undefined,
    exercises: [{ id: Date.now(), name: undefined, weight: undefined, sets: undefined, reps: undefined }]
  });

  
  useEffect(() => {
    dispatch(getTrainingProgramsList())
    dispatch(getExercisesList({}))
  }, [])


  const handleExerciseChange = (index, field, value) => {
    setSubmitData((prev) => {
      const updatedExercises = [...prev.exercises];

      updatedExercises[index][field] = value;
      return { ...prev, exercises: updatedExercises };
    });
  };

  const handleProgramChange = (event, newValue) => {
    if (!newValue) {
      setSubmitData({ ...submitData, name: null, program_id: null, exercises: [{ id: Date.now(), name: null, weight: null, sets: null, reps: null }] });
      return;
    }
  
    const selectedProgram = trainingProgramsList.data.find(tp => tp.program_id == newValue.program_id);
    
    if (selectedProgram) {
      const updatedExercises = selectedProgram.exercises.map(ex => ({
        id: Date.now() + Math.random(),
        name: ex.exercise_id,
        weight: ex.recent_weight || null, 
        sets: ex.recent_sets || ex.sets || null,
        reps: ex.recent_reps || ex.reps || null
      }));
  
      setSubmitData({ ...submitData, name: newValue.name, exercises: updatedExercises });
    }
  };


  const addExercise = () => {
    setSubmitData((prev) => ({...prev, exercises: [...prev.exercises, { id: Date.now(), name: null, weight: null, sets: null, reps: null }]}));
  };


  const removeExercise = (id) => {
    setSubmitData((prev) => ({...prev, exercises: prev.exercises.filter((exercise) => exercise.id !== id)}));
  };  

  const submit = async () => {
    console.log(submitData)
  }

  return ( 
    <CustomCard sx={{ p: 3 }}>
      <FormGrid size={6} container spacing={1} sx={{ margin: '0 auto' }}>
        <Grid2 size={12} container sx={{ alignItems: 'center' }} spacing={2}>
          <Typography variant="h5" color={theme.palette.grey[700]} sx={{ pb: 1 }}>Добавить тренировку</Typography>
          <Grid2 container sx={{ height: 20 }}><Divider flexItem orientation="vertical"/></Grid2>


          {!hasDatePicker && (
            <Tooltip title='По умолчанию сохраняется текущий день, используйте эту опцию, если хотите установить другую дату'>
              <Button 
                onClick={() => { setHasDatePicker(true); setSubmitData({ ...submitData, created_on_tz: dayjs() }) }} 
                variant="outlined" 
                sx={{ color: theme.palette.grey[500] }} 
                color="inherit"
                size="small"
              >
                Установить дату
              </Button>
            </Tooltip>
          )}

          {hasDatePicker && (
            <DatePicker
              value={submitData.created_on_tz ? submitData.created_on_tz : null}
              onChange={(newValue) => setSubmitData({ ...submitData, created_on_tz: newValue })}
              format="DD.MM.YYYY"
              sx={{
                "& .MuiIconButton-root": {
                  border: 'none',
                  height: '2.5rem',
                  width: '2.5rem',
                  color: theme.palette.grey[500],
                  "&:hover": { backgroundColor: "transparent" },
                },
                "& .MuiSvgIcon-root": { fontSize: "1.25rem" }
              }}
            />
          )}
        </Grid2>

      {/* Поле ввода названия тренировки */}
      <FormGrid size={12} sx={{ pt: hasDatePicker ? 2 : 0 }}>
        <Autocomplete
          value={trainingProgramsList.data.find((tp) => tp.name == submitData.name) || null }
          getOptionLabel={(option) => option.name}
          onChange={handleProgramChange}
          options={trainingProgramsList.data}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Название тренировки"
              size="small"
              fullWidth
            />
          )}
        />
      </FormGrid>

      {/* Упражнения */}
      <Grid2>
        <Typography sx={{ pt: 2, pb: 1,  fontSize: 14, fontWeight: 600, color: theme.palette.grey[700] }}>Проведенные упражнения</Typography>

        {submitData.exercises.map((exercise, index) => (
          <Grid2 
            key={exercise.id} 
            container 
            size={12} 
            spacing={2} 
            sx={{ 
              mb: { xs: 6, md: 2 }, 
              p: 2, 
              borderRadius: 1, 
              border: `1px solid ${theme.palette.grey[100]}` 
            }}
          >
            <Grid2 item size={{ xs: 12, md: 5 }}>
              <Autocomplete
                value={exercisesList.data.find((ex) => ex.exercise_id === exercise.name) || null }
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => handleExerciseChange(index, "name", newValue ? newValue.exercise_id : null)}
                options={exercisesList.data}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Упражнение"
                    size="small"
                    fullWidth
                  />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 6, md: 2 }}>
              <OutlinedInput
                placeholder="Вес"
                size="small"
                fullWidth
                value={exercise.weight}
                onChange={(e) => handleExerciseChange(index, "weight", e.target.value)}
              />
            </Grid2>

            <Grid2 size={{ xs: 6, md: 2 }}>
              <OutlinedInput
                placeholder="Подходы"
                size="small"
                fullWidth
                value={exercise.sets}
                onChange={(e) => handleExerciseChange(index, "sets", e.target.value)}
              />
            </Grid2>

            <Grid2 size={{ xs: 6, md: 2 }}>
              <OutlinedInput
                placeholder="Повторения"
                size="small"
                fullWidth
                value={exercise.reps}
                onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
              />
            </Grid2>

            <Tooltip title={submitData.exercises.length == 1 ? 'Нельзя удалить единственное упражнение' : 'Удалить упражнение'} placement="top" >
              <Grid2 size={{ xs: 6, md: 1 }} container sx={{ alignSelf: 'end' }}>
                <IconButton
                  sx={{ width: '100%' }} 
                  disabled={submitData.exercises.length == 1} 
                  size="small" 
                  onClick={() => removeExercise(exercise.id)}
                >
                  <Delete />
                </IconButton>
              </Grid2>
            </Tooltip>
          </Grid2>
          ))}
        </Grid2>
        <Grid2 container sx={{ pt: 1.5 }}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Button onClick={submit} variant="contained" color="secondary" startIcon={<Done />} fullWidth>Записать тренировку</Button>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Button onClick={addExercise} variant="contained" startIcon={<Add />} fullWidth>Добавить упражнение</Button>
          </Grid2>
        </Grid2>
      </FormGrid>
    </CustomCard>
  )
}

const FormGrid = styled(Grid2)(() => ({ display: 'flex', flexDirection: 'column' }));

export default AddWorkout