import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import store from '@store/store.js';
import router from '@router/router.jsx';
import { AuthProvider } from '@components';
import { CssBaseline } from '@mui/material';
import ThemeProvider from '@theme/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import dayjs from "dayjs";
import "dayjs/locale/ru"; 

dayjs.locale("ru")


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider>
      <CssBaseline enableColorScheme />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <Toaster position="top-right" />
    </ThemeProvider>   
  </Provider>
)