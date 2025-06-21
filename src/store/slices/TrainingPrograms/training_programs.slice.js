import { createSlice  } from '@reduxjs/toolkit';
import { LOADING_STATUS } from '@constants/redux.constants';
import { getTrainingProgramsList, updateTrainingProgram } from './training_programs.thunks';

const initialState = {
  trainingProgramsList: {
    data: [],
    loadingStatus: LOADING_STATUS.IDLE
  },

  updateTrainingProgramLS: LOADING_STATUS.IDLE
}


const trainingProgramsSlice = createSlice({
  name: 'training_programs',
  initialState: initialState,
  reducers: {
    clearTrainingProgramsList(state)  { state.trainingProgramsList = initialState.trainingProgramsList },
    clearUpdateTrainingProgramLS(state) { state.updateTrainingProgramLS = initialState.updateTrainingProgramLS },
  },
  extraReducers: (builder) => {
    // getTrainingProgramsList
    builder.addCase(getTrainingProgramsList.pending,    (state) => { state.trainingProgramsList.loadingStatus = LOADING_STATUS.LOADING })
    builder.addCase(getTrainingProgramsList.rejected,   (state) => { state.trainingProgramsList.loadingStatus = LOADING_STATUS.FAILED })
    builder.addCase(getTrainingProgramsList.fulfilled,  (state, action) => {
      state.trainingProgramsList = { data: action.payload, loadingStatus: LOADING_STATUS.SUCCESS }
    });

    // updateTrainingProgram
    builder.addCase(updateTrainingProgram.pending,    (state) => { state.updateTrainingProgramLS = LOADING_STATUS.LOADING })
    builder.addCase(updateTrainingProgram.rejected,   (state) => { state.updateTrainingProgramLS = LOADING_STATUS.FAILED })
    builder.addCase(updateTrainingProgram.fulfilled,  (state, action) => { state.updateTrainingProgramLS = LOADING_STATUS.SUCCESS});

    
  }
});


export const { clearTrainingProgramsList, clearUpdateTrainingProgramLS } = trainingProgramsSlice.actions;
export default trainingProgramsSlice.reducer;