import { createAsyncThunk } from "@reduxjs/toolkit";
import TrainingProgramsController from "@api/training_programs/TrainingProgramsController";

export const getTrainingProgramsList = createAsyncThunk(
  'auth/getTrainingProgramsList', 
  async ({ params }) => await TrainingProgramsController.getTrainingProgramsList(params)
)

export const updateTrainingProgram = createAsyncThunk(
  'auth/updateTrainingProgram', 
  async ({ program_id, params }) => await TrainingProgramsController.updateTrainingProgram(program_id, params)
)
