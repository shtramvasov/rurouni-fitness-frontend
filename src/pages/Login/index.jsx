import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, TextField, Button, FormControl, FormLabel, Link, CircularProgress, Stack, useTheme } from "@mui/material";
import { isLoading } from "@constants/redux.constants";
import { isFulfilled } from "@reduxjs/toolkit";
import { login, register } from "@store/slices/Auth/auth.thunks";
import { ROUTES } from "@constants/routes.constants";
import toast from "react-hot-toast";
import { CustomCard } from "@components";


function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const theme = useTheme();
  const initialData = { username: '', password: '', email: '', display_name: '' }

  const { loginLS } = useSelector(store => store.auth)

  const [isLogin, setIsLogin] = useState(true);  
  const [submitData, setSubmitData] = useState(initialData)

  const submit = async () => {   
    if(isLoading(loginLS)) return;

    const { username, password, email, display_name } = submitData;

    const action = isLogin 
      ? login({ username, password }) 
      : register({ username, password, email, display_name });

    const result = await dispatch(action);

    if(isFulfilled(result)) {
      const { display_name, username } = result.payload.user

      toast.success(`Добро пожаловать, ${display_name ?? username }`)
      navigate(ROUTES.DASHBOARD.PATH)
    }
  }
  
  const reset = () => setSubmitData(initialData)

  return (
    <Stack 
      direction="column" 
      justifyContent="space-between"
      sx={{ 
        mt: 15, 
        '&::before': {
          content: '""',
          display: 'block',
          position: 'absolute',
          zIndex: -1,
          inset: 0,
          backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
          backgroundRepeat: 'no-repeat',
        },     
      }} 
    >
      <CustomCard  
        sx={{ 
          width: '100%',
          maxWidth: '500px', 
          alignSelf: 'center', 
          p: 4, 
          gap: 2
        }} 
      >
        <Typography component="h1" variant="h4" color="gray.700" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
          Rurouni Fitness
        </Typography>
        <Box component="form" onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
          <FormControl>
            <FormLabel htmlFor="username">Имя пользователя {!isLogin && <span style={{ color: theme.palette.red[300] }}>*</span>}</FormLabel>
            <TextField 
                id="username"
                required
                fullWidth
                placeholder={`Имя пользователя ${isLogin ? 'или почта' : ''}` } 
                value={submitData.username} 
                onChange={(e) => setSubmitData(prev => ({ ...prev, username: e.target.value }))}
              />
          </FormControl>

          {!isLogin && (
            <FormControl>
              <FormLabel htmlFor="email">Почта {!isLogin && <span style={{ color: theme.palette.red[300] }}>*</span>}</FormLabel>
              <TextField 
                id="email"
                required
                fullWidth
                type="email"
                placeholder="example@mail.com"
                value={submitData.email} 
                onChange={(e) => setSubmitData(prev => ({ ...prev, email: e.target.value }))}
              />
            </FormControl>
          )}

          <FormControl>
            <FormLabel htmlFor="password">Пароль {!isLogin && <span style={{ color: theme.palette.red[300] }}>*</span>}</FormLabel>
            <TextField 
                id="password"
                type="password"
                required
                fullWidth
                placeholder="••••••"
                value={submitData.password} 
                onChange={(e) => setSubmitData(prev => ({ ...prev, password: e.target.value }))}
              />
          </FormControl>

          {!isLogin && (
            <FormControl>
            <FormLabel htmlFor="display_name">Отображаемое имя в профиле</FormLabel>
            <TextField 
                id="display_name"
                required
                fullWidth
                placeholder={`Отображаемое имя в профиле` } 
                value={submitData.display_name} 
                onChange={(e) => setSubmitData(prev => ({ ...prev, display_name: e.target.value }))}
              />
          </FormControl>
          )}

          <Button sx={{ position: 'relative' }} disabled={isLoading(loginLS)} onClick={submit} fullWidth color="secondary" variant="contained">
            {isLoading(loginLS) && <Box sx={{ position: 'absolute', top: 10, left: '40%' }}><CircularProgress size={15} color="white" /></Box>}
            {isLogin ? 'Войти' : 'Создать аккаунт'} 
          </Button>
          
          <Typography sx={{ textAlign: 'center' }}>
            {isLogin ? 'Нет аккаунта? ' : 'Уже зарегистрированы? '}
            <Link sx={{ cursor: 'pointer' }} onClick={() => { setIsLogin(!isLogin); reset()}}>
              {isLogin ? 'Зарегистрироваться' : 'Войти в аккаунт' }
            </Link>
          </Typography>
        </Box>
      </CustomCard>
    </Stack>
  )
}

export default Login