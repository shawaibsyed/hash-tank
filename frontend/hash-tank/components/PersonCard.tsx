import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

interface PersonCardProps {
  name: string;
  image: string;
  role: string;
  products: string[];
}

const PersonCard: React.FC<PersonCardProps> = ({ name, image,role, products }) => (
  <Card style={{ borderRadius: '4px', margin: '25px', background :'grey', minHeight:'300px' }}>
    {/* <h3 style={{margin:'25px', color:'white'}}>{role}</h3> */}
    <div className='d-flex justify-content-end' >
        <CardMedia style={{width:'10%', height:'10%'}} component="img" image={image} alt={name} />
    </div>
    <CardContent>
      <Typography variant="h6" component="div">
        {name}
      </Typography>
      {/* <Typography variant="body2" color="text.secondary">
        Products: {products.join(', ')}
      </Typography> */}
    </CardContent>
  </Card>
);

export default PersonCard;
