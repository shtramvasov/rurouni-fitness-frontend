import { useState } from "react"
import { CustomCard } from "@components/index"
import { useDispatch, useSelector } from "react-redux"
import { useTheme } from "@emotion/react"
import { capitalizeFirstLetter } from "@helpers/capitalizeFirstLetter"
import { Avatar, Button, CircularProgress, Divider, Grid2, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import dayjs from "dayjs"
import { Female, Male } from "@mui/icons-material"
import { updateUser } from "@store/slices/Users/users.thunks"
import { clearupdateUserLS } from "@store/slices/Users/users.slice"
import { isLoading } from "@constants/redux.constants"
import { isFulfilled } from "@reduxjs/toolkit"
import toast from "react-hot-toast"


function ProfileCard() {
  const dispatch = useDispatch()
  const theme = useTheme()

  const { user } = useSelector(state => state.auth)
  const { updateUserLS } = useSelector(state => state.users)

  const [submitData, setSubmitData] = useState({
    display_name:   user.display_name   ?? null,
    gender:         user.gender         ?? null
  })

  const submit = async () => {
    if(!isLoading(updateUserLS)) {
      const display_name = submitData.display_name ? submitData.display_name.trim() : null

      const response = await dispatch(updateUser({
        params: {
          display_name:   display_name,
          gender:         submitData.gender
        }
      }))

      if(isFulfilled(response)) {
        toast.success('Изменения сохранены')
        dispatch(clearupdateUserLS())
      }

      if(isRejected(response)) toast.error('Произошла ошибка')
    }
  }

  return (
    <Grid2 sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography sx={{ color: theme.palette.brand[800] }} variant="h3" >Описание профиля</Typography>
  
      <CustomCard sx={{ p: 3, gap: 3 }}>
        <Grid2 container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid2 sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
            <Grid2 sx={{ display: 'flex', gap: 1 }}>
              <Typography sx={{ color: theme.palette.gray[600] }}>{user.email}</Typography>
              <Divider flexItem orientation="vertical" />
              <Typography sx={{ color: theme.palette.gray[600] }}>{user.username}</Typography>
            </Grid2>

            <Avatar src={user.avatar_url} sx={{ bgcolor: theme.palette.primary.main, width: 100, height: 100, fontSize: 48 }}>
              {capitalizeFirstLetter(user.username.charAt(0))}
            </Avatar>
            <Typography sx={{ color: theme.palette.gray[600] }}>Зарегистрирован {dayjs(user.created_on_tz).format('D MMMM YYYY')}</Typography>
          </Grid2>    
        </Grid2>

        <Divider />

        <Grid2 container sx={{ flexDirection: 'column', gap: 3 }}>
          <Grid2 sx={{ display: 'flex', flexDirection: 'column' }} size={12}>
            <Typography variant="caption" fontWeight={500}>Отображаемое имя в профиле</Typography>
            <TextField 
              fullWidth
              onChange={(e) => setSubmitData(prev => ({...prev, display_name: e.target.value }))}
              value={submitData.display_name}
              placeholder="Отображаемое имя в профиле"
              size="small"
              disabled={isLoading(updateUserLS)}
            />
          </Grid2>

          <Grid2 sx={{ display: 'flex', flexDirection: 'column' }} size={12}>
            <Typography variant="caption" fontWeight={500}>Ваш пол</Typography>
            <ToggleButtonGroup
              value={submitData.gender}
              exclusive
              disabled={isLoading(updateUserLS)}
              onChange={(e, newValue) => setSubmitData(prev => ({...prev, gender: newValue }))}
            >
              <ToggleButton value='M'><Male sx={{ fontSize: 20 }} /></ToggleButton>
              <ToggleButton value='F'><Female sx={{ fontSize: 20 }} /></ToggleButton>
            </ToggleButtonGroup>
          </Grid2>
        </Grid2>

        <Grid2 sx={{ pt: 6 }}>
          <Button 
            startIcon={isLoading(updateUser) && <CircularProgress color='inherit' size={16} />} 
            disabled={isLoading(updateUserLS)} 
            onClick={submit} 
            color="secondary"
            variant="contained"
          >
            Сохранить изменения
          </Button>
        </Grid2>
      </CustomCard>
    </Grid2>
  )
}

export default ProfileCard