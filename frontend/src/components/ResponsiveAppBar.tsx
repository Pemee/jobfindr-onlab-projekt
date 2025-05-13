import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
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
  const [loggedIn, SetLoggedIn] = useState(false);
  function logout(){
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem("username");
    SetLoggedIn(false);
  }
  async function getUser(): Promise<User | undefined> {
    if(username === null){
      return;
    }
    try {
        const response = await fetch(`http://localhost:8081/user/username/${username}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: User = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return undefined;
    }
  }
  async function isLoggedIn(){
    if(username === null){
      return;
    }
    try {
        const response = await fetch(`http://localhost:8081/session/${username}`);
        if (response.status === 404) {
            SetLoggedIn(false);
            localStorage.removeItem("authenticated");
            localStorage.removeItem("username");
        }
        if(response.status === 200){
          SetLoggedIn(true);
        }
    } catch (error) {
        
        return undefined;
    }
  }

  async function handleLogout(){
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
            navigate('/');
        } else {
            const errorData = await response.json()
            alert(errorData.message || 'Login failed for user. Please retry!')
        }
    } catch(error) {
      alert('Login failed for user. Please retry!')
    }
  }
  function onLogoClicked(){
    navigate('/');
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
    isLoggedIn();
    }
    
    }, [username]);
  
  
  return <div>
    <AppBar position="static" sx={{ backgroundColor: '#536878' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={onLogoClicked}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': {
              cursor: 'pointer',
            },
            }}
          >
            JobFindr
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ flexGrow: 0 }}>
            {
              loggedIn === true ?
              <div class="appbar-container">
                {
                  user?.role === "COMPANY" ? <div style={{display:"flex"}}>
                    <Link to="/post-creation" style={{ textDecoration: 'none'}}><div class="sign-in">Create Post</div></Link>
                    <Link to="/applications" style={{ textDecoration: 'none'}}><div class="sign-in">Applications</div></Link>
                  </div>
                  :
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
