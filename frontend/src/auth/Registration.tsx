import { useState } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Button,
    Box,
    Container,
    TextField,
    Card,
    CardContent,
    Checkbox
  } from '@mui/material';
import '../styles/registration.css';

export default function Registration() {

    const [formData, setFormData] = useState({
        firstname:'',
        lastname:'',
        username: '',
        email: '',
        password: '',
        phone:'',
        role:'',
        country: '',
        confirmPassword: ''
    })

    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleChange = (e:any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleRoleInput = (e:any) =>{
      setFormData({
        ...formData,
        [e.target.name]:e.target.value ? 'Employee' : 'Employer'
      });
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('')
        try {
          console.log(formData);
            const response = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
              });

            if(response.status === 201) {
              console.log(formData);
                navigate("/");
            } else {
                const errorText = await response.text();
                setError(errorText)
            }
        } catch(err) {
            setError('An error occured during user registration')
        }

    }

  return (
    <Card sx={{ maxWidth: 700, margin: '30px auto', border: '3px solid #356' }}>
    <CardContent>
    <Container maxWidth="xs">
    <Box sx={{ mt: 0}}>
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>

      <form onSubmit={handleSubmit}>
      <TextField
              label="First Name"
              name="firstname"
              fullWidth
              value={formData.firstname}
              onChange={handleChange}
              required
              sx={{m:1}}
            />
             <TextField
              label="Last Name"
              name="lastname"
              fullWidth
              value={formData.lastname}
              onChange={handleChange}
              required
              sx={{m:1}}
            />
            <TextField
              label="Username"
              name="username"
              fullWidth
              value={formData.username}
              onChange={handleChange}
              required
              sx={{m:1}}
            />
             <TextField
              label="Email"
              name="email"
              type='email'
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
              sx={{m:1}}
            />
             <TextField
              label="Phone number"
              name="phone"
              type='tel'
              fullWidth
              value={formData.phone}
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
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
              sx={{m:1}}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{m:1}}
            />
            <div class="checkbox-with-text">
            <Checkbox 
            onChange={handleRoleInput}
            name='role'
            value={formData.role}
            />
            <Typography>
              Register as a company
            </Typography>              
            </div>
            
          {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
          )}
            <Button sx={{m:1, bgcolor:'#4ebd45'}} type="submit" fullWidth variant="contained" color="primary">
              Register
            </Button>
      </form>
    </Box>
  </Container>
  </CardContent>
  </Card>
  )
}