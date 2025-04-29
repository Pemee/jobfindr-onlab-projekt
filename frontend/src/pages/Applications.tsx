import { useEffect, useState } from "preact/hooks";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    dividerClasses
  } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ResponsiveAppBar } from "../components/ResponsiveAppBar";

interface ResponseFormat{
    country: string,
    title: string,
    lastname: string,
    firstname: string,
    score: number,
    phoneNumber: string,
    email:string
}
export default function Application(){
    const [applications, SetApplications] = useState<ResponseFormat[]>()

    const company_name = "Bosch kft.";
    async function getApplications(){
        try{
            const response = await fetch(`http://localhost:8081/post/applications/${company_name}`);
            if(response.status === 200){
                const result:ResponseFormat[] = await response.json();
                SetApplications(result);
            }
        }
        catch(error){
            console.log("Something went wrong during fetching applications!")
        }
    }
    useEffect(() => {
            getApplications();
    }, []);
    const groupedByPost: Record<string, ResponseFormat[]> = (applications ?? []).reduce(
        (acc, app) => {
          if (!acc[app.title]) acc[app.title] = [];
          acc[app.title].push(app);
          return acc;
        },
        {} as Record<string, ResponseFormat[]>
      );
    
      return <div>
        <ResponsiveAppBar/>
        <div style={{margin:"0px 0px 30px 0px"}}></div>
          {Object.entries(groupedByPost).map(([title, apps]) => (
            <Accordion key={title}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {apps.map((app, idx) => (
                  <Box key={idx} mb={2}>
                    <Typography>
                      <strong>{app.firstname} {app.lastname}</strong> from {app.country}
                    </Typography>
                    <Typography>
                      Score: {app.score} | Phone: {app.phoneNumber} | Email: {app.email}
                    </Typography>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
          {(applications === undefined || applications.length === 0) && <div style={{display:"flex", justifyContent:"center"}}>No applications found.</div> }
        </div>
    
}