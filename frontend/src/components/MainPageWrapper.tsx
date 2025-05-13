import '../styles/mainpagewrapper.css'
import MapComponent from "./MapComponent";
import JobContainer from "./JobContainer";



export default function MainPageWrapper(){

    return <div class="main-wrap">
         <MapComponent/>
        <JobContainer/>
    </div>
}