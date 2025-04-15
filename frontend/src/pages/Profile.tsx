import { Box, Button, Card, CardContent, Container, Typography, TextField } from "@mui/material";
import { useState } from "preact/hooks";
import{ useNavigate }from "react-router-dom";



export default function Profile(){
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [country, setCountry] = useState("");
    function handleBack(){
        navigate('/');
    }

    function handleSave(){

    }

    return <Card sx={{ maxWidth: 900, margin: '30px auto', border: '3px solid #356' }}>
    <CardContent>
        <Container>
        <Box
          component="form"
          onSubmit={handleSave}
          sx={{display: 'flex', flexDirection: 'column'}}
        >
          <Typography variant="h4" component="h1" align="center">
            Please finalize your profile
          </Typography>

            <Box sx={{display:'flex', alignItems: 'center', justifyContent:'space-between'}}>
            <Typography fontSize={20}>
                Add phone number: 
            </Typography>
            <TextField
            label="Phone number"
            variant="outlined"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
            required
            sx={{m:1, maxWidth:600}}
            />  
            </Box>
            <Box sx={{display:'flex', alignItems: 'center', justifyContent:'space-between'}}>
            <Typography fontSize={20}>
                Add your country: 
            </Typography>
            <TextField
            label="Country"
            variant="outlined"
            type="text"
            fullWidth
            value={country}
            required
            onChange={(e) => setCountry(e.currentTarget.value)}
            sx={{m:1, maxWidth:600}}
            /> 
            </Box>
        </Box>
        </Container>
        <Box sx={{display:'flex', alignItems: 'center', justifyContent:'space-between'}}>
          <Button onClick={handleBack} variant="contained" color="primary" sx={{m:1}}>
            Back
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{m:1}}>
            Save
          </Button>
          </Box>
    </CardContent>
  </Card>
}
