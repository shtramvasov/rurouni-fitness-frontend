import { useRef, useState } from "react"
import { CustomCard } from "@components/index"
import { useDispatch, useSelector } from "react-redux"
import { capitalizeFirstLetter } from "@helpers/capitalizeFirstLetter"
import { Avatar, Box, Button, CircularProgress, Divider, Grid2, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography, useTheme } from "@mui/material"
import { Female, Male, Add } from "@mui/icons-material"
import { updateUser } from "@store/slices/Users/users.thunks"
import { clearupdateUserLS } from "@store/slices/Users/users.slice"
import { isLoading } from "@constants/redux.constants"
import { isFulfilled } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import dayjs from "dayjs"
import { uploadFile } from "@store/slices/Files/files.thinks"
import { clearuploadFileLS } from "@store/slices/Files/files.slice"



function ProfileCard() {
  const dispatch = useDispatch()
  const theme = useTheme()
  const fileInputRef = useRef(null)

  const { user } = useSelector(state => state.auth)
  const { updateUserLS } = useSelector(state => state.users)
  const { uploadFileLS } = useSelector(state => state.files)

  const [submitData, setSubmitData] = useState({
    display_name:   user.display_name   ?? null,
    gender:         user.gender         ?? null,
    file:           null
  })

  const handleAvatarClick = () => {
    if(!isLoading(uploadFileLS) || !isLoading(updateUserLS)) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSubmitData(prev => ({ ...prev, file: e.target.files[0]}))
    }
  }

  const submit = async () => {
    if(!isLoading(updateUserLS)) {
      const display_name = submitData.display_name ? submitData.display_name.trim() : null
      let avatar_url 

      // Загружаем аватарку на FS
      if(submitData.file) {
        const uploadResponse = await dispatch(uploadFile({
          type: 'avatar',
          file: submitData.file
        }));

        if(isFulfilled(uploadResponse)) {
          avatar_url = uploadResponse.payload.url
        }

        if(uploadResponse.error) {
          toast.error(response.error)
          return;
        }

      }

      const response = await dispatch(updateUser({
        params: {
          display_name:   display_name,
          gender:         submitData.gender,
          avatar_url:     avatar_url
        }
      }))

      if(isFulfilled(response)) {
        toast.success('Изменения сохранены')
        dispatch(clearupdateUserLS())
      }

      if(response.error) toast.error(response.error)
    }
  }

  // Показываем превью новой аватарки если она выбрана
  const avatarSrc = submitData.file ? URL.createObjectURL(submitData.file) : user.avatar_url

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

            <Tooltip placement="right" title='Загрузить аватар'>
              <Box sx={{ position: 'relative', '&:hover .avatar-overlay': { opacity: 1 }}}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }}/>
                <Avatar 
                  src={avatarSrc} 
                  sx={{ bgcolor: theme.palette.primary.main, width: 100, height: 100, fontSize: 48, transition: 'opacity 0.3s ease', '&:hover': { opacity: 0.7 }}}
                >
                  {capitalizeFirstLetter(user.username.charAt(0))}
                </Avatar>
    
                <Box 
                  className="avatar-overlay" 
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    cursor: 'pointer'
                  }} 
                  onClick={handleAvatarClick}
                >
                  <Add sx={{ color: 'white', fontSize: 32, strokeWidth: 2, stroke: 'currentColor'}} />
                </Box>
              </Box>
            </Tooltip>
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
              disabled={isLoading(updateUserLS) || isLoading(uploadFileLS)}
            />
          </Grid2>

          <Grid2 sx={{ display: 'flex', flexDirection: 'column' }} size={12}>
            <Typography variant="caption" fontWeight={500}>Ваш пол</Typography>
            <ToggleButtonGroup
              value={submitData.gender}
              exclusive
              disabled={isLoading(updateUserLS) || isLoading(uploadFileLS)}
              onChange={(e, newValue) => setSubmitData(prev => ({...prev, gender: newValue }))}
            >
              <ToggleButton value='M'><Male sx={{ fontSize: 20 }} /></ToggleButton>
              <ToggleButton value='F'><Female sx={{ fontSize: 20 }} /></ToggleButton>
            </ToggleButtonGroup>
          </Grid2>
        </Grid2>

        <Grid2 sx={{ pt: 3 }}>
          <Button 
            startIcon={isLoading(updateUser) && <CircularProgress color='inherit' size={16} />} 
            disabled={isLoading(updateUserLS) || isLoading(uploadFileLS)}
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