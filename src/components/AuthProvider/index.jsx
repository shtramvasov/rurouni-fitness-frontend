import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '@store/slices/Auth/auth.thunks';
import { isLoading } from '@constants/redux.constants';
import { Box, LinearProgress, Typography } from '@mui/material';


// Проверка авторизации перед рендерингом приложения
function AuthProvider({ children }) {
  const [progress, setProgress] = useState(0);
  const isAuthRequired = !['/login', '/registration'].includes(window.location.pathname);

  const dispatch = useDispatch();

  const { authLS, isAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    const verifyAuth = async () => {
      
      if (isAuthRequired) {
        // Запуск фейкового прогресса
        const interval = setInterval(() => setProgress((prev) => (prev < 90 ? prev + 10 : prev)), 50);

        try {
          const result = await dispatch(checkAuth()).unwrap();

          if(!result.isAuth) window.location.replace('/login')

        } finally {
          clearInterval(interval)
          setProgress(100)
        }       
      }
    };

    verifyAuth();
  }, []);

  
  if (isLoading(authLS)) {
    return (
      <Box 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)' 
        }}
      >
        <LinearProgress variant='determinate' value={progress} sx={{ height: 5 }} color='info' />

        <Box 
          sx={{ 
            display: 'flex', 
            flexGrow: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            opacity: progress > 30 ? 1 : 0, 
            transition: 'opacity 1s ease-in-out'
          }}
        >
          <Typography color='gray.500' variant='h2'>Rurouni Fitness</Typography>
        </Box>

      </Box>
    )
  }

  if(!isAuthRequired || isAuth) {
    return children 
  }
}

export default AuthProvider