import {
    APIProvider,
    AdvancedMarker,
    InfoWindow,
    Map
 } from  "@vis.gl/react-google-maps";
 import { useNavigate } from 'react-router-dom'
import '../styles/mapcomponent.css'
import { useCallback, useEffect, useState } from "preact/hooks";
import PostType from "../PostType";
import { Button } from "@mui/material";
interface CountryCoordinates{
    lat: number;
    lon: number;
    error?: String | null;
}
interface PostWithCoords{
    postData: PostType,
    coords: CountryCoordinates | undefined
}

export default function MapComponent(){
    const defaultPosition = {lat : 49.00052102729441, lng: 21.72051248500651};
    const [jobs, setJobs] = useState<PostType[]>();
    const [postcoords, setPostCoords] = useState<PostWithCoords[]>();
    const [countries, setCountries] = useState<String[]>([]);
    const [coordinates, setCoordinates] = useState<(CountryCoordinates | undefined)[]>([]);
    const [selectedMarker, setSelectedMarker] = useState<google.maps.LatLng | null>(null);
    const [selectedCoords, setSelectedCoords] = useState<CountryCoordinates | null>(null);
    const navigate = useNavigate();
    const handleMarkerClick = useCallback((coord: CountryCoordinates | undefined) => {
        
        if(coord === undefined){
            setSelectedMarker(null) 
        }
        else{
            const mylatlon = new google.maps.LatLng(coord.lat, coord.lon);
            setSelectedMarker(mylatlon);
            setSelectedCoords(coord);
        }
    }, []);

    const handleClose = useCallback(() => {
        setSelectedMarker(null);
    }, []);
    const handlePostClick = (id: number, postData: PostType) => {
        navigate(`/posts/${id}`, { state: { post: postData } });
    };
    
    async function getAllJobs(): Promise<PostType[]> {
        try {
            const response = await fetch("http://localhost:8081/post/getAllPosts");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data: PostType[] = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching posts:", error);
            return [];
        }
    }
    useEffect(() => {
            async function fetchJobs() {
                const jobs = await getAllJobs();
                setJobs(jobs);
            }
            fetchJobs();
        }, []);
    useEffect(() => {
            function fetchCountries() {
                if(jobs !== undefined){
                    const countries: String[] = jobs.map(job => job.country)
                    setCountries(countries);
                }
            }
            fetchCountries();
        }, [jobs]);

    const getCoordinates = async (countries: String[]): Promise<(CountryCoordinates | undefined)[]> => {
        const requests = countries.map(async (country) => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?country=${country}&format=json`
                );
                const data = await response.json();
    
                if (data.length > 0) {
                    return { lat: data[0].lat, lon: data[0].lon, error:null };
                }
            } catch (error) {
                return { lat:0,lon:0, error: "Request failed" };
            }
        });
    
       return Promise.all(requests);
        
    };
    useEffect(() => {
        const fetchCoordinates = async () => {
          const result = await getCoordinates(countries);
          setCoordinates(result);
        };

        fetchCoordinates();

      },[countries]);
      useEffect(() => {
        if (jobs && coordinates) {
          const postWithCoords = jobs.map((post, index) => {
            const coords = coordinates[index];
            return { postData: post, coords: coords };
          });
          setPostCoords(postWithCoords);
        }
      }, [jobs, coordinates]);
    return <div class="main-container">
        <APIProvider apiKey="AIzaSyAxK1oaQWDcSYXZ-IWKGYIe94syW_--wzI">
            <div class="map-container">
                <Map 
                mapId={"92afac3d098e2f34"} 
                scrollwheel={true} 
                gestureHandling="greedy"
                defaultZoom={4}
                defaultCenter={defaultPosition}
                >
                    {coordinates
                            .filter((coord) => coord !== undefined && coord.lat !== 0 && coord.lon !== 0)
                            .map((coord, index) => {
                                let myLatLng;
                                coord !== undefined ? myLatLng= new google.maps.LatLng(coord.lat, coord.lon): myLatLng;
                                return (
                                    <AdvancedMarker
                                        key={index}
                                        position={myLatLng}
                                        onClick={() => handleMarkerClick(coord)}
                                    />
                                );
                            })}
                        {selectedMarker && (
                            <InfoWindow
                                position={selectedMarker}
                                onClose={handleClose}
                            >
                            {
                                postcoords?.filter((pc) => pc?.coords === selectedCoords).map((postcoords)=>{
                                    return( <div>
                                        <h2>{postcoords.postData.title}</h2>
                                       <div>{postcoords.postData.description}</div>
                                       <Button onClick={()=>{handlePostClick(postcoords?.postData?.id,postcoords?.postData)}}>See more</Button>
                                    </div>);
                                })
                            }
                            </InfoWindow>
                        )}
                </Map>
            </div>
        </APIProvider>
    </div>
}