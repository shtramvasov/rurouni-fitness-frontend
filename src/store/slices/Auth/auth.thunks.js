import { createAsyncThunk } from "@reduxjs/toolkit";
import AuthController from "@api/auth/AuthController";

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => await AuthController.checkAuth())

export const login = createAsyncThunk('auth/login', async (params) => await AuthController.login(params))

export const register = createAsyncThunk('auth/register', async (params) => await AuthController.register(params))