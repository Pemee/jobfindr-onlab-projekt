import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AdbIcon from '@mui/icons-material/Adb';
import { Button } from '@mui/material';
import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/appbar.css'
import { useEffect, useState } from 'preact/hooks';

interface User{
  user_id:number,
  firstname: string,
  lastname: string,
  username: string,
  email: string,
  password: string,
  country: number | null,
  phone_number: number | null,
  role: string,
  created_at: string
}
export function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [user,setUser] = useState<User>();
  const [username, setUsername] = useState<String | null>(null);
  function logout(){
    localStorage.removeItem('isAuthenticated');
  }
  async function getUser(): Promise<User | undefined> {
    try {
        const response = await fetch(`http://localhost:8081/user/${username}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: User = await response.json();
        return data;
    } catch (error) {
        //console.error("Error fetching posts:", error);
        return undefined;
    }
}
  const handleLogout = async () => {
    try {
        const response = await fetch('http://localhost:8081/auth/logout', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
              },
        });
        if (response.status === 200){
            logout();
            localStorage.removeItem("username");
            navigate('/');
        } else {
            const errorData = await response.json()
            alert(errorData.message || 'Login failed for user. Please retry!')
        }
    } catch(error) {
      alert('Login failed for user. Please retry!')
    }
  }
  useEffect(() => {
    const un = localStorage.getItem("username");
    setUsername(un);
    if(username !== null || username !== undefined){
      const fetchUser = async () => {
      const result = await getUser();
      setUser(result);
    };
    fetchUser();
    }
    
    }, [username]);
  
  
  return <div>
    <AppBar position="static" sx={{ backgroundColor: '#536878' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            JobFindr
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ flexGrow: 0 }}>
            {
              localStorage.getItem('isAuthenticated') === 'true' ?
              <div class="appbar-container">
                {
                  user?.role === "COMPANY" ? <Link to="/post-creation" style={{ textDecoration: 'none'}}><div class="sign-in">Create Post</div></Link>:
                  <div></div>
                }
                <Link to="/profile" style={{ textDecoration: 'none'}}><div class="sign-in">Profile</div></Link>
                <Button sx={{fontSize:'1.5rem', color:'white', textTransform: "none", fontWeight:'bold'}} onClick={handleLogout}>Logout</Button>
              </div>
              :<Link to="/login" style={{ textDecoration: 'none' }}><div class="sign-in">Login or Register</div></Link>
            }
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    </div>
}
