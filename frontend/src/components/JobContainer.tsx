import JobCard from './JobCard';
import '../styles/jobcontainer.css';
import { useEffect, useState } from 'preact/hooks';
import { Container, TextField, MenuItem } from '@mui/material';

interface Post {
    id: number;
    title: string;
    description: string;
    country: string;
    company_name: string;
    details: string;
}
export default function JobContainer() {
    const [jobs, setJobs] = useState<Post[]>([]);
    const [search, setSearch] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("");
    
    const filteredJobs = jobs.filter(job =>
        (job.title?.toLowerCase()?.includes(search.toLowerCase()) || 
         job.description?.toLowerCase()?.includes(search.toLowerCase()) || 
         job.details?.toLowerCase()?.includes(search.toLowerCase())) 
        &&
        (selectedCountry === "" || job.country === selectedCountry) &&
        (selectedCompany === "" || job.company_name === selectedCompany)
    );
        

    async function getAllPosts(): Promise<Post[]> {
        try {
            const response = await fetch("http://localhost:8081/post/getAllPosts");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data: Post[] = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching posts:", error);
            return [];
        }
    }

    useEffect(() => {
        async function fetchJobs() {
            const posts = await getAllPosts();
            setJobs(posts);
        }
        fetchJobs();
    }, []);

    return (
        <div className="container">
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <TextField
                    fullWidth
                    label="Search job title, description..."
                    variant="outlined"
                    value={search}
                    onChange={(event) =>{setSearch((event.target as HTMLInputElement).value)}}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    select
                    label="Select Country"
                    value={selectedCountry}
                    onChange={(event) => { setSelectedCountry((event.target as HTMLInputElement).value)}}
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="">All</MenuItem>
                    {[...new Set(jobs.map(job => job.country))].map(country => (
                        <MenuItem key={country} value={country}>{country}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth
                    select
                    label="Select Company"
                    value={selectedCompany}
                    onChange={(event) => {setSelectedCompany((event.target as HTMLInputElement).value)}}
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="">All</MenuItem>
                    {[...new Set(jobs.map(job => job.company_name))].map(company => (
                        <MenuItem key={company} value={company}>{company}</MenuItem>
                    ))
                    }
                    
                </TextField>
                {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                        <JobCard 
                            key={job.id} 
                            id={job.id} 
                            country={job.country} 
                            title={job.title} 
                            description={job.description} 
                            company={job.company_name}
                            details={job.details}
                        />
                    ))
                ) : (
                    <p>No jobs found.</p>
                )}
            </Container>
        </div>
    );
}
