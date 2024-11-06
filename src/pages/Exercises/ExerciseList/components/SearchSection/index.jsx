import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Grid2, InputAdornment, FormControl, OutlinedInput, IconButton, Divider, Tooltip, Menu, MenuItem, Typography, Badge, useTheme } from "@mui/material"
import { SearchRounded, SortRounded, CloseRounded } from "@mui/icons-material"
import { MUSCLE_GROUPS_OPTIONS } from "@constants/exercises.constants";


function SearchSection() {
  const theme = useTheme()

  const [searchParams, setSearchParams] = useSearchParams()
  const [orderMenu, setOrderMenu] = useState({ anchor: null, isOpen: false })


  const updateSearchParams = (key, value) => {
    const updatedParams = new URLSearchParams(searchParams)

    value.trim() ? updatedParams.set(key, value) : updatedParams.delete(key) 
    setSearchParams(updatedParams);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <FormControl sx={{ width: '100%' }} variant="outlined">
        <OutlinedInput
          size="small"
          fullWidth
          placeholder="Искать упражнение"
          value={searchParams.get("search") ?? ''}
          onChange={(e) => updateSearchParams('search', e.target.value)}
          startAdornment={
            <InputAdornment position="start" sx={{ color: 'text.primary' }}>
              <SearchRounded fontSize="small" />
            </InputAdornment>
          }
        />
      </FormControl>
      <Divider flexItem orientation="vertical" variant="middle" />
      <Tooltip title='Сортировать' placement="bottom-end">
        <Badge 
          invisible={!searchParams.get("order")} 
          variant="dot" 
          color="primary" 
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
         >
          <IconButton 
            sx={{ 
              border:     searchParams.get("order") ? `1px ${theme.palette.brand[200]} solid` : '', 
              bgcolor:    searchParams.get("order") ? theme.palette.brand[50] : '' 
            }} 
            onClick={(e) => setOrderMenu({ anchor: e.currentTarget, isOpen: !orderMenu.isOpen })} 
            size='small'
          >
            <SortRounded sx={{ fill: searchParams.get("order") ? theme.palette.brand[500] : '' }} />
          </IconButton>
        </Badge>
      </Tooltip>

      <Menu
        anchorEl={orderMenu.anchor}
        open={orderMenu.isOpen}
        onClose={() => setOrderMenu({ anchor: null, isOpen: false })}
        anchorOrigin={{ vertical: 'bottom' }}
      >
        <Grid2 container sx={{ flexDirection: 'column', p: 0.5 , minWidth: '12rem'}} spacing={0.5}>
          <Typography variant="caption" sx={{ p: 1, fontWeight: 500, color: theme.palette.gray[800] }}>Сортировать упражнения</Typography>
          <Divider flexItem/>

          {MUSCLE_GROUPS_OPTIONS.map((option) => (
            <MenuItem 
              key={option.value}
              sx={{ py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              onClick={() => { updateSearchParams('order', option.value); setOrderMenu({ anchor: null, isOpen: false }) }} 
              selected={searchParams.get("order") === option.value}
            >
              {option.title}

              {searchParams.get("order") === option.value && (
                <Tooltip title='Сбросить сортировку'>
                  <CloseRounded 
                  sx={{ 
                    zIndex: 999,
                    fontSize: 22, 
                    p: 0.5, 
                    bgcolor: theme.palette.gray[200], 
                    fill: theme.palette.gray[600], 
                    borderRadius: 2,
                    transition: 'background-color 0.5s ease',

                    '&:hover': { bgcolor: theme.palette.gray[300] }
                  }}
                  onClick={(e) => { e.stopPropagation(); updateSearchParams('order', '') }}
                  />
                </Tooltip>
              )}

            </MenuItem>
          ))}
        </Grid2>
      </Menu>
    </Box>
  )
}

export default SearchSection