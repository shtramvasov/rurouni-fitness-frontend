import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { CustomCard, UIAlert } from "@components/index"
import { Button, CircularProgress, Grid2, TextField, IconButton, Typography, useTheme, Switch, Divider } from "@mui/material"
import { EmailOutlined, Telegram } from "@mui/icons-material"
import { isLoading } from "@constants/redux.constants"
import { isFulfilled } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import { updateUserSettings } from "@store/slices/Users/users.thunks"
import { clearUpdateUserSettingsLS } from "@store/slices/Users/users.slice"



function NotificationCard() {
  const dispatch = useDispatch()
  const theme = useTheme()

  const { user } = useSelector(state => state.auth)
  const { updateUserSettingsLS } = useSelector(state => state.users)

  const [emailSettings, setEmailSettings] = useState({
    news_updates:           user.settings.email_news_updates        ?? false,
    personal_statistics:    user.settings.email_personal_statistics ?? false
  })

  const [telegramSettings, setTelegramSettings] = useState({
    workout_reminders:      user.settings.telegram_security_alerts    ?? false,
    security_alerts:        user.settings.telegram_workout_reminders  ?? false
  })

  const submitEmail = async () => {
    if(!isLoading(updateUserSettings)) {
      const response = await dispatch(updateUserSettings({
        params: {
          news_updates:         emailSettings.news_updates,
          personal_statistics:  emailSettings.personal_statistics
        }
      }));

      if(isFulfilled(response)) {
        toast.success('Изменения сохранены')
        dispatch(clearupdateUserLS())
      }
    }
  }

  const submitTelegram = async () => {
    if(!isLoading(updateUserSettings)) {
      const response = await dispatch(updateUserSettings({
        params: {
          workout_reminders:    telegramSettings.workout_reminders,
          security_alerts:      telegramSettings.security_alerts
        }
      }));

      if(isFulfilled(response)) {
        toast.success('Изменения сохранены')
        dispatch(clearupdateUserLS())
      }
    }
  }

  return (
    <Grid2 sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography sx={{ color: theme.palette.brand[800] }} variant="h3" >Оповещения</Typography>

      {/* Почта */}
      <CustomCard sx={{ p: 3, gap: 3 }}>
        <Grid2 container sx={{ flexDirection: 'column' }} spacing={3}>
          <Grid2 sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <IconButton sx={{ '&:hover': { bgcolor: 'transparent' } }} ><EmailOutlined /></IconButton>
            <Typography variant="h6" sx={{ color: theme.palette.brand[800] }}>Почта</Typography>
          </Grid2>

          <Grid2 container sx={{ justifyContent: 'space-between', flexDirection: 'row', gap: 3 }} size={12}>
            <Grid2 sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }} >
              <Typography sx={{ color: theme.palette.brand[800], fontSize: 16, fontWeight: 600 }}>Обновления приложения</Typography>  
              <Typography sx={{ color: theme.palette.gray[500], fontSize: 14 }}>На вашу почту будут приходить письма со списком изменений и обновлений приложения.</Typography>  
            </Grid2>
             <Switch disabled={isLoading(updateUserSettingsLS)} checked={emailSettings.news_updates} onChange={(e) => setEmailSettings(prev => ({ ...prev, news_updates: e.target.checked }))} />
          </Grid2>
          <Divider />

          <Grid2 container sx={{ justifyContent: 'space-between', flexDirection: 'row', gap: 3 }} size={12}>
            <Grid2 sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }} >
              <Typography sx={{ color: theme.palette.brand[800], fontSize: 16, fontWeight: 600 }}>Персональная аналитика</Typography>  
              <Typography sx={{ color: theme.palette.gray[500], fontSize: 14 }}>Получайте ежемесячные отчеты о ваших результатах с полезными советами для прогресса.</Typography>  
            </Grid2>
             <Switch disabled={isLoading(updateUserSettingsLS)} checked={emailSettings.personal_statistics} onChange={(e) => setEmailSettings(prev => ({ ...prev, personal_statistics: e.target.checked }))} />
          </Grid2>

          <Grid2 sx={{ pt: 3 }}>
            <Button 
              startIcon={isLoading(updateUserSettingsLS) && <CircularProgress color='inherit' size={16} />} 
              disabled={isLoading(updateUserSettingsLS)} 
              onClick={submitEmail} 
              color="secondary"
              variant="contained"
            >
              Сохранить изменения
            </Button>
          </Grid2>
        </Grid2>
      </CustomCard>

      {/* Телеграм */}
      <CustomCard sx={{ p: 3, gap: 3 }}>
        <Grid2 container sx={{ flexDirection: 'column' }} spacing={3}>
          <Grid2 sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <IconButton sx={{ '&:hover': { bgcolor: 'transparent' } }} ><Telegram /></IconButton>
            <Typography variant="h6" sx={{ color: theme.palette.brand[800] }}>Телеграм</Typography>
          </Grid2>

          <Grid2 container sx={{ justifyContent: 'space-between', flexDirection: 'row', gap: 3 }} size={12}>
            <Grid2 sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }} >
              <Typography sx={{ color: theme.palette.brand[800], fontSize: 16, fontWeight: 600 }}>Напоминания о тренировках</Typography>  
              <Typography sx={{ color: theme.palette.gray[500], fontSize: 14 }}>Уведомления о запланированных тренировках и рекомендации по расписанию.</Typography>  
            </Grid2>
             <Switch disabled={isLoading(updateUserSettingsLS)} checked={telegramSettings.workout_reminders} onChange={(e) => setTelegramSettings(prev => ({ ...prev, workout_reminders: e.target.checked }))} />
          </Grid2>
          <Divider />

          <Grid2 container sx={{ justifyContent: 'space-between', flexDirection: 'row', gap: 3 }} size={12}>
            <Grid2 sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }} >
              <Typography sx={{ color: theme.palette.brand[800], fontSize: 16, fontWeight: 600 }}>Оповещения о безопасности</Typography>  
              <Typography sx={{ color: theme.palette.gray[500], fontSize: 14 }}>Уведомления об изменениях безопасности и подозрительной активности.</Typography>  
            </Grid2>
             <Switch disabled={isLoading(updateUserSettingsLS)} checked={telegramSettings.security_alerts} onChange={(e) => setTelegramSettings(prev => ({ ...prev, security_alerts: e.target.checked }))} />
          </Grid2>

          <Grid2 sx={{ pt: 3 }}>
            <Button 
              startIcon={isLoading(updateUserSettingsLS) && <CircularProgress color='inherit' size={16} />} 
              disabled={isLoading(updateUserSettingsLS)} 
              onClick={submitTelegram}  
              color="secondary"
              variant="contained"
            >
              Сохранить изменения
            </Button>
          </Grid2>
        </Grid2>
      </CustomCard>

    </Grid2>
  )
}

export default NotificationCard