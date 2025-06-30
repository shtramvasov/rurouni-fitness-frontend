import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { getExercisesList } from "@store/slices/Exercises/exercises.thunks";
import { getTrainingProgramsList } from "@store/slices/TrainingPrograms/training_programs.thunks";
import { postWorkout } from "@store/slices/Workouts/workouts.thunks";
import { clearCreateWorkoutLS } from "@store/slices/Workouts/workouts.slice";
import { Grid2, useTheme, Typography, Divider, TextField, Autocomplete, OutlinedInput, styled, Button, IconButton, Tooltip, CircularProgress, FormControl, FormHelperText, Grid } from "@mui/material";
import { Add, Delete, Done } from "@mui/icons-material";
import { isFulfilled } from "@reduxjs/toolkit";
import { isSuccess, isLoading, isFailed } from "@constants/redux.constants";
import { CustomCard, UIAlert } from "@components";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { validateField, validateNumber } from "@helpers/validations";
import { ROUTES } from "@constants/routes.constants";



function AddWorkout() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const { exercisesList } = useSelector(state => state.exercises)
  const { trainingProgramsList } = useSelector(state => state.trainingPrograms)
  const { createWorkoutLS } = useSelector(state => state.workouts)

  const initialData = {
    program_id:     undefined,
    title:          undefined,
    created_on_tz:  undefined,
    exercises:      [{ id: Date.now(), exercse_id: undefined, weight: undefined, sets: undefined, reps: undefined }]
  }

  const [hasDatePicker, setHasDatePicker] = useState(false)
  const [submitData, setSubmitData] = useState(initialData);
  const [errors, setErrors] = useState({ title: false, exercises: [] });

  useEffect(() => {
    dispatch(getTrainingProgramsList({ params: { is_active: true }}))
    dispatch(getExercisesList({}))
  }, [])

  const handleExerciseChange = (index, field, value) => {
    let sanitizedValue = value;

    if (["weight", "sets", "reps"].includes(field)) {
      // Удаляем все нецифровые символы
      sanitizedValue = value.replace(/\D/g, ""); 
  
      // Ограничения по длине
      if (field == "weight") sanitizedValue = sanitizedValue.slice(0, 3);
      if (field == "sets" || field == "reps") sanitizedValue = sanitizedValue.slice(0, 2);
    }

    setSubmitData((prev) => {
      const updatedExercises = [...prev.exercises];

      updatedExercises[index][field] = sanitizedValue;
      return { ...prev, exercises: updatedExercises };
    });
  };

  const handleProgramChange = (event, newValue) => {
    if (!newValue) {
      setSubmitData(
        { ...submitData, 
          title: null, 
          program_id: null, 
          exercises: [{ id: Date.now(), exercse_id: null, weight: null, sets: null, reps: null }] 
        });

      return;
    }
  
    const selectedProgram = trainingProgramsList.data.find(tp => tp.program_id == newValue.program_id);

    if (selectedProgram) {
      const updatedExercises = selectedProgram.exercises.map(ex => ({
        id:         Date.now() + Math.random(),
        exercse_id: ex.exercise_id,
        weight:     ex.recent_weight  || null, 
        sets:       ex.recent_sets    || ex.sets || null,
        reps:       ex.recent_reps    || ex.reps || null
      }));
  
      setSubmitData({ ...submitData, title: newValue.name, exercises: updatedExercises });
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setSubmitData({
      ...submitData,
      title: newInputValue,
    });
  };

  const addExercise = () => {
    setSubmitData((prev) => ({...prev, exercises: [...prev.exercises, { id: Date.now(), exercse_id: null, weight: null, sets: null, reps: null }]}));
  };

  const removeExercise = (id) => {
    setSubmitData((prev) => {
      const updatedExercises = prev.exercises.filter((exercise) => exercise.id !== id);
      
      // Удаляем ошибки для удаленного упражнения
      const newErrors = { ...errors, exercises: { ...errors.exercises } };
      delete newErrors.exercises[id];
      
      setErrors(newErrors);
  
      return { ...prev, exercises: updatedExercises };
    });
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { title: "", exercises: {} };
  
    // Проверка на пустое название тренировки
    if (!submitData.title?.trim()) {
      newErrors.title = "Обязательно";
      isValid = false;
    }

    // Проверка на наличие хотя бы одного упражнения
    if (submitData.exercises.length === 0) {
      toast.error("Добавьте хотя бы одно упражнение!");
      isValid = false;
    }
  
    // Валидация упражнений
    submitData.exercises.forEach((ex) => {
      const error = {
        exercse_id:   validateField(ex.exercse_id),
        weight:       validateNumber(ex.weight),
        sets:         validateNumber(ex.sets),
        reps:         validateNumber(ex.reps),
      };
  
      // Если есть ошибка, отмечаем как некорректное
      if (Object.values(error).some(Boolean)) {
        isValid = false;
      }
  
      newErrors.exercises[ex.id] = error;
    });

    setErrors(newErrors);
    return isValid;
  };

  const submit = async () => {
    if (!validateForm()) return;

    if(!isLoading(createWorkoutLS)) {
      const response = await dispatch(postWorkout({
        title:          submitData.title,
        exercises:      submitData.exercises,
        created_on_tz:  submitData.created_on_tz ? dayjs(submitData.created_on_tz).toISOString() : undefined,
      }))

      if(isFulfilled(response)) {
        setSubmitData(initialData)
        toast.success('Тренировка успешно записана')
        dispatch(clearCreateWorkoutLS())
        navigate(ROUTES.WORKOUTS.PATH)
      }
    }
  }

  return ( 
    <CustomCard sx={{ p:  { xs: 1, sm: 3 },  }}>

      {(isFailed(exercisesList.loadingStatus) || isFailed(trainingProgramsList.loadingStatus)) && (
        <UIAlert title='Что-то пошло не так, попробуйте перезагрузить страницу' />
      )}

      {(isSuccess(exercisesList.loadingStatus) && isSuccess(trainingProgramsList.loadingStatus)) && (
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
                  disabled={isLoading(createWorkoutLS)}
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
                disabled={isLoading(createWorkoutLS)}
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
            value={trainingProgramsList.data.find((tp) => tp.name == submitData.title) || null }
            getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
            onInputChange={handleInputChange}
            onChange={handleProgramChange}
            freeSolo
            disabled={isLoading(createWorkoutLS)}
            options={trainingProgramsList.data}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Название тренировки"
                size="small"
                fullWidth
                error={!!errors.title}
                helperText={errors.title || ''}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoading(trainingProgramsList.loadingStatus) && <CircularProgress color="inherit" size={16} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />
        </FormGrid>

        {/* Упражнения */}
        <Grid2 >
          <Typography sx={{ pt: 2, pb: 1,  fontSize: 14, fontWeight: 600, color: theme.palette.grey[700] }}>Проведенные упражнения</Typography>

          {submitData.exercises.map((exercise, index) => (
            <Grid2 
              key={exercise.id} 
              container 
              size={12} 
              spacing={{ xs: 1.25, sm: 2 }} 
              sx={{ 
                mb: { xs: 1.5, md: 2 }, 
                p:  { xs: 0.5, sm: 2 },  
                borderRadius: 1, 
                border: { xs: 'none', sm: `1px solid ${theme.palette.grey[100]}` },
              }}
            >
              <Grid2 sx={{ mb: 1.5, display: { xs: 'block', sm: 'none' } }} size={12}><Divider flexItem /></Grid2>
              <Grid2 item size={{ xs: 12, md: 5 }}>
                <Autocomplete
                  value={exercisesList.data.find((ex) => ex.exercise_id == exercise.exercse_id) || null }
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => handleExerciseChange(index, "exercse_id", newValue ? newValue.exercise_id : null)}
                  options={exercisesList.data}
                  disabled={isLoading(createWorkoutLS)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Упражнение"
                      size="small"
                      error={!!errors.exercises[exercise.id]?.exercse_id}
                      helperText={errors.exercises[exercise.id]?.exercse_id}
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

              {["weight", "sets", "reps"].map((field) => (
                <Tooltip title={!exercise.exercse_id ? 'Выберите упражнение' : ''} placement="top">
                  <Grid2 size={{ xs: 3, md: 2 }} key={field}>
                    <FormControl fullWidth size="small" error={!!errors.exercises[exercise.id]?.[field]}>
                      <OutlinedInput
                        placeholder={field === "weight" ? "Вес" : field === "sets" ? "Подходы" : "Повторения"}
                        value={exercise[field]}
                        onChange={(e) => handleExerciseChange(index, field, e.target.value)}
                        disabled={isLoading(createWorkoutLS) || !exercise.exercse_id}
                      />
                      <FormHelperText>{errors.exercises[exercise.id]?.[field] || ''}</FormHelperText>
                    </FormControl>
                  </Grid2>
                </Tooltip>
              ))}

              <Tooltip title={submitData.exercises.length == 1 ? 'Нельзя удалить единственное упражнение' : 'Удалить упражнение'} placement="top" >
                <Grid2 size={{ xs: 3, md: 1 }} container sx={{ alignSelf: 'baseline' }}>
                  <IconButton
                    sx={{ width: '100%',  }} 
                    disabled={submitData.exercises.length == 1 || isLoading(createWorkoutLS)} 
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
              <Button
                onClick={submit}
                variant="contained"
                color="secondary"
                startIcon={isLoading(createWorkoutLS) ? <CircularProgress sx={{ color: theme.palette.brand[700] }} size={16} /> : <Done />}
                fullWidth
                disabled={isLoading(createWorkoutLS)}
              >
                Записать тренировку
              </Button>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Button disabled={isLoading(createWorkoutLS)} onClick={addExercise} variant="contained" startIcon={<Add />} fullWidth>Добавить упражнение</Button>
            </Grid2>
          </Grid2>
        </FormGrid>
      )}
    </CustomCard>
  )
}

const FormGrid = styled(Grid2)(() => ({ display: 'flex', flexDirection: 'column' }));

export default AddWorkout