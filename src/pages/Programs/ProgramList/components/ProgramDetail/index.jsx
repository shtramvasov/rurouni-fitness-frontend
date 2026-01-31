import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isFulfilled } from "@reduxjs/toolkit";
import { Box, Grid2, IconButton, Divider, Typography, CircularProgress, useTheme, Button, Tooltip, TextField, FormHelperText, styled, Switch, FormControlLabel, OutlinedInput, FormControl, Autocomplete } from "@mui/material";
import { CloseRounded, Delete, Add, Done } from "@mui/icons-material";
import { validateField, validateNumber } from "@helpers/validations";
import { isLoading, PAGINATION } from "@constants/redux.constants";
import { getExercisesList } from "@store/slices/Exercises/exercises.thunks";
import toast from "react-hot-toast";
import { getTrainingProgramsList, updateTrainingProgram } from "@store/slices/TrainingPrograms/training_programs.thunks";
import { clearUpdateTrainingProgramLS } from "@store/slices/TrainingPrograms/training_programs.slice";


export function ProgramDetail({program, onClose}) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { exercisesList } = useSelector(state => state.exercises)
  const { updateTrainingProgramLS } = useSelector(state => state.trainingPrograms)

  const [submitData, setSubmitData] = useState(program)
  const [errors, setErrors] = useState({ title: false, exercises: [] });

  useEffect(() => {
    dispatch(getExercisesList({ params: { limit: 200 } }))
  }, [])

  const handleExerciseChange = (index, field, value) => {
    let sanitizedValue = value;

    if (["sets", "reps"].includes(field)) {
      // Удаляем все нецифровые символы
      sanitizedValue = value.replace(/\D/g, ""); 
  
      // Ограничения по длине
      sanitizedValue = sanitizedValue.slice(0, 2);
    }

    setSubmitData((prev) => {
        const updatedExercises = [...prev.exercises];
      
        updatedExercises[index] = {
            ...updatedExercises[index],
            [field]: sanitizedValue,
        };

        return { ...prev, exercises: updatedExercises };
    });
  };

  const addExercise = () => {
    setSubmitData((prev) => ({...prev, exercises: [...prev.exercises, { id: Date.now(), exercise_id: null, weight: null, sets: null, reps: null, exercise_order: null, room: null }]}));
  };

  const removeExercise = (id) => {
    setSubmitData((prev) => {
      const updatedExercises = prev.exercises.filter((exercise) => exercise.exercise_id !== id);
      
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
    if (!submitData.name?.trim()) {
      newErrors.name = "Обязательно";
      isValid = false;
    }

    // Проверка на пустое описание
    if (!submitData.description?.trim()) {
      newErrors.description = "Обязательно";
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
        exercise_id:    validateField(ex.exercise_id),
        sets:           validateNumber(ex.sets),
        reps:           validateNumber(ex.reps),
      };
  
      // Если есть ошибка, отмечаем как некорректное
      if (Object.values(error).some(Boolean)) {
        isValid = false;
      }
  
      newErrors.exercises[ex.exercise_id] = error;
    });

    setErrors(newErrors);
    return isValid;
  };

  const submit = async () => {
    if (!validateForm()) return;

    if(!isLoading(updateTrainingProgramLS)) {
      const response = await dispatch(updateTrainingProgram({
        program_id: submitData.program_id,
        params: {
          name:         submitData.name,
          description:  submitData.description,
          is_active:    submitData.is_active,
          exercises:    submitData.exercises
        }
      }))

      if(isFulfilled(response)) {
        toast.success('Изменения сохранены')
        dispatch(clearUpdateTrainingProgramLS())
        
        const updatedList = await dispatch(getTrainingProgramsList({ params: { limit: PAGINATION.DEFAULT_LIMIT }}))
        if(isFulfilled(updatedList)) onClose()   
        if(updatedList.error) toast.error('Произошла ошибка')  
      }

      if(response.error) toast.error('Произошла ошибка')
      
    }
  }


  return (
    <Box>
      <Grid2 container sx={{ py: 2, px: 3, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4">Редактирование</Typography>
        <Tooltip title='Закрыть'>
          <IconButton onClick={onClose}><CloseRounded /></IconButton>
        </Tooltip>
      </Grid2>
      <Divider />

      <Grid2 container sx={{ py: 3, px: 3, gap: 2.5 }}>
        <Grid2 size={12} container spacing={2} sx={{ alignItems: 'center' }}>
          <FormGrid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" fontWeight={500}>Название тренировки</Typography>
            <TextField 
              onChange={(e) => setSubmitData(prev => ({...prev, name: e.target.value }))}
              value={submitData.name}
              placeholder="Название тренирокви"
              size="small"
              error={!!errors.name}
              helperText={errors.name || ''}
              disabled={isLoading(updateTrainingProgramLS)}
            />
          </FormGrid>
          <FormGrid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" fontWeight={500}>Описание</Typography>
            <TextField 
              onChange={(e) => setSubmitData(prev => ({...prev, description: e.target.value }))}
              value={submitData.description}
              placeholder="Описание"
              size="small"
              error={!!errors.description}
              helperText={errors.description || ''}
              disabled={isLoading(updateTrainingProgramLS)}
            />
          </FormGrid>
          <FormGrid size={1} sx={{ mt: 2 }}>
            <FormControlLabel 
              label={submitData.is_active ? 'Активная' : 'Неактивная'}
              control={<Switch checked={submitData.is_active} onChange={(e) => setSubmitData(prev => ({...prev, is_active: e.target.checked }))} />} 
            />
          </FormGrid>
        </Grid2>

        {/* Упражнения */}
        <Grid2 container size={12} spacing={{ xs: 1.25, sm: 2 }} >
          {submitData.exercises.map((exercise, index) => (
            <Grid2 
              key={exercise.id} 
              container 
              size={12} 
              spacing={{ xs: 1.25, sm: 2 }}
              sx={{ 
                p:  { xs: 0.5, sm: 2 },
                borderRadius: 1, 
                border: { xs: 'none', sm: `1px solid ${theme.palette.grey[100]}`  },
              }}
            >
              <Grid2 sx={{ mb: 1.5, display: { xs: 'block', sm: 'none' } }} size={12}><Divider flexItem /></Grid2>
              <Grid2 item size={{ xs: 12, md: 9 }}>
                <Autocomplete
                  value={exercisesList.data.find((ex) => ex.exercise_id === exercise.exercise_id) || null}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => handleExerciseChange(index, "exercise_id", newValue ? newValue.exercise_id : null)}
                  options={exercisesList.data}
                  disabled={isLoading(updateTrainingProgramLS)}
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
                      error={!!errors.exercises[exercise.id]?.exercise_id}
                      helperText={errors.exercises[exercise.id]?.exercise_id}
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

              {["sets", "reps"].map((field) => (
                <Tooltip title={!exercise.exercise_id ? 'Выберите упражнение' : ''} placement="top">
                  <Grid2 size={{ xs: 4, md: 1 }} key={field}>
                    <FormControl fullWidth size="small" error={!!errors.exercises[exercise.exercise_id]?.[field]}>
                      <OutlinedInput
                        placeholder={field === "sets" ? "Подходы" : "Повторения"}
                        value={exercise[field]}
                        onChange={(e) => handleExerciseChange(index, field, e.target.value)}
                        disabled={isLoading(updateTrainingProgramLS) || !exercise.exercise_id}
                      />
                      <FormHelperText>{errors.exercises[exercise.exercise_id]?.[field] || ''}</FormHelperText>
                    </FormControl>
                  </Grid2>
                </Tooltip>
              ))}

              <Tooltip title={submitData.exercises.length == 1 ? 'Нельзя удалить единственное упражнение' : 'Удалить упражнение'} placement="top" >
                <Grid2 size={{ xs: 4, md: 1 }} container sx={{ alignSelf: 'baseline' }}>
                  <IconButton
                    sx={{ width: '100%',  }} 
                    disabled={submitData.exercises.length == 1 || isLoading(updateTrainingProgramLS)} 
                    size="small" 
                    onClick={() => removeExercise(exercise.exercise_id)}
                  >
                    <Delete />
                  </IconButton>
                </Grid2>
              </Tooltip>
            </Grid2>
          ))}
        </Grid2>

        <Grid2 size={12} container spacing={1}>
          <Button disabled={isLoading(updateTrainingProgramLS)} onClick={addExercise} variant="contained" startIcon={<Add />} fullWidth>
            Добавить упражнение
          </Button>
 
          <Button
            onClick={submit}
            variant="contained"
            color="secondary"
            startIcon={isLoading(updateTrainingProgramLS) ? <CircularProgress sx={{ color: theme.palette.brand[700] }} size={16} /> : <Done />}
            fullWidth
            disabled={isLoading(updateTrainingProgramLS)}
          >
            Сохранить изменения
          </Button>
    
        </Grid2>

      </Grid2>
    </Box>
  )
}

const FormGrid = styled(Grid2)(() => ({ display: 'flex', flexDirection: 'column' }));

export default ProgramDetail;