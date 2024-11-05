import { useSearchParams } from "react-router-dom";
import {  InputAdornment, FormControl, OutlinedInput } from "@mui/material"
import { SearchRounded } from "@mui/icons-material"


function SearchSection() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearchChange = (event) => {
    const newValue = event.target.value

    if(!newValue.trim()) {
      searchParams.delete('search')
      setSearchParams(searchParams)
      return;
    }

    setSearchParams({ search: newValue });
  };


  return (
    <FormControl sx={{ width: '100%' }} variant="outlined">
      <OutlinedInput
        size="small"
        fullWidth
        placeholder="Искать упражнение"
        value={searchParams.get("search") ?? ''}
        onChange={handleSearchChange}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRounded fontSize="small" />
          </InputAdornment>
        }
      />
    </FormControl>
  )
}

export default SearchSection