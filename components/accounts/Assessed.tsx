import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import LocalMallIcon from '@mui/icons-material/LocalMall';

const Assessed = (props: { value: number }) => (
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
            ASSESSED TODAY
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {props.value}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56
            }}
          >
            <LocalMallIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default Assessed;