
import MainPageWrapper from "../components/MainPageWrapper";
import { ResponsiveAppBar } from "../components/ResponsiveAppBar";
import '../styles/home.css'



export function Home(){
    return <div class="home">
        <ResponsiveAppBar/>
        <MainPageWrapper/>
    </div>
}