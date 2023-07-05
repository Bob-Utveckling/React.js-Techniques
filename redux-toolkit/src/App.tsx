import * as React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
//import { configureStore } from '@reduxjs/toolkit';
import { ThunkDispatch } from '@reduxjs/toolkit';
import configData from "./config.json"

import { setNumberOfDays, setStartDate, updateClusterId,
          updateClusterTitle, updateClusterVerksamheterOchOmrade
       } from './initialDetailsSlice';
import { setDataModel, saveDataModelAsDraftOrPublish, loadTheRecordIntoScreen } from './dataModelSlice';


function App() {
  //const dispatch = useDispatch<AppDispatch>();
  //const dispatch = useDispatch();
  const dispatch = useDispatch<ThunkDispatch<any,any,any>>();

  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("NA");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userFirstName, setUserFirstName] = useState("");

  let [renderedTemplate, setRenderedTemplate] = useState(<div></div>)
  let numDays = useSelector((state:any) => state.initialDetails.numberOfDays);
  let startDate = useSelector((state:any)=>state.initialDetails.startDate)
  //let clusterName = "test. this wil be a useSelector of the state value";
  let clusterId = useSelector((state:any) => state.initialDetails.clusterId);
  let clusterTitle = useSelector((state:any) => state.initialDetails.clusterTitle);
  let clusterVerksamheter_och_omrade = useSelector((state:any) => state.initialDetails.clusterVerksamheter_och_omrade);
  
  let dataModel = useSelector((state:any)=>state.dataModel.dataModel);
  let id = useSelector((state:any)=>state.dataModel.id);
  let publishStatus = useSelector((state:any)=>state.dataModel.publishStatus);
  
  
  /*const options = () => [
    {label:'item 1', value: 'item 1 value'},
    {label:'item 2', value: 'item 2 value'},
    {label:'item 3', value: 'item 3 value'}
  ]*/
  /*setMarkedDates([
    '23-06-2023',
    '24-06-2023',
    '25-06-2023'
  ])*/
  let marked = ([
    '23-06-2023',
    '24-06-2023',
    '25-06-2023'
  ])

  const auth = async() => {
    console.log("- Authorize " + userEmail + "...")
    try {
      const res = await axios
          .post(configData.API_URL+"login",
          { email: userEmail,
             password: userPassword,
                clusterId: clusterId },
          { withCredentials: true }

       );
       const response = res.data;
       //alert("response: " + JSON.stringify(response))
       if (response.message == "User not OK") {
         console.log("Fel med inloggning: " + response.description)
       } else if (response.message == "User OK") {
                /*example response:
                message:	"User OK"
                sessionId:	"80457f3e-d9f9-4725-9a04-6d0eccd8d28f"
                firstName:	"Tom"
                role:	"User"*/
            console.log("sessionID: " + response.sessionId);
            setUserIsLoggedIn(true);
            setUserRole(response.role)
            setUserFirstName(response.firstName)
   
       }
      //alert (JSON.stringify(res.data));
      /*if (res.data.screen !== undefined) {
        setScreen(res.data.screen);
      }*/
    } catch (e) {
      console.log("-There was an error in axios's retrieving: "+e);
    }
  }

return (
      <div className="App">
        
        {/*<button onClick={()=>alert(dataModel.dates)}>dataModel.dates</button>
        <button onClick={showDataModel}>Show dataModel</button>
        <button onClick={showSessionID}>showSessionID</button> 
        */}
        { userIsLoggedIn &&
        <div className={"topRibbon"+userRole}>
          <div className="alignLeft">
            Välkommen {userFirstName}! 
          </div>
        </div>
        }

        { userIsLoggedIn==true &&
          userRole=="Admin" &&
          <div id="AdminContent">
            <p>Arbeta med schemat enligt följande detaljer:</p>
  
            {renderedTemplate}
          </div>    
        }

        { userIsLoggedIn==true &&
          userRole=="User" &&
          <div id="UserContent">
            <p></p>

            <div data-id="allEditables">  
            {renderedTemplate}
          </div>
          </div>
        }

 


  </div>
)
}

export default App;