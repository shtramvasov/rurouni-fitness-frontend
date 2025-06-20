import { useSearchParams } from "react-router-dom";
import { Box, InputAdornment, FormControl, OutlinedInput, useTheme } from "@mui/material"
import { SearchRounded } from "@mui/icons-material"
import useUpdateSearchParams from "@hooks/useUpdateSearchParams";

function SearchSection() {
  const theme = useTheme()
  const updateSearchParams = useUpdateSearchParams();
  
  const [searchParams] = useSearchParams()

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <FormControl sx={{ width: '100%' }} variant="outlined">
        <OutlinedInput
          size="small"
          fullWidth
          placeholder="Искать программу тренировок по названию или описанию..."
          value={searchParams.get("search") ?? ''}
          onChange={(e) => updateSearchParams('search', e.target.value)}
          startAdornment={
            <InputAdornment position="start" sx={{ color: 'text.primary' }}>
              <SearchRounded fontSize="small" />
            </InputAdornment>
          }
        />
      </FormControl>
    </Box>
  )
}

export default SearchSection