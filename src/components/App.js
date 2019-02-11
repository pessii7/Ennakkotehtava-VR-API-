import React from 'react';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SearchBar from './SearchBar';
import TrainList from './TrainList';
import '../styles/Headline.css';
import '../styles/ToAll.css';
import "react-tabs/style/react-tabs.css";

// Global dictionay to bind station names to shortcodes 
var stationNames = {}

// Function for saving stations data from API to dictionary
// Params: resp is station data from axios.
function save(resp){
    var i;
    for(i=0;i<resp.length;i++ ){
        var split = resp[i].stationName.split(" ")
        if(split[1] === "asema"){
            stationNames[split[0]]=resp[i].stationShortCode;
        }
        else{
            stationNames[resp[i].stationName]=resp[i].stationShortCode;
        }
        
    }
}

// Class-based component for rendering and fetching data from VR-API. 
// Third-party axios is used to handle network requests.
class App extends React.Component {
    state = {trains: [], currentStation: ""};

    // The actual timetable request. 
    // Params: term is word from search bar.
    onSearchSubmit = async (term) =>{
        const response = await axios
        .get("https://rata.digitraffic.fi/api/v1/live-trains/station/"+stationNames[term]+"?minutes_before_departure=240&minutes_after_departure=240&minutes_before_arrival=240&minutes_after_arrival=240");

        this.setState({trains: response.data});
        this.setState({currentStation: term});
    }

    componentDidMount(){
        axios.get('https://rata.digitraffic.fi/api/v1/metadata/stations').then(function (result) {
            save(result.data);
        });
    }

    // Rendering the green headline box, search bar, tabs and eventually the timetables.
    // Tabs elements are from https://github.com/reactjs/react-tabs 
    render(){
        return( 
            <div className="mainDiv">
                <div className="greenHeadline">
                    <p className="headlineText">Aseman junatiedot</p>
                </div>
                <SearchBar onSubmit={this.onSearchSubmit}/>
                <Tabs className="tabs">
                    <TabList>
                        <Tab>Saapuvat</Tab>
                        <Tab>Lähtevät</Tab>
                    </TabList>
                    <TabPanel>
                        <TrainList trains={this.state.trains} currentStation={this.state.currentStation} stationNames={stationNames} mov={"Saapuu"}/>
                    </TabPanel>
                    <TabPanel>
                        <TrainList trains={this.state.trains} currentStation={this.state.currentStation} stationNames={stationNames} mov={"Lähtee"}/>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}

export default App;