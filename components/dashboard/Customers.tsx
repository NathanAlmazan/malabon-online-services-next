import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';


const TotalCustomers = (props: { title: string, value: number }) => (
  <Card sx={{ height: '100%' }}>
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
            {props.title}
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
            <BusinessIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default TotalCustomers;