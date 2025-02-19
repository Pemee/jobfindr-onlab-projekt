import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';
import '../styles/jobcard.css'


type CardProps = {
    title: string;
    description: string;
    country: string;
    company: string;
}


export default function JobCard({title, description, country, company}: CardProps) {
  return (
    <Card sx={{ minWidth: 275, background: '#affaa9', margin: 1, boxShadow: 5}}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{fontWeight: 'bold'}}>{title}</Typography>
        <div class="icon-text">
            <BusinessIcon/>
            <Typography sx={{ color: 'text.secondary', pl: 1}}>{company}</Typography>           
        </div>
        <div class="icon-text">
        <LanguageIcon/>
        <Typography sx={{ color: 'text.secondary', mb: 1.5, pl: 1}}>{country}</Typography>
        </div>
        <Typography variant="body1">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button size="medium">Apply</Button>
      </CardActions>
    </Card>
  );
}