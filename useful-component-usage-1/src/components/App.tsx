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
    const [markedDates, setMarkedDates] = useState(['','','']);
    useState(<RenderCalendar markedDates={[]} />)

    let [theComponent, setTheComponent] = useState(<div></div>)
    let [extraPiece, setExtraPiece] = useState(<div></div>)

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
    //dispatch(updateClusterVerksamheterOchOmrade(e.verksamheter_och_omrade))
    //dispatch(updateClusterId(e.value))
    let res = e;
    console.log("value: " + e.value);
    switch (e.value) {
      case "toaster success":
        toast.success("Welcome to useful component usage!", {
          position: toast.POSITION.TOP_RIGHT
        })
        break;
      case "toaster warn":
        toast.warn("Warning message", {
          position: toast.POSITION.TOP_RIGHT
        })
        break;
      case "calendar":
        setMarkedDates([])
        setTheComponent(<RenderCalendar markedDates={markedDates} />)
        break;
      case "calendar-marked1":
        setTheComponent(<RenderCalendar markedDates={['25-07-2023','26-07-2023','27-07-2023']} />)
        break;
      case "date picker":
          setTheComponent(
              <div style={{display:"flex", alignItems:"center"}}>
                <DatePicker 
                wrapperClassName="datePicker" locale="sv" selected={startDate} 
                onChange={date => { 
                    console.log("do date change! => " + date);
                    date && console.log("dispatch");
                  }
                }
                />
              </div>
            )
        break;
      case "custom date functions":
        setTheComponent(
          <div>custom date functions</div>
        )
        break;
      case "content editables":
        setTheComponent(
          <ContentEditable
          /*innerRef={this.workAreaNamesContentEditable}*/
          style={{border: '1px solid orange', backgroundColor:'white', padding:'10px', width: '300px' }} 
          html={clusterVerksamheter_och_omrade}
          disabled={false}
          onChange={
            (e:any)=> {
              console.log("call function for Change...");
              setExtraPiece(e.target.value);
            }
          }
          />
        )
        break;
        case "container":
          setTheComponent(
            <Container style={{backgroundColor:'#e4dede', width:'500px'}}>
            <Row>
              <Col sm={6}>
                    <img src={movingPersons} className="App-logo" alt="logo" />
              </Col>
              <Col sm={2}>                
                  Col 2<br/>
                  <input style={{width:'50px',height:'50px', border:'1px solid orange', fontSize:20}}
                  type="number" value={numDays}
                  onChange={(e)=>{console.log("numDays onChange gave: " + e.target.value);}}
                  />
              </Col>      
            </Row>
            </Container>
            )
          break;
    
    }
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
              {theComponent}
              <b>{extraPiece}</b>
            </div>


    </div>
  )
}

export default App;