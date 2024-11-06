import { createSlice  } from '@reduxjs/toolkit';
import { LOADING_STATUS } from '@constants/redux.constants';
import { checkAuth, login, register } from './auth.thunks';

const initialState = {
  isAuth:     false,
  user:       null,
  authLS:     LOADING_STATUS.IDLE,
  loginLS:    LOADING_STATUS.IDLE
}


const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    clearAuthLS(state)  { state.authLS = initialState.authLS },
    clearLoginLS(state) { state.authLS = initialState.loginLS },
  },
  extraReducers: (builder) => {
    // checkAuth
    builder.addCase(checkAuth.pending,    (state) => { state.authLS = LOADING_STATUS.LOADING })
    builder.addCase(checkAuth.rejected,   (state) => { state.authLS = LOADING_STATUS.FAILED })
    builder.addCase(checkAuth.fulfilled,  (state, action) => {
      const { user, isAuth } = action.payload

      state.authLS  = LOADING_STATUS.SUCCESS
      state.isAuth  = isAuth
      state.user    = user
    });

    // login
    builder.addCase(login.pending,    (state) => { state.loginLS = LOADING_STATUS.LOADING })
    builder.addCase(login.rejected,   (state) => { state.loginLS = LOADING_STATUS.FAILED })
    builder.addCase(login.fulfilled,  (state, action) => {
      const { user, isAuth } = action.payload

      state.loginLS = LOADING_STATUS.SUCCESS
      state.isAuth  = isAuth
      state.user    = user
    });

    // register
    builder.addCase(register.pending,    (state) => { state.loginLS = LOADING_STATUS.LOADING })
    builder.addCase(register.rejected,   (state) => { state.loginLS = LOADING_STATUS.FAILED })
    builder.addCase(register.fulfilled,  (state, action) => {
      const { user, isAuth } = action.payload

      state.loginLS = LOADING_STATUS.SUCCESS
      state.isAuth  = isAuth
      state.user    = user
    });
  }
});


export const { clearAuthLS, clearLoginLS } = authSlice.actions;
export default authSlice.reducer;