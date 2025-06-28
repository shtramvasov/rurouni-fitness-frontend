import { createAsyncThunk } from "@reduxjs/toolkit";
import UsersController from "@api/users/UsersController";


export const updateUser = createAsyncThunk(
  'auth/updateUser', 
  async ({ params }) => await UsersController.updateUser(params)
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword', 
  async () => await UsersController.resetPassword()
)