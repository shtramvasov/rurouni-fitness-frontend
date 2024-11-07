import { createAsyncThunk } from "@reduxjs/toolkit";
import ExercisesController from "@api/exercises/ExercisesController";

export const getExercisesList = createAsyncThunk(
  'auth/getExercisesList',
  async ({ params, is_infinite }) => {
    const result = await ExercisesController.getExercisesList(params)

    return { result, is_infinite };
  }
)

export const getExerciseDetails = createAsyncThunk('auth/getExerciseDetails', async (id) => await ExercisesController.getExerciseDetails(id))
