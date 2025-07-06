import { Box, Stack, Grid2, Skeleton, Divider, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { CustomCard } from "@components";

// Скелетон загрузки карточек детализации программы или упражнения
export function CardSkeleton({ quantity = 1 }) {
  return (
    <Grid2 container spacing={2.5} sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pb: 2 }}>
      {Array.from({ length: quantity }).map((_, index) => (
        <CustomCard 
          key={index}
          sx={{  
            p: 2,
            width: "100%",
            justifyContent: 'center',
            gap: 0,
            boxShadow: 0,
            "&:hover": { boxShadow: 0 }
          }}
        >
        <Grid2 container spacing={2.25}>
          <Grid2 size={12} container spacing={0.25} sx={{ flexDirection: 'column' }}>
            <Skeleton variant="text" width={200} height={25} />
            <Skeleton variant="text" width={200} height={16} sx={{ mb: 2 }} />
            <Divider flexItem/>
          </Grid2>

          <Grid2 container>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid2 key={index} container size={12} sx={{ alignItems: 'center' }} >
                <Grid2 size sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.2 }}>
                  <Skeleton variant="text" width={300} height={20} />
                  <Skeleton variant="text" width={200} height={16} />
                </Grid2>
                <Grid2 size="auto"><Skeleton variant="text" width={50} height={25} /></Grid2>
              </Grid2>
            ))}
          </Grid2>
        </Grid2>
      </CustomCard>
    ))}
    </Grid2>
  )
}


// Скелетон загрузки списка
export function ListSkeleton({ quantity = 1 }) {
  return (
    <Grid2 container sx={{ flexDirection: 'column', justifyContent: 'center' }}>
      {Array.from({ length: quantity }).map((_, index) => (
        <Grid2 key={index} container direction='column' spacing={1.5} pb={1.5}>
          <Skeleton variant="text" width={150} height={25} />
          <Divider flexItem />

          <Grid2 container spacing={2.5}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid2 key={index} container size={12} sx={{ alignItems: 'center' }}>
                <Grid2 size sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.2 }}>
                  <Skeleton variant="text" width={150} height={20} />
                  <Skeleton variant="text" width={100} height={16} />
                </Grid2>
              </Grid2>
            ))}
          </Grid2>
        </Grid2>
      ))}
    </Grid2>
  );
}


// Скелетон лоадера пай чарта
export function PieChartSkeleton({ quantity = 3 }) {
  return (
    <Grid2 container sx={{ flexDirection: 'column' }} spacing={5}>
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}><Skeleton variant="circular" width={200} height={200}/></Box>
      <Stack gap={3.5}>
      {Array.from({ length: quantity }).map((_, index) => (
        <Skeleton key={index} variant="text" sx={{ fontSize: 10 }}/>
      ))}
      </Stack>
  </Grid2>
  );
}

// Скелетон таблицы
export function TableSkeleton({ rows = 5, columns = 3, sx }) {
  return (
    <TableContainer 
      sx={{ 
        borderRadius: 1, 
        border: 1, 
        borderColor: 'divider',
        ...sx 
      }}
    >
      <Table>
        <TableHead sx={{ bgcolor: 'grey.100' }}>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton variant="text" width={150} height={24} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow 
              key={rowIndex}
              sx={{ 
                '&:not(:last-child) td': { borderBottom: 1, borderColor: 'divider' },
                '& td': { borderBottom: 'none' }
              }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  {colIndex === 0 ? (
                    <Grid2 container spacing={0.5} sx={{ flexDirection: 'column' }}>
                      <Skeleton variant="text" width={180} height={20} />
                      <Skeleton variant="text" width={120} height={16} />
                    </Grid2>
                  ) : colIndex === 1 ? (
                    <Skeleton variant="text" width={180} height={20} />
                  ) : (
                    <Skeleton variant="text" width={200} height={20} />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}