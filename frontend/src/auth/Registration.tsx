import { useState } from 'preact/hooks';
import { Link, useNavigate } from 'react-router-dom';
import {
    Typography,
    Button,
    Box,
    Container,
    TextField,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel
  } from '@mui/material';

export default function Registration() {

    const [formData, setFormData] = useState({
        firstname:'',
        lastname:'',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    })
    const [role, setRole] = useState(false);

    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleChange = (e:any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleRoleChange = (e:any) => {
      setRole(e.currentTarget.value);
  };
    const handleLogin = async (e:any) => {
      e.preventDefault()
      setError('')
      const loginData = {
          username:formData.username,
          password:formData.password
      }
      try {
          const response = await fetch('http://localhost:8081/auth/login', {
              method: "POST",
              credentials:"include",
              headers: {
                  "Content-Type": "application/json",
                },
              body: JSON.stringify(loginData)
          });
          if (response.status === 200){
              localStorage.setItem("isAuthenticated","true");
              localStorage.setItem("username",formData.username);
              navigate('/');
          } else {
              const errorData = await response.json()
              setError(errorData.message || 'Login failed for user. Please retry!')
          }
      } catch(error) {
          setError('And error occurred. please retry')
      }

  }
    const handleSubmit = async (e:any) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if(role){
          formData.role="COMPANY";
        }else{
          formData.role="USER";
        }
        setError('')
        try {
            const response = await fetch("http://localhost:8081/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
              });

            if(response.status === 201) {
              handleLogin(e);
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
            <FormControlLabel
        control={
          <Checkbox
            name="registerAsCompany"
            checked={role}
            onChange={handleRoleChange}
            required
            sx={{ m: 1 }}
          />
        }
        label="Register as a company"
      />
            
          {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
          )}
            <Button sx={{m:1}} type="submit" fullWidth variant="contained" color="primary">
              Register
            </Button>
      </form>
    </Box>
    <Box sx={{display:'flex', alignItems: 'center', justifyContent:'space-between',flexDirection:'row'}}>
            <Typography sx={{m:1}}>
              Already have an account?
            </Typography>
            <Typography>
              <Link to="/login">Log in</Link>
            </Typography>
          </Box>
  </Container>
  </CardContent>
  </Card>
  )
}