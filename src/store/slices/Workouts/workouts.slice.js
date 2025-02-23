import { createSlice  } from '@reduxjs/toolkit';
import { LOADING_STATUS } from '@constants/redux.constants';
import { getWorkoutsList, getWorkoutDetails, postWorkout } from './workouts.thunks';

const initialState = {
  workoutsList: {
    data: [],
    loadingStatus: LOADING_STATUS.IDLE
  },

  workoutDetails: {
    data: [],
    loadingStatus: LOADING_STATUS.IDLE
  },

  createWorkoutLS: LOADING_STATUS.IDLE
}


const workoutsSlice = createSlice({
  name: 'workouts',
  initialState: initialState,
  reducers: {
    clearWorkoutsList(state)      { state.workoutsList      = initialState.workoutsList },
    clearWorkoutDetails(state)    { state.workoutDetails    = initialState.workoutDetails },
    clearCreateWorkoutLS(state)   { state.createWorkoutLS   = initialState.createWorkoutLS },
  },
  extraReducers: (builder) => {
    // getWorkoutsList
    builder.addCase(getWorkoutsList.pending,    (state) => { state.workoutsList.loadingStatus = LOADING_STATUS.LOADING })
    builder.addCase(getWorkoutsList.rejected,   (state) => { state.workoutsList.loadingStatus = LOADING_STATUS.FAILED })
    builder.addCase(getWorkoutsList.fulfilled,  (state, action) => {
      state.workoutsList = { data: [...state.workoutsList.data, ...action.payload], loadingStatus: LOADING_STATUS.SUCCESS }
    });

    // getWorkoutDetails
    builder.addCase(getWorkoutDetails.pending,    (state) => { state.workoutDetails.loadingStatus = LOADING_STATUS.LOADING })
    builder.addCase(getWorkoutDetails.rejected,   (state) => { state.workoutDetails.loadingStatus = LOADING_STATUS.FAILED })
    builder.addCase(getWorkoutDetails.fulfilled,  (state, action) => {
      state.workoutDetails = { data: action.payload, loadingStatus: LOADING_STATUS.SUCCESS }
    });


    // postWorkout
    builder.addCase(postWorkout.pending,    (state) => { state.createWorkoutLS  = LOADING_STATUS.LOADING })
    builder.addCase(postWorkout.rejected,   (state) => { state.createWorkoutLS  = LOADING_STATUS.FAILED })
    builder.addCase(postWorkout.fulfilled,  (state) => { state.createWorkoutLS  = LOADING_STATUS.SUCCESS })   
  }
});


export const { clearWorkoutsList, clearWorkoutDetails, clearCreateWorkoutLS } = workoutsSlice.actions;
export default workoutsSlice.reducer;