import { JobContainer } from './JobContainer';
import '../styles/jobwrapper.css';

export function JobWrapper(){
    return <div class="wrapper">
        <h1>Job Listings</h1>
        <JobContainer/>
    </div>
}