// IMPORTS
import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

const styles = {
  media: {
    maxWidth: "100vw",
    position: "fixed",
    right: 0,
    top: 0,
    left: 0,
  } as React.CSSProperties,
};

export default function LogoCard() {
  return (
    <Card style={styles.media}>
      <CardContent>
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          pt={{ md: 1 }}
        >
          <Grid item xs={2} sm={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CardMedia
              component="img"
              src="/icons/malabon_logo.png"
              alt="logo"
              sx={{
                width: 50,
                height: 50,
              }}
            />
          </Grid>
          <Grid item xs={8}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: 18, md: 24 }
              }}
            >
              Malabon Online Services
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}