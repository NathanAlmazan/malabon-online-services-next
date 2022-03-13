import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface Props {
  openDialog: (value: string) => void;
  details: {
    title: string;
    image: string;
    description: string;
    applyLink: string;
  }
}

export default function ServiceCard({ details, openDialog }: Props) {

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="150"
        image={details.image}
      />
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
