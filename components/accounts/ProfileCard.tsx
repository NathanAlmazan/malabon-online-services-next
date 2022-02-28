// IMPORTS
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

// STYLES
const styles = {
  details: {
    padding: "1rem",
    borderTop: "1px solid #e1e1e1"
  },
  value: {
    padding: "1rem 2rem",
    borderTop: "1px solid #e1e1e1",
    color: "#899499"
  }
};

//APP
export default function ProfileCard(props: any) {
  return (
    <Card variant="outlined">
      {props.name.length == 0 ? (
        <Stack spacing={2} justifyContent="center" alignItems="center" sx={{ height: 300 }} >
            <PersonSearchIcon color="primary" sx={{ width: 100, height: 100 }} />
            <Typography component="div" variant="body1">
              Search Account
            </Typography>
        </Stack>
      ) : (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {/* CARD HEADER START */}
          <Grid item sx={{ p: "1.5rem 0rem", textAlign: "center" }}>
            {/* PROFILE PHOTO */}
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <PhotoCameraIcon
                  sx={{
                    border: "5px solid white",
                    backgroundColor: "#ff558f",
                    borderRadius: "50%",
                    padding: ".3rem",
                    color: "#FFFF",
                    width: 40,
                    height: 40
                  }}
                ></PhotoCameraIcon>
              }
            >
              <Avatar
                sx={{ width: 100, height: 100, mb: 1.5 }}
                src={props.image ? props.image : "/icons/account_profile.png"}
              ></Avatar>
            </Badge>

            {/* DESCRIPTION */}
            <Typography variant="h6">{props.name}</Typography>
            <Typography color="text.secondary">{props.sub}</Typography>
          </Grid>
          {/* CARD HEADER END */}

          {/* DETAILS */}
          <Grid container>
            <Grid item xs={6}>
              <Typography style={styles.details}>Gender</Typography>
              <Typography style={styles.details}>Phone Number</Typography>
            </Grid>
            {/* VALUES */}
            <Grid item xs={6} sx={{ textAlign: "end" }}>
              <Typography style={styles.value}>{props.dt1}</Typography>
              <Typography style={styles.value}>{props.dt2}</Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Card>
  );
}
