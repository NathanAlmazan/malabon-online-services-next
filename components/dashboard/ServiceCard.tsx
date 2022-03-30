import React, { ReactNode } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from "./homePage/HeroBanner";

interface Props {
  openDialog: (value: string) => void;
  details: {
    title: string;
    icon: ReactNode;
    description: string;
    applyLink: string;
  }
}

export default function ServiceCard({ details, openDialog }: Props) {

  return (
    <Card sx={{ maxWidth: 345 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
        mt: 2,
        height: 100
      }}>
        {details.icon}
      </Box>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" color="primary" align="center" fontWeight="bold">
          {details.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {details.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2 }}>
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={() => openDialog(details.title)}
          sx={{ minWidth: '100%' }}
        >
          Apply Now
        </Button>
      </CardActions>
    </Card>
  );
}
