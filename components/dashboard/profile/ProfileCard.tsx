// IMPORTS
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import { useAuth } from "../../../hocs/FirebaseProvider";

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
  const { currentUser } = useAuth();

  const handleProfile = () => {
    if (currentUser && currentUser.user.photoURL) {
      window.open(currentUser.user.photoURL);
    }
  }
  return (
    <Card variant="outlined">
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
                  padding: ".2rem",
                  width: 50,
                  height: 50
                }}
              ></PhotoCameraIcon>
            }
          >
            <Avatar
              sx={{ width: 200, height: 200, mb: 1.5 }}
              src={currentUser && currentUser.user.photoURL ? currentUser.user.photoURL : "/icons/account_profile.png"}
            ></Avatar>
          </Badge>

          {/* DESCRIPTION */}
          
        </Grid>
        {/* CARD HEADER END *}

        {/* BUTTON */}
        <Grid item style={styles.details} sx={{ width: "100%", pb: 2 }}>
          <Typography variant="h5" align="center">{props.name}</Typography>
          <Typography color="text.secondary" align="center">{props.sub}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
}
