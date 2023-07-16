import * as React from 'react';
import {useState, useEffect} from 'react';
import movingPersons from '../assets/movingPersons.png';


import './App.css';
import { Container, Row, Col } from 'react-grid-system';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { makeArrayOfWorkAreaNamesFromClusterName, makeCleanWorkAreaIdsFromClusterName } from '../service/workAreaNamesService';
import { makeDateUserFriendly, createARangeOfDates } from '../service/dateService';
import axios from 'axios';
import { PrepareDataModelAsAReadyTemplateForAllDatesGiven } from '../service/dataModelService';
import { useSelector, useDispatch } from 'react-redux';
//import { configureStore } from '@reduxjs/toolkit';
import { ThunkDispatch } from '@reduxjs/toolkit';

import { Dropdown as DropdownDraftPublishList } from './DropdownDraftPublishList';
import Dropdown1 from './DropdownListComponent1';

import { setNumberOfDays, setStartDate, updateClusterId,
          updateClusterTitle, updateClusterVerksamheterOchOmrade
       } from '../redux/initialDetailsSlice';
import { setDataModel, saveDataModelAsDraftOrPublish, loadTheRecordIntoScreen } from '../redux/dataModelSlice';
import { ShowTemplate } from './ShowTemplate';
import ContentEditable from 'react-contenteditable';
import configData from "../service/config.json"
//import sanitizeHtml from "sanitize-html"
import moment from 'moment';
import Calendar from 'react-calendar';
import { RenderCalendar } from './CalendarRender';
//import 'react-calendar/dist/Calendar.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import sv from 'date-fns/locale/sv';
registerLocale('sv',sv)


function App() {
    //const dispatch = useDispatch<AppDispatch>();
    //const dispatch = useDispatch();
    const dispatch = useDispatch<ThunkDispatch<any,any,any>>();

    const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("NA");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userFirstName, setUserFirstName] = useState("");
    const [markedDates, setMarkedDates] = useState(['','','']);

    let [listOfPublishRecords, setListOfPublishRecords] = useState([]);
    let [listOfDraftRecords, setListOfDraftRecords] = useState([]);
    let [calendarRender, setCalendarRender] = 
      useState(<RenderCalendar markedDates={[]}
      />)

    const [showSaveDraftPublishButtons, setShowSaveDraftPublishButtons] = useState(false);
    const [showSaveButtonForUser, setShowSaveButtonForUser] = useState(false);

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


    /*const sanitizeConf = {
      allowedTags: ["b", "i", "em", "strong", "a", "p", "h1"],
      allowedAttributes: { a: ["href"] }
    };*/

    /*React.useEffect(()=> {
      dispatch(fetchContent())
    })*/

    


    function showDataModel() {
      alert("id="+id+", clusterId="+clusterId+", publishStatus="+publishStatus+", " + JSON.stringify(dataModel))
    }
    const handleClusterVerksamheter_och_omradeChange = (event:any) => {
      //update cluster names, update workarea names, workarea ids
      console.log("there was a WorkAreNames change!");
      ////let value = sanitizeHtml(event.target.value, sanitizeConf); 
      let value = event.target.value; 
      //var value = sanitizeHtml(event.target.value); 
      console.log("inner target value sanitized:"+value);
      ////setLocalClusterName(value);
      dispatch(updateClusterVerksamheterOchOmrade(value));
    }



/*    useEffect(()=> {
      work 1
      //errorprone appraoch: userRole=="User" && setCalendarRender(<RenderCalendar markedDates={dataModel.dates} />)
      alert("hello")
      work 2
      axios
        .get(configData.API_URL+"listAllDraftsOrPublishes/publish",
          { withCredentials: true })
        .then((response) => {
          console.log("- how many for list of all 'publish':"+ response.data.length)
          setListOfPublishRecords(response.data)
      }).catch(err=> console.log("- axios get listOfAllRecords error: " + err))

      axios
      .get(configData.API_URL+"listAllDraftsOrPublishes/draft",
        { withCredentials: true })
      .then((response) => {
        console.log("- how many for list of all 'draft':"+ response.data.length)
        setListOfDraftRecords(response.data)
    }).catch(err=> console.log("- axios get listOfAllRecords error: " + err))
  },[dataModel.dates])
*/
  const changeCalendarHighlightedDays = (theDates:any) => {
    let mark = [
      '27-06-2023',
      '28-06-2023',
      '29-06-2023'
    ]
  }
  
  function handleListChange(e:any) {
    //set the cluster id for the entry
    console.log("set details according to: " + JSON.stringify(e))
    dispatch(updateClusterVerksamheterOchOmrade(e.verksamheter_och_omrade))
    dispatch(updateClusterId(e.value))
  }

  return (
        <div className="App">
          
          <ToastContainer />

          <div id="YouMustLoginContent" className="centerIt">
            <div  className="LoginPanel">
              <label>Select from the dropdown menu:</label>
              <br/>
              <Dropdown1 onChange={handleListChange} />

            </div>
            </div>


    </div>
  )
}

export default App;