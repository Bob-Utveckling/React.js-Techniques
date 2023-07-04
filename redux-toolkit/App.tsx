import * as React from 'react';
import {useState, useEffect} from 'react';
import movingPersons from '../assets/movingPersons.png';
import aleLogo from '../assets/AleLogo.png';

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
import DropdownClusters from './DropdownClustersList';

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
            <div className="alignRight">
              { userRole=="Admin" && <button className='button4' onClick={registerUser}>Registrera Personal</button> }
              &nbsp;
              { userRole=="Admin" && <button className='button4' onClick={showLog}>Aktivitetslogg</button> }
              &nbsp;
              <button className='button4' onClick={logOut}>Logga ut</button>
            </div>
          </div>
          }
          <ToastContainer />

          { userIsLoggedIn==true &&
            userRole=="Admin" &&
            <div id="AdminContent">
              <p>Arbeta med schemat enligt följande detaljer:</p>
              <Container style={{backgroundColor:'#e4dede'}}>
                  <Row>
    
                  <Col sm={2}>
                        <img src={movingPersons} className="App-logo" alt="logo" />
                  </Col>
    
                  <Col sm={2}>                
                      Antal dagar:<br/>
                      <input style={{width:'50px',height:'50px', border:'1px solid orange', fontSize:20}}
                      type="number" value={numDays}
                      onChange={
                          (e)=>
                              {   console.log("numDays onChange gave: " + e.target.value);
                                  dispatch(setNumberOfDays(e.target.value))
                              }
                      }
                      />
                  </Col>      
    
                  <Col sm={3}>
                    Start datum:
                    <DatePicker 
                      wrapperClassName="datePicker"
                      locale="sv" 
                      selected={startDate} 
                      onChange={date => { 
                          console.log("do date change! => " + date);
                          date && dispatch(setStartDate(date));
                        }
                      }
                    />
                  </Col>
    
                  <Col style={{margin:'5px'}}  lg={4}>    
                    Vilka enheter/område:
                    <ContentEditable
                      /*innerRef={this.workAreaNamesContentEditable}*/
                      style={{border: '1px solid orange', backgroundColor:'white', padding:'10px' }} 
                      html={clusterVerksamheter_och_omrade}
                      disabled={false}
                      onChange={
                        (e:any)=> {
                          console.log("call handleClusterVerksamheter_och_omradeChange...");
                          handleClusterVerksamheter_och_omradeChange(e);
                        }
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <button className="button1" 
                      onClick={
                        ()=> {
                          generateMallButtonClicked()
                            .catch(err=>(console.log("BL err in calling generateMallButtonClicked in App.tsx file")))
                        }
                      }>Skapa</button>
                  </Col>
                </Row>
                </Container>
                <Container style={{backgroundColor:'#fff8c5 '}}>
                <Row>
                  <Col>
                  Du kan även välja och redigera en utkast eller publicering som du tidigare sparat:
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <br/>
                    <DropdownDraftPublishList publishStatus="draft" listOfDraftRecords={listOfDraftRecords} onChange={handleDraftOrPublishListChange}/>
                    <br/>eller
                    <br/>
                    <DropdownDraftPublishList publishStatus="publish" listOfPublishRecords={listOfPublishRecords} onChange={handleDraftOrPublishListChange}/>
                  </Col>
                </Row>
              </Container>  
    
            <div data-id="allEditables">  
                {showSaveDraftPublishButtons ?
                  <div className="showDraftPublishButtonSection">
                    <button className="button2" onClick={()=>saveAsButtonClicked('draft')}>Spara som utkast</button>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <button className="button2" onClick={()=>saveAsButtonClicked('publish')}>Publicera</button>
                    <br></br>Schemat nedan har id: {id}
                  </div>
                : <div></div> }

              {renderedTemplate}
            </div>    
          </div>
          }



          { userIsLoggedIn==true &&
            userRole=="User" &&
            <div id="UserContent">
              <p></p>
              <DropdownDraftPublishList publishStatus="publish" listOfPublishRecords={listOfPublishRecords} onChange={handleDraftOrPublishListChange}/>
              {calendarRender}

              {showSaveButtonForUser ?
                  <div className="showSaveButtonSectionForUser">
                    <button className="button3" onClick={()=>saveAsButtonClicked('publish')}>Spara dina ändringar</button>
                    <br></br>Schemat nedan har id: {id}
                  </div>
                : <div></div> }


              <div data-id="allEditables">  
              {renderedTemplate}
            </div>
            </div>
          }

          { userIsLoggedIn==false &&
          <div id="YouMustLoginContent" className="centerIt">
            <div  className="LoginPanel">
              <img src={aleLogo} className="AleLogo" alt="Ale Logo" />
              <hr style={{width:'100px'}}></hr>
              <label>Din Ale e-postadress: </label>
              <br/>
              <input type="text" onChange={e => setUserEmail(e.target.value)} 
                onKeyDown={event=>event.key == 'Enter' && auth()}
              />
              <br/>
              <label>Lösenord: </label>
              <br/>
              <input type="password" onChange={e => setUserPassword(e.target.value)}
                onKeyDown={event=>event.key == 'Enter' && auth()}
              />
              <br/>
              <label>Välj klustret du arbetar på:</label>
              <br/>
              <DropdownClusters onChange={handleClusterListChange} />

              <button className="loginButton" onClick={auth}>Logga in</button>              
              <p style={{fontSize:"16px"}}>
                Använd: admin_demo@ale.se<br/>
                 Lösenord: admin_demo<br/>
                 <br/> Eller som personal: <br/>
                 tom@ale.se <br></br>
                 Lösenord: test <br/><br/>
                 (Välj första val för kulstret)
              </p>
            </div>
            </div>
          }


    </div>
  )
}

export default App;