import { useState } from "react";
import { CustomCard } from "@components";
import { Grid2, Typography, Divider, Chip, useTheme, Collapse, IconButton, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { KeyboardArrowDownRounded, KeyboardArrowUpRounded } from '@mui/icons-material';


export function TrainingProgramCard({ program, verbose, open = true }) {
  const theme = useTheme()

  const [isOpen, setIsOpen] = useState(open)

  return (
    <CustomCard 
      key={program.program_id}
      sx={{  
        p: 2,
        width: "100%",
        justifyContent: 'center',
        gap: 0,
        boxShadow: 0,
        "&:hover": { boxShadow: 0 }
      }}
    >
      <Grid2 container spacing={isOpen ? 1.25 : 0 }>
        <Grid2 size={12} container spacing={0.5} sx={{ flexDirection: 'column' }}>
          <Grid2 sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid2 container spacing={0.5} sx={{ flexDirection: 'column' }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600 }} color={theme.palette.grey[900]}>{program.name}</Typography>
              <Typography sx={{ pb: isOpen ? 1 : 0 }} variant="body2" color={theme.palette.grey[500]}>{program.description}</Typography>
            </Grid2>
            {verbose && (
              <Tooltip title={isOpen ? 'Скрыть список упражнений' : 'Показать список упражнений'}>
                <IconButton sx={{ my: 0.5 }} size="small" onClick={() => setIsOpen(prev => !prev)}>
                  {isOpen ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
                </IconButton>
              </Tooltip>
            )}
          </Grid2>
          <Divider flexItem sx={{ visibility:  isOpen ? 'visible' : 'hidden' }}/>
        </Grid2>

      <Collapse in={isOpen} sx={{ width: '100%',  }}>
        <Grid2 container sx={{ flexGrow: 1 }}>
          {program.exercises.map((exercise, index) => (
            <Grid2 
              key={exercise.exercise_id} 
              container 
              size={12} 
              sx={{ 
                alignItems: 'center', 
                p: 2,
                px: { xs: 0, sm: 2 },
                borderRadius: 1,
                transition: '450ms ease',
                '&:hover': { bgcolor: theme.palette.gray[50] } 
              }}
            >
              <Grid2 size="auto" sx={{ pr: { xs: 1, sm: 2 } }}>
                <Typography variant="caption" color={theme.palette.gray[500]}>{++index}</Typography>
              </Grid2>

              <Grid2 size sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Grid2 sx={{ display: 'flex' }} >
                  <Grid2 container gap={0.75} position='relative'>
                    <Typography sx={{ fontWeight: 500, color: theme.palette.gray[900] }}>{exercise.name}</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 300, color: theme.palette.gray[500], position: 'absolute', right: -28 }}>
                      {exercise.reps}х{exercise.sets}
                    </Typography>
                  </Grid2>
                </Grid2>
                <Grid2 sx={{ display: 'flex' }} gap={0.4}>
                  <Typography sx={{ fontWeight: 300, fontSize: 12, color: theme.palette.gray[500] }}>
                    {exercise.recent_weight}{exercise.unit}
                  </Typography>
                  <Typography sx={{ fontWeight: 300, fontSize: 12, color: theme.palette.gray[500] }}>
                    {exercise.recent_reps}х{exercise.recent_sets}
                  </Typography>
                  <Typography sx={{ fontWeight: 300, fontSize: 12, color: theme.palette.gray[500] }}>
                    {exercise.recent_created_on_tz 
                      ?  `от ${dayjs(exercise.recent_created_on_tz).format('D MMM YYYY')}`
                      : null
                    }                           
                  </Typography>
                </Grid2>
              </Grid2>

              <Grid2 size="auto">
                <Chip label={exercise.muscle_group}/>
              </Grid2>
            </Grid2>
          ))}
        </Grid2>
      </Collapse>
      </Grid2>
    </CustomCard>
  )
}

export default TrainingProgramCard
