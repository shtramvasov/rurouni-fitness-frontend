import { useRef, useState, useEffect } from "react"
import { CustomCard } from "@components/index"
import { useDispatch, useSelector } from "react-redux"
import { capitalizeFirstLetter } from "@helpers/capitalizeFirstLetter"
import { Avatar, Box, Button, CircularProgress, Divider, Grid2, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography, useTheme, Modal, IconButton, Stack, styled } from "@mui/material"
import { Female, Male, Add, Close, Telegram } from "@mui/icons-material"
import { updateUser, verifyTelegram } from "@store/slices/Users/users.thunks"
import { clearupdateUserLS, clearVerifyTelegramLS } from "@store/slices/Users/users.slice"
import { isLoading } from "@constants/redux.constants"
import { isFulfilled, isRejected } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import dayjs from "dayjs"
import { uploadFile } from "@store/slices/Files/files.thinks"
import { clearuploadFileLS } from "@store/slices/Files/files.slice"



function ProfileCard() {
  const dispatch = useDispatch()
  const theme = useTheme()
  const fileInputRef = useRef(null)

  const { user } = useSelector(state => state.auth)
  const { updateUserLS, verifyTelegramLS } = useSelector(state => state.users)
  const { uploadFileLS } = useSelector(state => state.files)

  const [submitData, setSubmitData] = useState({
    display_name:   user.display_name   ?? null,
    gender:         user.gender         ?? null,
    file:           null
  })

  const username = user.display_name ?? user.username;

  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    return () => {
      dispatch(clearupdateUserLS())
      dispatch(clearuploadFileLS())
    }
  }, [])

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

  const clearImage = () => {
    setSubmitData(prev => ({ ...prev, file: null }));
    fileInputRef.current.value = '';
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
          dispatch(clearuploadFileLS())
          avatar_url = uploadResponse.payload.url
        }

        if(isRejected(uploadResponse)) {
          toast.error('Аватар превышает лимит в 5мб')
          return;
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
      clearImage()
    }
  }

  const submitVerifyTelegram = async () => {
    if(isLoading(verifyTelegramLS)) return;

    const response = await dispatch(verifyTelegram({}))

    if(isFulfilled(response)) {
      toast.success('На вашу почту отправлено письмо с кодом подтверждения')
      window.open(import.meta.env.VITE_TG_BOT_URL, '_blank');
    }

    if(isRejected(response) || response.error) {
       toast.error('Призошла ошибка')
    }

    if(openModal) setOpenModal(false)

    dispatch(clearVerifyTelegramLS())
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
              <Box sx={{ position: 'relative', '&:hover .avatar-overlay': { opacity: 1 }}}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }}/>
                <Avatar 
                  src={avatarSrc} 
                  sx={{ bgcolor: theme.palette.primary.main, width: 100, height: 100, fontSize: 48, transition: 'opacity 0.3s ease', '&:hover': { opacity: 0.7 }}}
                >
                  {capitalizeFirstLetter(username.charAt(0))}
                </Avatar>
    
                <Tooltip placement="right" title='Загрузить аватар'>
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
                </Tooltip>

                {/* Крестик для отмены выбранной аватарки */}
                {submitData.file && (
                  <Tooltip placement="right" title='Очистить картинку'>                   
                    <Box 
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.red[400],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        transition: '0.3s ease',
                        '&:hover': { backgroundColor: theme.palette.red[600] }
                      }} 
                      onClick={(e) => {
                        e.stopPropagation();
                        clearImage()
                      }}
                    >
                      <Close sx={{ color: 'white', fontSize: 16 }} />
                    </Box>
                  </Tooltip>
                )}
              </Box>
            <Typography sx={{ color: theme.palette.gray[600] }}>Зарегистрирован{user.gender == 'F' && 'а'} {dayjs(user.created_on_tz).format('D MMMM YYYY')}</Typography>
          </Grid2>    
        </Grid2>

        <Divider />

        <Grid2 container sx={{ flexDirection: 'column', gap: 3 }}>
          {user.telegram_id && (          
            <Grid2 sx={{ display: 'flex', flexDirection: 'column' }} size={12}>
              <Typography variant="caption" fontWeight={500}>Телеграм аккаунт</Typography>
              <TextField 
                fullWidth
                value={`@${user.telegram}`}
                size="small"
                disabled
              />
            </Grid2>
          )}

          <Grid2 sx={{ display: 'flex', flexDirection: 'column' }} size={12}>
            <Typography variant="caption" fontWeight={500}>Отображаемое имя в профиле</Typography>
            <TextField 
              fullWidth
              onChange={(e) => setSubmitData(prev => ({...prev, display_name: e.target.value }))}
              value={submitData.display_name}
              placeholder="Отображаемое имя в профиле"
              size="small"
              disabled={isLoading(updateUserLS) || isLoading(uploadFileLS) || isLoading(verifyTelegramLS)}
            />
          </Grid2>

          <Grid2 sx={{ display: 'flex', flexDirection: 'column' }} size={12}>
            <Typography variant="caption" fontWeight={500}>Ваш пол</Typography>
            <ToggleButtonGroup
              value={submitData.gender}
              exclusive
              disabled={isLoading(updateUserLS) || isLoading(uploadFileLS) || isLoading(verifyTelegramLS)}
              onChange={(e, newValue) => setSubmitData(prev => ({...prev, gender: newValue }))}
            >
              <ToggleButton value='M'><Male sx={{ fontSize: 20 }} /></ToggleButton>
              <ToggleButton value='F'><Female sx={{ fontSize: 20 }} /></ToggleButton>
            </ToggleButtonGroup>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={2} sx={{ pt: 3 }}>
          {!user.telegram_id && (
            <Grid2>
              <Button
                  startIcon={isLoading(verifyTelegramLS) ? <CircularProgress color='inherit' size={16} /> : <Telegram />} 
                  disabled={isLoading(updateUserLS) || isLoading(uploadFileLS) || isLoading(verifyTelegramLS)}
                  onClick={() => setOpenModal(true)} 
                  color="primary"
                  variant="contained"
                >
                  Привязать телеграм
              </Button>
            </Grid2>
          )}
          <Button 
            startIcon={isLoading(updateUser) && <CircularProgress color='inherit' size={16} />} 
            disabled={isLoading(updateUserLS) || isLoading(uploadFileLS) || isLoading(verifyTelegramLS)}
            onClick={submit} 
            color="secondary"
            variant="contained"
          >
            Сохранить изменения
          </Button>         
        </Grid2>
      </CustomCard>

      {openModal && (
        <Modal 
          open={openModal} 
          onClose={() => setOpenModal(false)}
          sx={{'& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.25)'}}}
        >
          <CustomCard 
            sx={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              p: 3, 
              gap: 3,
              width: { xs: '90%', md: '70%', lg: '50%' }
            }}          
          >
            <Grid2 container>
              <Grid2 pb={4} sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5">Подтверждение Telegram</Typography>
                <Tooltip placement="top" title='Закрыть'>
                  <IconButton onClick={() => setOpenModal(false)}><Close /></IconButton>
                </Tooltip>
              </Grid2>

              <Grid2 sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: 3, pb: 4 }}>
              <Stack spacing={1.5}>
                <Typography variant="body1">Для привязки Telegram аккаунта:</Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Step>1</Step>
                  <Typography>
                    На почту <span style={{ color: theme.palette.brand[500], fontWeight: 500 }}>{user.email}</span>{' '} 
                    будет отправлен код
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Step>2</Step>
                  <Typography>Откройте нашего Telegram бота</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Step>3</Step>
                  <Typography>Отправьте команду:</Typography>
                </Box>

                <Grid2 
                  sx={{ 
                    fontWeight: 600,
                    margin: '0 auto',
                    my: 1,
                    p: 2, 
                    textAlign: 'center', 
                    border: 1,
                    borderColor: theme.palette.gray[200],
                    borderRadius: 1,
                    bgcolor: theme.palette.gray[50],
                    width: 'fit-content',
                    fontFamily: 'monospace'
                  }}
                >
                  /verify CODE
                </Grid2>
              </Stack>

            </Grid2>

            <Button 
              variant="contained" 
              color="secondary"
              onClick={submitVerifyTelegram}
              disabled={isLoading(updateUserLS) || isLoading(uploadFileLS) || isLoading(verifyTelegramLS)}
            >
              Получить код и открыть бота
            </Button>               
            </Grid2>
          </CustomCard>
        </Modal>
      )}
    </Grid2>
  )
}

const Step = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.brand[500],
  width: 24,
  height: 24,
  color: 'white',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})) 

export default ProfileCard