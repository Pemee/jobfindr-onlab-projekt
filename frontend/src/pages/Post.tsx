import { useLocation, useNavigate } from "react-router-dom";
import '../styles/post.css'
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';
import PostType from "../PostType";


export default function Post(){
    const location = useLocation();
    const post = location.state?.post;
    const navigate = useNavigate();
    const handleApplyClick = (id: number, postData: PostType) => {
        navigate(`/application/${id}`, { state: { post: postData } });
    };
    function formatID(id: number): string {
      return id.toString().padStart(3, "0");
    }
    const openPdf = () => {
      const formattedID = formatID(post.id);
      window.open(`/src/ai/uploads/${formattedID}.pdf`, '_blank');
    };
    if (!post) {
        return <p>No post data found!</p>;
    }
    return <div class="form-container">
     
        <Card sx={{ minWidth: 275,width:"100%", margin: 1, boxShadow: 5}}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{fontWeight: 'bold'}}>{post.title}</Typography>
        <div class="icon-text">
            <BusinessIcon/>
            <Typography sx={{ color: 'text.secondary', pl: 1}}>{post.company_name}</Typography>           
        </div>
        <div class="icon-text">
        <LanguageIcon/>
        <Typography sx={{ color: 'text.secondary', mb: 1.5, pl: 1}}>{post.country}</Typography>
        </div>
        <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>{post.details}</Typography>
      </CardContent>
      <CardActions>
      <Button size="medium" onClick={openPdf}>Learn Material</Button>
        <Button size="medium" onClick={()=>{handleApplyClick(post.id, { id: post.id, title: post.title, description: post.description, country:post.country, company_name: post.company_name, details:post.details})}}>Apply</Button>
      </CardActions>
    </Card>
    </div>
}