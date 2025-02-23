import { createAsyncThunk } from "@reduxjs/toolkit";
import AuthController from "@api/auth/AuthController";

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => await AuthController.checkAuth())

export const login = createAsyncThunk('auth/login', async (params) => await AuthController.login(params))

export const logout = createAsyncThunk('auth/logout', async () => await AuthController.logout())

export const register = createAsyncThunk('auth/register', async (params) => await AuthController.register(params))