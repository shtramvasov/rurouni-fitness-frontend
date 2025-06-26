import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import store from '@store/store.js';
import router from '@router/router.jsx';
import { AuthProvider } from '@components';
import { CssBaseline } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ruRU } from "@mui/x-date-pickers/locales";
import ThemeProvider from '@theme/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import dayjs from "dayjs";
import "dayjs/locale/ru"; 

dayjs.locale("ru")

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/600.css';
import '@fontsource/roboto/700.css';


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDayjs} localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}>
      <ThemeProvider>
        <CssBaseline enableColorScheme />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <Toaster position="top-center" />
      </ThemeProvider>   
    </LocalizationProvider>
  </Provider>
)