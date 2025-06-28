import { createSlice  } from '@reduxjs/toolkit';
import { LOADING_STATUS } from '@constants/redux.constants';
import { uploadFile } from './files.thinks';

const initialState = {
  uploadFileLS: LOADING_STATUS.IDLE
}


const filesSlice = createSlice({
  name: 'files',
  initialState: initialState,
  reducers: {
    clearuploadFileLS(state)     { state.uploadFileLS  = initialState.uploadFileLS },

  },
  extraReducers: (builder) => {
    // uploadFile
    builder.addCase(uploadFile.pending,    (state) => { state.uploadFileLS = LOADING_STATUS.LOADING })
    builder.addCase(uploadFile.rejected,   (state) => { state.uploadFileLS = LOADING_STATUS.FAILED })
    builder.addCase(uploadFile.fulfilled,  (state) => { state.uploadFileLS = LOADING_STATUS.SUCCESS })
    
  }
});


export const { clearuploadFileLS } = filesSlice.actions;
export default filesSlice.reducer;