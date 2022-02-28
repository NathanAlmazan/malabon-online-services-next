import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

interface Props {
  details: {
    title: string;
    image: string;
    description: string;
    applyLink: string;
  }
}

export default function ServiceCard({ details }: Props) {
  const router = useRouter();

  const handleApply = () => {
    router.push(details.applyLink)
  }
  
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
        <Button size="small" onClick={handleApply}>Start Assessment</Button>
      </CardActions>
    </Card>
  );
}
