import { createSlice  } from '@reduxjs/toolkit';
import { LOADING_STATUS } from '@constants/redux.constants';
import { getExercisesList, getExerciseDetails, getMuscleGroupUsedCount } from './exercises.thunks';

const initialState = {
  exercisesList: {
    data: [],
    loadingStatus: LOADING_STATUS.IDLE
  },

  exerciseDetails: {
    data: [],
    loadingStatus: LOADING_STATUS.IDLE
  },

  muscleGroupStats: {
    data: [],
    loadingStatus: LOADING_STATUS.IDLE
  }
}


const exercisesSlice = createSlice({
  name: 'exercises',
  initialState: initialState,
  reducers: {
    clearExercisesList(state)     { state.exercisesList     = initialState.exercisesList },
    clearExerciseDetails(state)   { state.exerciseDetails   = initialState.exerciseDetails },
    clearMuscleGroupStats(state)  { state.muscleGroupStats  = initialState.muscleGroupStats },
  },
  extraReducers: (builder) => {
    // getExercisesList
    builder.addCase(getExercisesList.pending,    (state) => { state.exercisesList.loadingStatus = LOADING_STATUS.LOADING })
    builder.addCase(getExercisesList.rejected,   (state) => { state.exercisesList.loadingStatus = LOADING_STATUS.FAILED })
    builder.addCase(getExercisesList.fulfilled,  (state, action) => {
      const { result, is_infinite } = action.payload

      state.exercisesList.loadingStatus = LOADING_STATUS.SUCCESS

      state.exercisesList.data = is_infinite ? [...state.exercisesList.data, ...result] : result
    });

    // getExerciseDetails
    builder.addCase(getExerciseDetails.pending,    (state) => { state.exerciseDetails.loadingStatus = LOADING_STATUS.LOADING })
    builder.addCase(getExerciseDetails.rejected,   (state) => { state.exerciseDetails.loadingStatus = LOADING_STATUS.FAILED })
    builder.addCase(getExerciseDetails.fulfilled,  (state, action) => {
      state.exerciseDetails = { data: action.payload, loadingStatus: LOADING_STATUS.SUCCESS }
    });

    // getMuscleGroupUsedCount
    builder.addCase(getMuscleGroupUsedCount.pending,    (state) => { state.muscleGroupStats.loadingStatus = LOADING_STATUS.LOADING })
    builder.addCase(getMuscleGroupUsedCount.rejected,   (state) => { state.muscleGroupStats.loadingStatus = LOADING_STATUS.FAILED })
    builder.addCase(getMuscleGroupUsedCount.fulfilled,  (state, action) => {
      state.muscleGroupStats = { data: action.payload, loadingStatus: LOADING_STATUS.SUCCESS }
    });
    
  }
});


export const { clearExercisesList, clearExerciseDetails, clearMuscleGroupStats } = exercisesSlice.actions;
export default exercisesSlice.reducer;