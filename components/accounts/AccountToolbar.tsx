import {
    Box,
    Card,
    Paper,
    TextField,
    InputAdornment,
    SvgIcon
  } from '@mui/material';
  import { Search as SearchIcon } from '../../icons/search';

  interface Props {
    searchValue: string;
    handleChangeSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

const AccountToolbar = (props: Props) => (
      <Card sx={{ mt: 3 }}>
        <Paper elevation={10}>
            <Box sx={{ maxWidth: 500, p: 2 }}>
              <TextField
                fullWidth
                value={props.searchValue}
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
                placeholder={"Search user"}
                variant="outlined"
                onChange={props.handleChangeSearch}
              />
            </Box>
        </Paper>
      </Card>
  );

  export default AccountToolbar;