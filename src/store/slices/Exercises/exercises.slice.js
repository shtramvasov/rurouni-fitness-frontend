import { createSlice  } from '@reduxjs/toolkit';
import { LOADING_STATUS } from '@constants/redux.constants';
import { getExercisesList, getExerciseDetails } from './exercises.thunks';

const initialState = {
  exercisesList: {
    data: [],
    loadingStatus: LOADING_STATUS.IDLE
  },

  exerciseDetails: {
    data: [],
    loadingStatus: LOADING_STATUS.IDLE
  }
}


const exercisesSlice = createSlice({
  name: 'exercises',
  initialState: initialState,
  reducers: {
    clearExercisesList(state)     { state.exercisesList   = initialState.exercisesList },
    clearExerciseDetails(state)   { state.exerciseDetails = initialState.exerciseDetails },
  },
  extraReducers: (builder) => {
    // getExercisesList
    builder.addCase(getExercisesList.pending,    (state) => { state.exercisesList.loadingStatus = LOADING_STATUS.LOADING })
    builder.addCase(getExercisesList.rejected,   (state) => { state.exercisesList.loadingStatus = LOADING_STATUS.FAILED })
    builder.addCase(getExercisesList.fulfilled,  (state, action) => {
      state.exercisesList = { data: action.payload, loadingStatus: LOADING_STATUS.SUCCESS }
    });

    // getExerciseDetails
    builder.addCase(getExerciseDetails.pending,    (state) => { state.exerciseDetails.loadingStatus = LOADING_STATUS.LOADING })
    builder.addCase(getExerciseDetails.rejected,   (state) => { state.exerciseDetails.loadingStatus = LOADING_STATUS.FAILED })
    builder.addCase(getExerciseDetails.fulfilled,  (state, action) => {
      state.exerciseDetails = { data: action.payload, loadingStatus: LOADING_STATUS.SUCCESS }
    });

    
  }
});


export const { clearExercisesList, clearExerciseDetails } = exercisesSlice.actions;
export default exercisesSlice.reducer;