import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Divider, Grid2, Menu, MenuItem, Typography, useTheme, Button } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers";
import { capitalizeFirstLetter } from "@helpers/capitalizeFirstLetter";
import dayjs from "dayjs"


function ChartMenu({ anchor, isOpen, onClose, resetFilter }) {
  const theme = useTheme()

  const [searchParams, setSearchParams] = useSearchParams()
  const [submitData, setSubmitData] = useState({ 
    date_start_tz:  searchParams.get("date_start_tz") ? dayjs(searchParams.get("date_start_tz"))  : null, 
    date_end_tz:    searchParams.get("date_end_tz")   ? dayjs(searchParams.get("date_end_tz"))    : null, 
  })

  const getMonthsOptions = () => {
    const now = dayjs();
    return Array.from({ length: now.month() + 1 }, (_, i) => ({
      label: capitalizeFirstLetter(dayjs().month(i).format("MMMM")),
      value: i,
    }));
  };

  const activeMonth = searchParams.get("date_start_tz") ? dayjs(searchParams.get("date_start_tz")).month() : null; 

  const monthsOptions = getMonthsOptions()

  const handleMonthSelect = (monthValue) => {
    const startOfMonth = dayjs().month(monthValue).startOf('month').startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]')
    const endOfMonth =   dayjs().month(monthValue).endOf('month').add(1, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]')

    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set("date_start_tz", startOfMonth);
    updatedParams.set("date_end_tz", endOfMonth);

    setSearchParams(updatedParams);

    onClose(); 
  };

  const submit = () => {
  const { date_start_tz, date_end_tz } = submitData;
  const updatedParams = new URLSearchParams(searchParams);

  // Обработка даты начала
  if (date_start_tz) {
    updatedParams.set("date_start_tz", dayjs(date_start_tz).startOf('day').toISOString());
  } else {
    updatedParams.delete("date_start_tz"); // Удаляем, если параметр есть, но дата не передана
  }

  // Обработка даты окончания
  if (date_end_tz) {
    updatedParams.set("date_end_tz", dayjs(date_end_tz).endOf('day').toISOString());
  } else {
    updatedParams.delete("date_end_tz"); // Удаляем, если параметр есть, но дата не передана
  }

  // Обновляем параметры и закрываем модальное окно
  setSearchParams(updatedParams);
  onClose();
};


  return (
    <Menu anchorEl={anchor} open={isOpen} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
      <Grid2 container sx={{ flexDirection: 'column', p: 0.5 , minWidth: '12rem'}} spacing={0.5}>
        <Typography variant="caption" sx={{ p: 1, fontWeight: 500, color: theme.palette.gray[800] }}>Выбрать период по месяцам</Typography>
        <Divider flexItem/>

        {monthsOptions.map((month) => (
          <MenuItem
            key={month.value}
            onClick={() => handleMonthSelect(month.value)}
            sx={{ py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            selected={activeMonth === month.value}
          >
            {month.label}
          </MenuItem>

        ))}

        <Divider flexItem />
        <Typography variant="caption" sx={{ p: 1, pt: 2.5, fontWeight: 500, color: theme.palette.gray[800] }}>Свой собственный период</Typography>
        <Divider flexItem/>
        <Grid2 container size={12} sx={{ py: 1 }}>
          <Grid2 size={6}>
            <DatePicker
              value={submitData.date_start_tz ? submitData.date_start_tz : null}
              onChange={(newValue) => setSubmitData({ ...submitData, date_start_tz: newValue })}
              format="DD.MM.YYYY"
              sx={{
                "& .MuiIconButton-root": {
                  border: 'none',
                  height: '2.5rem',
                  width: '2.5rem',
                  color: theme.palette.grey[500],
                  "&:hover": { backgroundColor: "transparent" },
                },
                "& .MuiSvgIcon-root": { fontSize: "1.25rem" }
              }}
            />
          </Grid2>
          <Grid2 size={6}>
            <DatePicker
              value={submitData.date_end_tz ? submitData.date_end_tz : null}
              onChange={(newValue) => setSubmitData({ ...submitData, date_end_tz: newValue })}
              format="DD.MM.YYYY"
              sx={{
                "& .MuiIconButton-root": {
                  border: 'none',
                  height: '2.5rem',
                  width: '2.5rem',
                  color: theme.palette.grey[500],
                  "&:hover": { backgroundColor: "transparent" },
                },
                "& .MuiSvgIcon-root": { fontSize: "1.25rem" }
              }}
            />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2}>
          <Button onClick={submit} variant="contained" color="secondary">Применить</Button>
          {(searchParams.get("date_start_tz") || searchParams.get("date_end_tz")) && (
            <Button onClick={() => { resetFilter(); onClose() }} variant="contained" color="primary">Сбросить фильтр</Button>
          )}
        </Grid2>
      </Grid2>
  </Menu>
  )
}

export default ChartMenu