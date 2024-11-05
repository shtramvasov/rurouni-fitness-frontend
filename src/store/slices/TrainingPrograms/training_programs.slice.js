import { createSlice  } from '@reduxjs/toolkit';
import { LOADING_STATUS } from '@constants/redux.constants';
import { getTrainingProgramsList } from './training_programs.thunks';

const initialState = {
  trainingProgramsList: {
    data: [],
    loadingStatus: LOADING_STATUS.IDLE
  }
}


const trainingProgramsSlice = createSlice({
  name: 'training_programs',
  initialState: initialState,
  reducers: {
    clearTrainingProgramsList(state)  { state.trainingProgramsList = initialState.trainingProgramsList },
  },
  extraReducers: (builder) => {
    // getTrainingProgramsList
    builder.addCase(getTrainingProgramsList.pending,    (state) => { state.trainingProgramsList.loadingStatus = LOADING_STATUS.LOADING })
    builder.addCase(getTrainingProgramsList.rejected,   (state) => { state.trainingProgramsList.loadingStatus = LOADING_STATUS.FAILED })
    builder.addCase(getTrainingProgramsList.fulfilled,  (state, action) => {
      state.trainingProgramsList = { data: action.payload, loadingStatus: LOADING_STATUS.SUCCESS }
    });

    
  }
});


export const { clearTrainingProgramsList } = trainingProgramsSlice.actions;
export default trainingProgramsSlice.reducer;