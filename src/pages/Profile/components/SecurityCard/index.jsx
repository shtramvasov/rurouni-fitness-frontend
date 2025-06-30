import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { CustomCard, UIAlert } from "@components/index"
import { Button, CircularProgress, Box, Grid2, TextField, IconButton, Typography, useTheme, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material"
import { Password, Key, AccessTime } from "@mui/icons-material"
import { isLoading, isSuccess, isFailed } from "@constants/redux.constants"
import { isFulfilled } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import { updateUser, resetPassword, getRecentLogins } from "@store/slices/Users/users.thunks"
import { clearupdateUserLS, clearResetPasswordLS, clearRecentLoginsList } from "@store/slices/Users/users.slice"
import dayjs from "dayjs"


function SecurityCard() {
  const dispatch = useDispatch()
  const theme = useTheme()

  const { user } = useSelector(state => state.auth)
  const { updateUserLS, resetPasswordLS, recentLoginsList } = useSelector(state => state.users)

  const [submitData, setSubmitData] = useState({
    old_password:           null,
    new_password:           null,
    new_password_confirm:   null
  })

  const [errors, setErrors] = useState({
    old_password:           null,
    new_password:           null,
    new_password_confirm:   null
  })

  useEffect(() => {
    dispatch(getRecentLogins())

    return () => {
      dispatch(clearRecentLoginsList())
    }   
  }, [])

  const sendResetPassword = async () => {
    const response = await dispatch(resetPassword())

    if(isFulfilled(response)) {
      toast.success('Запрос на изменение пароля успешно отправлен')
      dispatch(clearResetPasswordLS())
    }

    if(response.error) toast.error('Произошла ошибка')
  }

  const changePassword = async () => {
    if (!validateForm()) return;
    
    const response = await dispatch(updateUser({
      params: { 
        old_password: submitData.old_password,
        new_password: submitData.new_password 
      }
    }))

    if(isFulfilled(response)) {
      toast.success('Изменения сохранены')
      dispatch(clearupdateUserLS())
    }

    if(response.error) toast.error('Произошла ошибка')
  }

  const validateForm = () => {
    let isValid = true;
    const newErrors = {}

    // Проверка обязательных полей
    const requiredFields = {
      old_password: "Обязательно",
      new_password: "Обязательно", 
      new_password_confirm: "Обязательно"
    };

    // Проверка на пустые значения 
    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!submitData[field]?.trim()) {
        newErrors[field] = message;
        isValid = false;
      }
    });

    if (submitData.new_password_confirm !== submitData.new_password ) {
      newErrors.new_password_confirm = "Пароли не совпадают";
      newErrors.new_password = "Пароли не совпадают";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid
  }


  return (
    <Grid2 sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography sx={{ color: theme.palette.brand[800] }} variant="h3" >Безопасность</Typography>

      {/* Изменить пароль */}
      <CustomCard sx={{ p: 3, gap: 3 }}>
        <Grid2 container sx={{ flexDirection: 'column' }} spacing={3}>
          <Grid2 sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <IconButton sx={{ '&:hover': { bgcolor: 'transparent' } }} ><Key /></IconButton>
            <Typography variant="h6" sx={{ color: theme.palette.brand[800] }}>Изменить пароль</Typography>
          </Grid2>

          <Grid2 container sx={{ flexDirection: 'column', gap: 3 }}>
            <Grid2 sx={{ display: 'flex', flexDirection: 'column' }} size={12}>
              <Typography variant="caption" fontWeight={500}>Старый пароль</Typography>
              <TextField 
                fullWidth
                type="password"
                onChange={(e) => setSubmitData(prev => ({...prev, old_password: e.target.value }))}
                value={submitData.old_password}
                error={!!errors.old_password}
                helperText={errors.old_password || ''}
                placeholder="••••••"
                size="small"
                disabled={isLoading(updateUserLS)}
              />
            </Grid2>
            <Grid2 sx={{ display: 'flex', flexDirection: 'column' }} size={12}>
              <Typography variant="caption" fontWeight={500}>Новый пароль</Typography>
              <TextField 
                fullWidth
                type="password"
                onChange={(e) => setSubmitData(prev => ({...prev, new_password: e.target.value }))}
                value={submitData.new_password}
                error={!!errors.new_password}
                helperText={errors.new_password || ''}
                placeholder="••••••"
                size="small"
                disabled={isLoading(updateUserLS)}
              />
            </Grid2>
            <Grid2 sx={{ display: 'flex', flexDirection: 'column' }} size={12}>
              <Typography variant="caption" fontWeight={500}>Повторите новый пароль</Typography>
              <TextField 
                fullWidth
                type="password"
                onChange={(e) => setSubmitData(prev => ({...prev, new_password_confirm: e.target.value }))}
                value={submitData.new_password_confirm}
                error={!!errors.new_password_confirm}
                helperText={errors.new_password_confirm || ''}
                placeholder="••••••"
                size="small"
                disabled={isLoading(updateUserLS)}
              />
            </Grid2>
          </Grid2>

          <Grid2 sx={{ pt: 3 }}>
            <Button 
              startIcon={isLoading(updateUser) && <CircularProgress color='inherit' size={16} />} 
              disabled={isLoading(updateUserLS)} 
              onClick={changePassword} 
              color="secondary"
              variant="contained"
            >
              Сохранить изменения
            </Button>
          </Grid2>    
        </Grid2>
      </CustomCard>

      {/* История входов в акаунт */}
      <CustomCard sx={{ p: 3, gap: 3 }}>
        <Grid2 container sx={{ flexDirection: 'column' }} spacing={3}>
          <Grid2 sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <IconButton sx={{ '&:hover': { bgcolor: 'transparent' } }} ><AccessTime /></IconButton>
            <Typography variant="h6" sx={{ color: theme.palette.brand[800] }}>История входов в аккаунт</Typography>
          </Grid2>

          {isFailed(recentLoginsList.loadingStatus) && (<UIAlert />)}

          {isLoading(recentLoginsList.loadingStatus) && (<CircularProgress />)}

          {isSuccess(recentLoginsList.loadingStatus) && recentLoginsList.data.length == 0 && (<UIAlert severity='warning' title='Входов в аккаунт еще не было' />)}

          {isSuccess(recentLoginsList.loadingStatus) && recentLoginsList.data.length > 0 && (
            <TableContainer sx={{ borderRadius: 1, border: 1, borderColor: theme.palette.gray[200] }}>
              <Table>
                <TableHead sx={{ bgcolor: theme.palette.gray[100] }}>
                  <TableRow>
                    <TableCell sx={{ color: theme.palette.gray[600] }}>Дата входа</TableCell>
                    <TableCell sx={{ color: theme.palette.gray[600] }}>IP адрес</TableCell>
                    <TableCell sx={{ color: theme.palette.gray[600] }}>Устройство</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentLoginsList.data.map(item => 
                    <TableRow 
                      key={item.login_id} 
                      sx={{ 
                        '&:not(:last-child) td': { borderBottom: `1px solid ${theme.palette.gray[200]}`},
                        '& td': { borderBottom: 'none' }
                      }}
                    >
                      <TableCell>
                        <Grid2 container spacing={0.5} sx={{ flexDirection: 'column' }}>
                          <Typography sx={{ color: theme.palette.gray[800], fontWeight: 500 }}>Совершен вход</Typography>
                          <Typography sx={{ color: theme.palette.gray[500] }}>{dayjs(item.login_on_tz).format('HH:mm, D MMMM YYYY')}</Typography>
                        </Grid2>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          sx={{ 
                            display: 'inline', 
                            py: 0.5,
                            px: 1.25,
                            borderRadius: 0.5,
                            color: theme.palette.gray[500], 
                            bgcolor: theme.palette.gray[100] 
                          }}
                        >
                          {item.ip_address}
                        </Typography>
                      </TableCell>
                      <TableCell><Typography sx={{ color: theme.palette.gray[800] }}>{item.user_agent}</Typography></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid2>
      </CustomCard>

      {/* Сбросить пароль */}
      <CustomCard sx={{ p: 3, gap: 3 }}>
        <Grid2 container sx={{ flexDirection: 'column' }} spacing={3}>
          <Grid2 sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <IconButton sx={{ '&:hover': { bgcolor: 'transparent' } }} ><Password /></IconButton>
            <Typography variant="h6" sx={{ color: theme.palette.brand[800] }}>Сбросить пароль</Typography>
          </Grid2>

          <UIAlert 
            severity="info"
            title="О сбросе пароля"
            description={`На вашу почту ${user.email} будет отправлено письмо с новым паролем. 
              Используйте его для входа и по желанию смените в настройках`
            }
          />

          <Grid2>
            <Button 
              startIcon={isLoading(resetPasswordLS) && <CircularProgress color='inherit' size={16} />} 
              disabled={isLoading(updateUserLS) || isLoading(resetPasswordLS)} 
              onClick={sendResetPassword} 
              color="error"
              variant="contained"
            >
              Сбросить пароль
            </Button>
          </Grid2>    
        </Grid2>
      </CustomCard>
    </Grid2>
  )
}

export default SecurityCard