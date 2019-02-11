import React from 'react';
import '../styles/Table.css';

// Global variables for the whole station timetable
// and station names dictionary
var data = [];
var stationNames = {};

// Sorting function for timetables
// Params: a and b are objects from data array.
function compare(a,b) {
    if (a.time < b.time)
      return -1;
    if (a.time > b.time)
      return 1;
    return 0;
  }

// Function for parsing API-data to train objects which are then saved to data array.
// Params: trainlist is data from axios network request, currentStation is from search bar
// and mov is coming from App component and it tells do we want to see arrival or departure trains.
const iterateTrains = (trainlist, currentStation, mov) => {
    data = [];
    var moving = (mov ==="Saapuu") ? "ARRIVAL" : "DEPARTURE"
    var currentTime = new Date();

    var i, j;
    for(i=0; i < trainlist.length;i++){
        if(trainlist[i].trainCategory === "Long-distance" || trainlist[i].trainCategory === "Commuter"){
            for(j=0;j<trainlist[i].timeTableRows.length;j++){
                var scheduledTime = new Date(trainlist[i].timeTableRows[j].scheduledTime);
                if(trainlist[i].timeTableRows[j].stationShortCode === stationNames[currentStation] && 
                  trainlist[i].timeTableRows[j].type === moving && 
                  currentTime < scheduledTime){
                    var trainObj = {};
                    if(trainlist[i].trainCategory === "Long-distance"){
                        trainObj['number'] = trainlist[i].trainType + " " + trainlist[i].trainNumber;
                    }
                    else{
                        trainObj['number'] = trainlist[i].commuterLineID + " " + trainlist[i].trainNumber;
                    }
                    trainObj['type'] = trainlist[i].trainType;
                    trainObj['startingStation'] = getStationFullName(trainlist[i].timeTableRows[0].stationShortCode);
                    trainObj['endingStation'] = getStationFullName(trainlist[i].timeTableRows[trainlist[i].timeTableRows.length-1].stationShortCode);
                    trainObj['time'] = scheduledTime;   
                    trainObj['cancelled'] = trainlist[i].timeTableRows[j].cancelled;
                    trainObj['estimated'] = trainlist[i].timeTableRows[j].liveEstimateTime === undefined ? "" : new Date(trainlist[i].timeTableRows[j].liveEstimateTime);
                    data.push(trainObj);
                }
            }
        }
    }
}

// Function which returns matching station name for the sort code.
// Params: short is short code from trainlist data.
const getStationFullName = (short) =>{
    for(var key in stationNames){
        if(stationNames[key] === short){
            return key;
        }
    }
}

// Main element for returning the station timetables.
// Params: props is properties coming from App component.
const TrainList = (props) => {
    stationNames = props.stationNames
    iterateTrains(props.trains, props.currentStation, props.mov);
    data.sort(compare);
    const listItems = data.map((d) => 
            <tr>
                <td>{d.number}</td>
                <td>{d.startingStation}</td>
                <td>{d.endingStation}</td>
                <td>
                    <table>
                        <tbody>
                            <tr className="estimated">{(d.estimated > d.time ? d.estimated.getHours()+":"+(d.estimated.getMinutes()<10 ? '0':'') + d.estimated.getMinutes() : "")}</tr>
                            <tr>{(d.cancelled ==="true" ? 'cancelled': d.time.getHours()+":"+(d.time.getMinutes()<10 ? '0':'') + d.time.getMinutes())}</tr>
                        </tbody>
                    </table>
                </td>
            </tr>
    );
    return (
        <table className="tableOfContents">
            <tbody>  
                <tr>  
                    <th>Juna</th>
                    <th>Lähtöasema</th>
                    <th>Pääteasema</th>
                    <th>{props.mov}</th>
                </tr> 
                    {listItems}
            </tbody> 
        </table>
    );
}

export default TrainList;