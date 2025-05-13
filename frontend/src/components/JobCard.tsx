import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';
import Chip from '@mui/material/Chip';
import '../styles/jobcard.css'
import { useNavigate } from 'react-router-dom'
import { PostType } from '../PostType'

type CardProps = {
    id: number;
    title: string;
    description: string;
    country: string;
    company: string;
    details: string;
    tags:string;
}


export default function JobCard({id,title, description, country, company, details,tags}: CardProps) {7
  const navigate = useNavigate()
  const handlePostClick = (id: number, postData: PostType) => {
    navigate(`/posts/${id}`, { state: { post: postData } });
};
  return (
    <Card sx={{ minWidth: 275, margin: 1, boxShadow: 5}}>
      <CardContent>
        <div style={{display:'flex', justifyContent:'space-between'}}>
        <Typography variant="h5" component="div" sx={{fontWeight: 'bold'}}>{title}</Typography>
      <Chip
                            label={tags}
                            sx={{backgroundColor: '#e0f7fa',borderRadius: '16px',margin: '0 4px 4px 0',fontSize: '0.75rem',height: '24px',
                            }}
                            />
       </div>
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
        <Button size="medium" onClick={()=>{handlePostClick(id, { id: id, title: title, description: description,country:country, company_name: company, details:details, tags:tags})}}>More Info...</Button>
      </CardActions>
    </Card>
  );
}