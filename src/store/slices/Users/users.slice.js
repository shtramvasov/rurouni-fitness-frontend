import { createSlice  } from '@reduxjs/toolkit';
import { LOADING_STATUS } from '@constants/redux.constants';
import { updateUser, resetPassword, getRecentLogins, updateUserSettings, verifyTelegram } from './users.thunks';


const initialState = {
  updateUserLS:     LOADING_STATUS.IDLE,
  resetPasswordLS:  LOADING_STATUS.IDLE,
  updateUserSettingsLS: LOADING_STATUS.IDLE,
  verifyTelegramLS: LOADING_STATUS.IDLE,

  recentLoginsList: {
    data: [],
    loadingStatus: LOADING_STATUS.IDLE
  },
}


const usersSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {
    clearupdateUserLS(state) { state.updateUserLS = initialState.updateUserLS },
    clearResetPasswordLS(state) { state.resetPasswordLS = initialState.resetPasswordLS },
    clearRecentLoginsList(state) { state.recentLoginsList = initialState.recentLoginsList },
    clearUpdateUserSettingsLS(state) { state.updateUserSettingsLS = initialState.updateUserSettingsLS },
    clearVerifyTelegramLS(state) { state.verifyTelegramLS = initialState.verifyTelegramLS },
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
    
    // getRecentLogins
    builder.addCase(getRecentLogins.pending,    (state) => { state.recentLoginsList.loadingStatus = LOADING_STATUS.LOADING })
    builder.addCase(getRecentLogins.rejected,   (state) => { state.recentLoginsList.loadingStatus = LOADING_STATUS.FAILED })
    builder.addCase(getRecentLogins.fulfilled,  (state, action) => {
      state.recentLoginsList = { data: action.payload, loadingStatus: LOADING_STATUS.SUCCESS }
    });

    // updateUserSettings
    builder.addCase(updateUserSettings.pending,    (state) => { state.updateUserSettingsLS = LOADING_STATUS.LOADING })
    builder.addCase(updateUserSettings.rejected,   (state) => { state.updateUserSettingsLS = LOADING_STATUS.FAILED })
    builder.addCase(updateUserSettings.fulfilled,  (state, action) => { state.updateUserSettingsLS = LOADING_STATUS.SUCCESS});

    // verifyTelegram
    builder.addCase(verifyTelegram.pending,    (state) => { state.verifyTelegramLS = LOADING_STATUS.LOADING })
    builder.addCase(verifyTelegram.rejected,   (state) => { state.verifyTelegramLS = LOADING_STATUS.FAILED })
    builder.addCase(verifyTelegram.fulfilled,  (state, action) => { state.verifyTelegramLS = LOADING_STATUS.SUCCESS});
  }
});


export const { clearupdateUserLS, clearResetPasswordLS, clearRecentLoginsList, clearUpdateUserSettingsLS, clearVerifyTelegramLS } = usersSlice.actions;
export default usersSlice.reducer;