import { useSearchParams } from "react-router-dom";

function useUpdateSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = (key, value) => {
    const updatedParams = new URLSearchParams(searchParams);
    
    value.trim() ? updatedParams.set(key, value) : updatedParams.delete(key);

    setSearchParams(updatedParams);
  };

  return updateSearchParams;
}

export default useUpdateSearchParams
