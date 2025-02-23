import { createAsyncThunk } from "@reduxjs/toolkit";
import WorkoutsController from "@api/workouts/WorkoutsController";

export const getWorkoutsList = createAsyncThunk('auth/getWorkoutsList', async (params) => await WorkoutsController.getWorkoutsList(params))

export const getWorkoutDetails = createAsyncThunk('auth/getWorkoutDetails', async (id) => await WorkoutsController.getWorkoutDetails(id))

export const postWorkout = createAsyncThunk('auth/postWorkout', async (params) => await WorkoutsController.postWorkout(params))