import { Box, Grid2, Typography, Skeleton, Divider, useTheme } from "@mui/material"
import { LineChart } from "@mui/x-charts";
import { CustomCard, UIAlert } from "@components";
import useTransformLineData from "@hooks/useTransformLineData";
import dayjs from "dayjs";
import { isLoading, isSuccess, isFailed } from "@constants/redux.constants";


function LineChartCard({ data, colors = [], title, xAxisKey = 'title', yAxisKey = 'value', loadingState, valueIsNumber }) {
  const theme = useTheme();

  if(!data) return;

  const chartData = useTransformLineData({
    data:   data || [],
    colors: colors,
    xAxisKey,
    yAxisKey,
    valueIsNumber
  })

  return (
    <Grid2 size={{ xs: 12 }} container sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <CustomCard 
        sx={{  
          p: 3, 
          width: "100%",
          minHeight: '100%',
          justifyContent: 'center',
          gap: 0,
          boxShadow: theme.shadows[1],
          "&:hover": { boxShadow: theme.shadows[2] }
        }}
      >
        {title && (
          <Grid2 container spacing={1}>
            <Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.gray[900] }}>{title}</Typography>
            <Divider flexItem orientation="vertical"/>
            <Typography sx={{ fontSize: 14, fontWeight: 300, color: theme.palette.gray[600] }}>динамика изменения веса</Typography>
          </Grid2>         
        )}

        {isFailed(loadingState) && (<Box sx={{ py: 2 }}><UIAlert /></Box>)}

        {isLoading(loadingState) && (
          <Box sx={{ mt: -14, mb: -12 }}>
            <Skeleton width={'100%'} height={560}/>
          </Box>
        )}

        {(isSuccess(loadingState) && chartData.length == 0) && (
          <Box sx={{ py: 2 }}>
            <UIAlert severity='warning' title='По этому упражнению нет записей' />
          </Box>
        )}

        {(isSuccess(loadingState) && chartData.length > 0) && (
          <Grid2 sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <LineChart
              colors={colors}
              margin={{ left: 30, right: 20, top: 20, bottom: 20 }}           
              xAxis={[
                {
                  scaleType: 'point',
                  data: chartData.map(item => dayjs(item.label).format('D MMM')) ?? [],
                  // tickInterval: (index, i) => (i + 1) % 5 === 0,
                  sx: {
                    '.MuiChartsAxis-tickLabel': { fill: theme.palette.gray[500] },
                    '.MuiChartsAxis-line': { stroke: theme.palette.gray[200] },
                    '.MuiChartsAxis-tick': { stroke: theme.palette.gray[200] }
                  }
                },
              ]}
              yAxis={[
                {
                  min: Math.min(...chartData.map(item => item.value)) - 5,
                  max: Math.max(...chartData.map(item => item.value)) + 5,
                  sx: {
                    '.MuiChartsAxis-tickLabel': { fill: theme.palette.gray[500] },
                    '.MuiChartsAxis-line': { stroke: theme.palette.gray[200] },
                    '.MuiChartsAxis-tick': { stroke: theme.palette.gray[200] }
                  }
                },
              ]}
              series={[
                {
                  data:   chartData.map(item => item.value) ?? [],
                  label:  title,
                  showMark: false,
                  curve: 'natural',
                }
              ]}
              grid={{ horizontal: true, vertical: true }}
              height={360}
              slotProps={{ legend: { hidden: true }}}
              sx={{ 
                '.MuiChartsGrid-line': { stroke: theme.palette.gray[200], strokeDasharray: '4 2' },            
              }}
            />
          </Grid2>
        )}
      </CustomCard>
    </Grid2>
  )
}

export default LineChartCard