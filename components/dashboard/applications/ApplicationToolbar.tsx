import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import SvgIcon from "@mui/material/SvgIcon";
import { alpha } from '@mui/material/styles';
import { Search as SearchIcon } from '../../../icons/search';
import InboxMenu from "./InboxMenu";

type Filter = "assessment" | "approved" | "new" | "renew" | "building" | "all" | "unpaid" | "estate";

interface EnhancedTableToolbarProps {
    numSelected: number;
    selectFilter: (value: Filter) => void;
    filter: Filter;
    searchValue: string;
    searchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected, filter, selectFilter, searchValue, searchChange } = props;
  
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          height: 100,
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
          {numSelected > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} selected
            </Typography>
          ) : (
              <TextField
                sx={{ minWidth: 300 }}
                value={searchValue}
                onChange={searchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        color="action"
                        fontSize="small"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Search Business Name"
                variant="outlined"
              />
          )}
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <InboxMenu filter={filter} selectFilter={selectFilter} />
          )}
        </Stack>
      </Toolbar>
    );
  };

  export default EnhancedTableToolbar;