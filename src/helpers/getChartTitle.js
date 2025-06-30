import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";


export const getChartTitle = (text) => {
  const [searchParams] = useSearchParams();

  // Если дат не выбрано
  if(!searchParams.get("date_start_tz") && !searchParams.get("date_end_tz")) {
    return `${text} за ${dayjs().format('YYYY')} год`
  }

  const startDate = dayjs(searchParams.get("date_start_tz"));
  const endDate = dayjs(searchParams.get("date_end_tz"));

  // Проверка, если даты лежат в одном месяце
  const isSameMonth = startDate.isSame(endDate, "month");

  // Проверка, если период полный (с 1 числа месяца до последнего)
  const isFullMonth = startDate.date() === 1 && endDate.date() === endDate.daysInMonth();

  // Проверка, если начало периода с 1 числа месяца и конец периода с 1 числа следующего месяца
  const isStartOfMonthToStartOfNextMonth = startDate.date() === 1 && endDate.date() === 1 && endDate.subtract(1, 'month').isSame(startDate, 'month');

  // Если начало с 1 числа месяца, а конец с 1 числа следующего месяца
  if (isStartOfMonthToStartOfNextMonth) {
    return `${text} за ${startDate.format("MMMM")}`;  // Показать только месяц начала
  }
  // Если частичный месяц (например с 1 по 10 число)
  if (isSameMonth && startDate.date() !== 1 && endDate.date() !== endDate.daysInMonth()) {
    return `${text} за период ${searchParams.get("date_start_tz") ? `c ${startDate.format("D MMMM YYYY")}` : ''} ${searchParams.get("date_end_tz") ? `по ${endDate.format("D MMMM YYYY")}` : ''}`;
  }

    // Если начало и конец в одном месяце и полный месяц
  if (isSameMonth && isFullMonth) {
    return `${text} за ${startDate.format("MMMM")}`;
  }

  // Для всех других случаев, когда даты не в одном месяце
  return `${text} за период ${searchParams.get("date_start_tz") ? `c ${startDate.format("D MMMM YYYY")}` : ''} ${searchParams.get("date_end_tz") ? `по ${endDate.format("D MMMM YYYY")}` : ''}`;
  };