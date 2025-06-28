import { createSlice  } from '@reduxjs/toolkit';
import { LOADING_STATUS } from '@constants/redux.constants';
import { updateUser, resetPassword } from './users.thunks';


const initialState = {
  updateUserLS:     LOADING_STATUS.IDLE,
  resetPasswordLS:  LOADING_STATUS.IDLE
}


const usersSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {
    clearupdateUserLS(state) { state.updateUserLS = initialState.updateUserLS },
    clearResetPasswordLS(state) { state.resetPasswordLS = initialState.resetPasswordLS }
  },
  extraReducers: (builder) => {
    // updateUser
    builder.addCase(updateUser.pending,    (state) => { state.updateUserLS = LOADING_STATUS.LOADING })
    builder.addCase(updateUser.rejected,   (state) => { state.updateUserLS = LOADING_STATUS.FAILED })
    builder.addCase(updateUser.fulfilled,  (state, action) => { state.updateUserLS = LOADING_STATUS.SUCCESS});

    // resetPassword
    builder.addCase(resetPassword.pending,    (state) => { state.resetPasswordLS = LOADING_STATUS.LOADING })
    builder.addCase(resetPassword.rejected,   (state) => { state.resetPasswordLS = LOADING_STATUS.FAILED })
    builder.addCase(resetPassword.fulfilled,  (state, action) => { state.resetPasswordLS = LOADING_STATUS.SUCCESS});
  }
});


export const { clearupdateUserLS, clearResetPasswordLS } = usersSlice.actions;
export default usersSlice.reducer;