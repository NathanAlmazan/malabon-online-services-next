import React, { ReactNode } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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
        <Typography gutterBottom variant="h5" component="div" color="primary">
          {details.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {details.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => openDialog(details.title)}>Apply Now</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
