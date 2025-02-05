import { Grid2, Typography, Stack, LinearProgress, linearProgressClasses, useTheme } from "@mui/material"
import { PieChart } from "@mui/x-charts";
import useTransformPieData from "@hooks/useTransformPieData";
import { CustomCard } from "@components";


function PieChartCard({ data, colors = [], title, showLegend = true, titleKey = 'title' }) {
  const theme = useTheme();

  if(!data) return;

  const chartData = useTransformPieData({
    data:   data || [],
    colors: colors,
    titleKey,
  })

  return (
    <Grid2 size={{ lg: 6, xs: 12 }} container sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    <CustomCard 
      sx={{  
        p: 3, 
        width: "100%",
        minHeight: '100%',
        justifyContent: 'center',
        gap: 0,
        textAlign: 'center', 
        boxShadow: theme.shadows[1],
        "&:hover": { boxShadow: theme.shadows[2] }
      }}
    >
      {title && (<Typography sx={{ fontSize: 16, fontWeight: 500, color: theme.palette.gray[900] }}>{title}</Typography>)}
      <Grid2 sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <PieChart
          colors={[theme.palette.gray[300], theme.palette.gray[400], theme.palette.gray[500]]}
          margin={{
            left: 80,
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
      {showLegend && (
        chartData.resultData.map((item, index) => 
          <Stack key={index} direction='row' sx={{ alignItems: 'center', gap: 2, pb: 2 }}>
            <Stack sx={{ gap: 1, flexGrow: 1 }}>
              <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.label}</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.gray[600] }}>{item.value}</Typography>
              </Stack>
              <LinearProgress 
                variant="determinate"
                value={item.percentage}
                sx={{[`& .${linearProgressClasses.bar}`]: { backgroundColor: item.color }}}
              />
            </Stack>
          </Stack>
        )
      )}
      </CustomCard>         
    </Grid2>
  )

}

export default PieChartCard