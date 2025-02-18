import { useState, useEffect } from 'react';
import { capitalizeFirstLetter } from '@helpers/capitalizeFirstLetter';

const useTransformPieData = ({ data, colors = [], titleKey = 'title', valueKey = 'count' }) => {
  const [resultData, setResultData] = useState([]);
  const [totalResult, setTotalResult] = useState(0);


  useEffect(() => {
    if (!data || data.length === 0) {
      setResultData([]);
      setTotalResult(0);
      return;
    }

    const aggregatedData  = data.reduce((acc, item) => {
      const title = capitalizeFirstLetter(item[titleKey]);
      const value = item[valueKey] ? Number(item[valueKey]) : 1;
      acc[title] ? acc[title] += value : acc[title] = value;
      
      return acc;
    }, {});


    const total = Object.values(aggregatedData).reduce((sum, count) => sum + count, 0);
    setTotalResult(total);

    const transformedData = Object.entries(aggregatedData).map(([label, value], index) => ({
      label,
      value,
      percentage: ((value / total) * 100).toFixed(1),
      color: colors[index % colors.length] || "#ccc",
    }))
    .sort((a, b) => b.value - a.value);
  
    setResultData(transformedData);
  }, [data])

  return { resultData, totalResult }
}

export default useTransformPieData