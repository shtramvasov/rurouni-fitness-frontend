import { createAsyncThunk } from "@reduxjs/toolkit";
import TrainingProgramsController from "@api/training_programs/TrainingProgramsController";

export const getTrainingProgramsList = createAsyncThunk(
  'auth/getTrainingProgramsList', 
  async (params) => await TrainingProgramsController.getTrainingProgramsList(params)
)
