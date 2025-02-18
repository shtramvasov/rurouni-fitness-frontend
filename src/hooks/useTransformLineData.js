import { useState, useEffect } from 'react';
import { capitalizeFirstLetter } from '@helpers/capitalizeFirstLetter';

const useTransformLineData = ({ data, colors = [], xAxisKey = 'title', yAxisKey = 'value', valueIsNumber = false, sortDescending = false }) => {
  const [resultData, setResultData] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setResultData([]);
      return;
    }

    // Сортируем данные по xAxisKey
    const sortedData = [...data].sort((a, b) => {
      const aValue = a[xAxisKey];
      const bValue = b[xAxisKey];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDescending ? bValue - aValue : aValue - bValue;
      }

      return sortDescending ? String(bValue).localeCompare(String(aValue)) : String(aValue).localeCompare(String(bValue));
    });

    // Преобразуем в нужный формат
    const transformedData = sortedData.map((item, index) => ({
      label: capitalizeFirstLetter(item[xAxisKey]),
      value: valueIsNumber ? Number(item[yAxisKey]) : item[yAxisKey],
      color: colors[index % colors.length] || "#ccc",
    }));

    setResultData(transformedData);
  }, [data]);

  return resultData;
};

export default useTransformLineData;
