import { useState } from "react";
import { Box, Grid2, Typography, Stack, LinearProgress, linearProgressClasses, useTheme, IconButton, Tooltip, Link } from "@mui/material"
import { MoreVert } from "@mui/icons-material";
import { PieChart } from "@mui/x-charts";
import useTransformPieData from "@hooks/useTransformPieData";
import { CustomCard, UIAlert, PieChartSkeleton } from "@components";
import { isLoading, isSuccess, isFailed } from "@constants/redux.constants";
import ChartMenu from "./menu.component";

function PieChartCard({ data, colors = [], title, resetFilter, titleKey = 'title', valueKey = 'count', loadingState }) {
  const theme = useTheme();

  const [openMenu, setOpenMenu] = useState({ anchor: null, isOpen: false })

  if(!data) return;

  const chartData = useTransformPieData({
    data:   data || [],
    colors: colors,
    titleKey,
    valueKey
  })

  return (
    <Grid2 container sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pb: 2 }}>
    <CustomCard 
      sx={{  
        p: { xs: 1, md: 3 }, 
        width: "100%",
        minHeight: '100%',
        justifyContent: 'center',
        gap: 0,
        textAlign: 'center', 
        boxShadow: theme.shadows[1],
        "&:hover": { boxShadow: theme.shadows[2] }
      }}
    >
      {title && (
        <Grid2 sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Grid2 size='grow'>
            <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.gray[900] }}>{title}</Typography>
          </Grid2>
          <Grid2>
            <Tooltip title='Выбрать период'>
              <IconButton onClick={(e) => setOpenMenu({ anchor: e.currentTarget, isOpen: !openMenu.isOpen })}  size='small'><MoreVert /></IconButton>
            </Tooltip>
            <ChartMenu resetFilter={resetFilter} anchor={openMenu.anchor} isOpen={openMenu.isOpen} onClose={(e) => setOpenMenu({ anchor: null, isOpen: false })} />
          </Grid2>
        </Grid2>
      )}

      {isFailed(loadingState) && (<UIAlert />)}

      {isLoading(loadingState) && ( <PieChartSkeleton />)}

      {(isSuccess(loadingState) && chartData.resultData.length == 0) && (
        <Grid2>
          <UIAlert severity='warning' 
            title='Не найдено данных за текущий период' 
            description={
              <Link component="button"
                disabled={isLoading(loadingState)}
                onClick={resetFilter}
                sx={{ color: theme.palette.brand[400] }}
              >
                Сбросьте фильтр по периоду
              </Link>
            }
          />
        </Grid2>
      )}

      {(isSuccess(loadingState) && chartData.resultData.length > 0) && (
        <>
          <Grid2 sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <PieChart
              colors={[theme.palette.gray[300], theme.palette.gray[400], theme.palette.gray[500]]}
              margin={{
                left: 50,
                right: 80,
                top: 80,
                bottom: 80,
              }}
              series={[
                {
                  data: chartData.resultData,
                  innerRadius: 70,
                  outerRadius: 100,
                  paddingAngle: 0,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                }
              ]}
              height={260}
              width={260}
              slotProps={{ legend: { hidden: true } }}
            />          
          </Grid2>
          
          {
            chartData.resultData.map((item, index) => 
              <Stack key={index} direction='row' sx={{ alignItems: 'center', pb: 2 }}>
                <Stack sx={{ gap: 0.75, flexGrow: 1 }}>
                  <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.label}</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.gray[600] }}>{item.value}</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate"
                    value={Number(item.percentage)}
                    sx={{[`& .${linearProgressClasses.bar}`]: { backgroundColor: item.color }}}
                  />
                </Stack>
              </Stack>
            )
          }
        </>     
    )}
      </CustomCard>         
    </Grid2>
  )

}

export default PieChartCard