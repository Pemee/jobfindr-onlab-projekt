import { useState } from 'preact/hooks'

import {
    Typography,
    Button,
    Box,
    Container,
    Card,
    CardActions,
    CardContent,
    TextField
  } from '@mui/material';
import { Link, useNavigate} from 'react-router-dom';



export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()

    function login(){
      localStorage.setItem("isAuthenticated","true");
    }
    const handleLogin = async (e:any) => {
      e.preventDefault()
      setError('')
      const loginData = {
          username:username,
          password:password
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
              login();
              localStorage.setItem("username",username);
              navigate('/');
          } else {
              const errorData = await response.json()
              setError(errorData.message || 'Login failed for user. Please retry!')
          }
      } catch(error) {
          setError('And error occurred. please retry')
      }

  }

  return (
    <Card sx={{ maxWidth: 900, margin: '30px auto', border: '3px solid #356' }}>
      <CardContent>
          <Container maxWidth="xs">
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{display: 'flex', flexDirection: 'column' }}
          >
            <Typography variant="h4" component="h1" align="center">
              Login
            </Typography>

            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}

            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              required
              sx={{m:1}}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
              sx={{m:1}}
            />

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{m:1}}>
              Login
            </Button>
          </Box>
          <Box sx={{display:'flex', alignItems: 'center', justifyContent:'space-between',flexDirection:'row'}}>
            <Typography sx={{m:1}}>
              Haven't registered yet?
            </Typography>
            <Typography>
              <Link to="/registration">Register</Link>
            </Typography>
          </Box>
          </Container>
      </CardContent>
      <CardActions>
      </CardActions>
    </Card>

  )
}