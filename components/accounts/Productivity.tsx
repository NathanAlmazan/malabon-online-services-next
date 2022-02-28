import { Avatar, Box, Card, CardContent, Grid, LinearProgress, Typography } from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChartOutlined';

const Productivity = (props: { value: number }) => (
  <Card
    sx={{ height: '100%' }}
    elevation={10}
  >
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            PRODUCTIVITY
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {props.value.toString() + "%"}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'warning.main',
              height: 56,
              width: 56
            }}
          >
            <InsertChartIcon />
          </Avatar>
        </Grid>
      </Grid>
      <Box sx={{ pt: 3 }}>
        <LinearProgress
          value={props.value}
          variant="determinate"
        />
      </Box>
    </CardContent>
  </Card>
);

export default Productivity;