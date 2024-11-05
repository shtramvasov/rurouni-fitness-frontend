import { createAsyncThunk } from "@reduxjs/toolkit";
import ExercisesController from "@api/exercises/ExercisesController";

export const getExercisesList = createAsyncThunk('auth/getExercisesList',   async (params) => await ExercisesController.getExercisesList(params))

export const getExerciseDetails = createAsyncThunk('auth/getExerciseDetails', async (id) => await ExercisesController.getExerciseDetails(id))
