import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { CustomCard, UIAlert } from "@components/index"
import { Button, CircularProgress, Divider, Grid2, TextField, IconButton, Typography, useTheme, Alert, AlertTitle } from "@mui/material"
import { Password, Key } from "@mui/icons-material"
import { isLoading } from "@constants/redux.constants"
import { isFulfilled } from "@reduxjs/toolkit"
import toast from "react-hot-toast"





function SecurityCard() {
  const dispatch = useDispatch()
  const theme = useTheme()

  const { user } = useSelector(state => state.auth)

  const [submitData, setSubmitData] = useState({
    old_password:           null,
    new_password:           null,
    new_password_confirm:   null
  })

  const resetPassword = async () => {

  }

  const changePassword = async () => {
    console.log(submitData)
  }


  return (
    <Grid2 sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography sx={{ color: theme.palette.brand[800] }} variant="h3" >Безопасность</Typography>

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
                placeholder="••••••"
                size="small"
                // disabled={isLoading(updateUserLS)}
              />
            </Grid2>
            <Grid2 sx={{ display: 'flex', flexDirection: 'column' }} size={12}>
              <Typography variant="caption" fontWeight={500}>Новый пароль</Typography>
              <TextField 
                fullWidth
                type="password"
                onChange={(e) => setSubmitData(prev => ({...prev, new_password: e.target.value }))}
                value={submitData.new_password}
                placeholder="••••••"
                size="small"
                // disabled={isLoading(updateUserLS)}
              />
            </Grid2>
            <Grid2 sx={{ display: 'flex', flexDirection: 'column' }} size={12}>
              <Typography variant="caption" fontWeight={500}>Повторите новый пароль</Typography>
              <TextField 
                fullWidth
                type="password"
                onChange={(e) => setSubmitData(prev => ({...prev, new_password_confirm: e.target.value }))}
                value={submitData.new_password_confirm}
                placeholder="••••••"
                size="small"
                // disabled={isLoading(updateUserLS)}
              />
            </Grid2>
          </Grid2>

          <Grid2 sx={{ pt: 3 }}>
            <Button 
              // startIcon={isLoading(updateUser) && <CircularProgress color='inherit' size={16} />} 
              // disabled={isLoading(updateUserLS)} 
              onClick={changePassword} 
              color="secondary"
              variant="contained"
            >
              Сохранить изменения
            </Button>
          </Grid2>    
        </Grid2>
      </CustomCard>

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
              // startIcon={isLoading(updateUser) && <CircularProgress color='inherit' size={16} />} 
              // disabled={isLoading(updateUserLS)} 
              onClick={resetPassword} 
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