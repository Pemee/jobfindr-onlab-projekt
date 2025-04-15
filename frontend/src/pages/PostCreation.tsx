import { useEffect, useState } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import {
    Typography,
    Button,
    Box,
    Container,
    TextField,
    Card,
    CardContent
  } from '@mui/material';
  interface Post {
    id: number;
    title: string;
    description: string;
    country: string;
    company_name: string;
    details: string;
}
export default function PostCreation() {
    const [file, setFile] = useState<File | null>(null);
    const [pdfId, setPdfId] = useState('');
    const [formData, setFormData] = useState({
        title:'',
        description:'',
        country: '',
        company_name: '',
        details: ''
    })
    const [error, setError] = useState('')
    const [token, setToken] = useState<string | undefined>("")
    const navigate = useNavigate()
    const handleFileChange = (e:any) => {
      setFile(e.target.files[0]);
    };
    const handleChange = (e:any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    async function uploadPdf(posts:Post[]){
        if (!file || posts === undefined) {
          setError('Please select a PDF file.');
          return;
        }
          let pdfid = posts[posts.length-1].id.toString();
          const fileFormData = new FormData();
          fileFormData.append('id',pdfid);
          fileFormData.append('pdf',file);
        try {
          const response = await fetch('http://127.0.0.1:8000/upload-pdf', {
            method: 'POST',
            body: fileFormData,  
          });
    
          if (!response.ok) {
            const errorText = await response.text();
            setError(errorText)
          }
          
          const data = await response.json();
          setPdfId(data.pdfId); 
          console.log(data.pdfId);
        } catch (err) {
          setError('An error occured during pdf posting');
        }

    }
    async function getAllPosts(){
      try {
          const response = await fetch("http://localhost:8081/post/getAllPosts", {
            method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data: Post[] = await response.json();
          uploadPdf(data);
      } catch (error) {
          console.error("Error fetching posts:", error);
      }
  }
    const handleSubmit = async (e:any) => {
      e.preventDefault();
      setError('')
        try {
            const response = await fetch("http://localhost:8081/post/addPost", {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
              });

            if(response.status === 201) {
                getAllPosts();
                navigate('/');
                alert("Post created!");
            } else {
                const errorText = await response.text();
                setError(errorText)
            }
        } catch(err) {
            setError('An error occured during posting')
        }
    }
    useEffect(() => {
        const storedToken = Cookies.get("access_token");
        setToken(storedToken);
    }, []);

  return (
    <Card sx={{ maxWidth: 700, margin: '30px auto', border: '3px solid #356' }}>
    <CardContent>
    <Container maxWidth="xs">
    <Box sx={{ mt: 0}}>
      <Typography variant="h4" align="center" gutterBottom>
        Create Post
      </Typography>

      <form onSubmit={handleSubmit}>
            <TextField
              label="Job Title"
              name="title"
              fullWidth
              value={formData.title}
              onChange={handleChange}
              required
              sx={{m:1}}
            />
             <TextField
              label="Job Description"
              name="description"
              fullWidth
              value={formData.description}
              onChange={handleChange}
              required
              sx={{m:1}}
            />
            <TextField
              label="Country"
              name="country"
              fullWidth
              value={formData.country}
              onChange={handleChange}
              required
              sx={{m:1}}
            />
             <TextField
              label="Name of the company"
              name="company_name"
              fullWidth
              value={formData.company_name}
              onChange={handleChange}
              required
              sx={{m:1}}
            />
            <TextField
              label="Job Details"
              name="details"
              multiline
              fullWidth
              value={formData.details}
              onChange={handleChange}
              required
              sx={{m:1}}
            />
            <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
            style={{ margin: '8px 0' }}
            />
            
          {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
          )}
            <Button sx={{m:1}} type="submit" fullWidth variant="contained" color="primary">
              Create Post
            </Button>
      </form>
    </Box>
  </Container>
  </CardContent>
  </Card>
  )
}