import { createAsyncThunk } from "@reduxjs/toolkit";
import FilesController from "@api/files/FilesController";

export const uploadFile = createAsyncThunk(
  'auth/uploadFile', 
  async ({ type, file }) => await FilesController.uploadFile(type, file)
)

