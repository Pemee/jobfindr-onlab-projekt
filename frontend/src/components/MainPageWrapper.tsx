import '../styles/mainpagewrapper.css'
import MapComponent from "./MapComponent";
import JobContainer from "./JobContainer";



/*interface Post {
    id: number;
    title: string;
    description: string;
    country: string;
    company_name: string;
    details: string;
}*/
export default function MainPageWrapper(){
    /*const [jobs, setJobs] = useState<Post[]>([]);
    const updateJobs = (newJobs: Post[]) => {
        setJobs(newJobs);<MapComponent/>
    };*/

    return <div class="main-wrap">
         
        <JobContainer/>
    </div>
}