import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/Auth/auth.slice'
import exercisesReducer from './slices/Exercises/exercises.slice'
import trainingProgramsReducer from './slices/TrainingPrograms/training_programs.slice'
import workoutsReducer from './slices/Workouts/workouts.slice'

const store = configureStore({
  reducer: {
    auth:                 authReducer,
    exercises:            exercisesReducer,
    trainingPrograms:     trainingProgramsReducer,
    workouts:             workoutsReducer
  },
});


export default store
