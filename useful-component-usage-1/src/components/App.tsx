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
import Dropdown1 from './DropdownClustersList';

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

    function registerUser(e:any) {
      alert ("Besök: "+configData.API_URL+"register")
    }

    function showLog(e:any) {
      axios
        .get(configData.API_URL+"log", {
        withCredentials: true
        })
        .then((response) => {
          alert(JSON.stringify(response.data))
        }).catch (err=> {
          console.log("error in showLog: " + err)
        })
    }

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
           toast.warn("Fel med inloggning: " + response.description, {
             position: toast.POSITION.TOP_RIGHT
           })
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
              updateTheDraftPublishDropdowns()
              //alert ("response.lastPublishId: " + JSON.stringify(response.lastPublishId))
              response.role=="User" && loadScheduleIntoScreenGivenId(response.lastPublishId)
              //alert ("response.lastPublishMarkedDates: " + JSON.stringify(response.lastPublishMarkedDates))
              response.role=="User" && setCalendarRender(<RenderCalendar markedDates={response.lastPublishMarkedDates} />)
              response.role=="User" && setShowSaveButtonForUser(true);
              toast.success("Välkommen " +response.firstName+" till Övergripande Bemanning!", {
                position: toast.POSITION.TOP_RIGHT
              })
    
         }
        //alert (JSON.stringify(res.data));
        /*if (res.data.screen !== undefined) {
          setScreen(res.data.screen);
        }*/
      } catch (e) {
        console.log("-There was an error in axios's retrieving: "+e);
      }
    }


    function loadScheduleIntoScreenGivenId(id: number) {
      console.log("- loadScheduleIntoScreenGivenId " + id)
      
      axios
      .get(configData.API_URL+"record/"+id, {
        withCredentials: true
        //'Access-Control-Allow-Origin': 'http://localhost:28416',
        
      })
      /*fetch(configData.API_URL+"record/"+id, {
        credentials: "include",
        headers: {'Content-Type': 'application/json'},
      })*/
      .then((response) => {
        console.log("Render this in screen: " + JSON.stringify(response))
        dispatch(loadTheRecordIntoScreen(response.data))
        setRenderedTemplate(<ShowTemplate/>)
        userRole=="Admin" && setShowSaveDraftPublishButtons(true);
        userRole=="User" && setShowSaveButtonForUser(true)
      }).catch(err=> {
        toast.warn("Fel med insamling av data: " + err, {
          position: toast.POSITION.TOP_RIGHT
        })

      })
    }

    function handleDraftOrPublishListChange(event:any) {
      console.log("- handle list change")
      console.log("- id for item to load: " + event.target.value)
      //alert("handleDraftOrPublishListChange: " + event.target.value)
      //item.id+","+item.firstDate+","+item.numberOfDays+","+item.lastDate
      //175,22-06-2023,1,22-06-2023
      const recordId = event.target.value.split(",")[0]
      const firstDate = event.target.value.split(",")[1]
      const numDays = event.target.value.split(",")[2]
      const lastDate = event.target.value.split(",")[3]
      let markedDates = createARangeOfDates(firstDate,numDays)
      if (!isNaN(recordId)) {
        //alert("load")
        loadScheduleIntoScreenGivenId(recordId)
        //alert("record id: " + recordId)
        setCalendarRender(<RenderCalendar markedDates={markedDates} />)
      }
    }

    /*const sanitizeConf = {
      allowedTags: ["b", "i", "em", "strong", "a", "p", "h1"],
      allowedAttributes: { a: ["href"] }
    };*/

    /*React.useEffect(()=> {
      dispatch(fetchContent())
    })*/

    function updateTheDraftPublishDropdowns() {
      //alert("now update the publish/draft lists...")
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
    }

    async function saveAsButtonClicked(type:any) {
      console.log("-save as "+type+" button clicked. dataModel to submit:\n\n" + JSON.stringify(dataModel))
      dispatch(saveDataModelAsDraftOrPublish({sendThisStatus:type,id:id,clusterId:clusterId,dataModel:dataModel})).then(result=>{
        //console.log("details, apparently from redux async thunk call to do a dispatch and the status of result of the case: " + JSON.stringify(result))//gives details like: "type":"content/saveDataModelAsDraft/fulfilled", "payload":{"saveStatus":"saved","id":49,...,"generatedDate":"2023-05-31T14:27:27.114Z"},"meta":{"arg":{"id":49,...,"clusterName":"Surte höjd, ... ..."requestId":"eI-2aHvU3V3xImT9AWlbB","requestStatus":"fulfilled"}}
        //toast.success("Sparat som utkast på datum: '" + result.payload.generatedDate + "' med id: " + result.payload.id+"", {
        const typ = type=="publish"?"publicering":type=="draft"?"utkast":"annat"
        if(result.payload.saveStatus=="resaved") {
          toast.success("Sparade om som "+typ+" med id: " + id+"", {
            position: toast.POSITION.TOP_RIGHT
          })
          updateTheDraftPublishDropdowns();
        } else if (result.payload.saveStatus=="saved") {
          toast.success("Sparat som "+typ+" på datum: '" + result.payload.modelStampViaGeneratedDate + "' med id: " + id+"", {
            position: toast.POSITION.TOP_RIGHT
          })
          updateTheDraftPublishDropdowns();
        } else if (result.payload.saveStatus=="did not save") {
            toast.warn("Fel med sparandet! Sparade inte!'", {
              position: toast.POSITION.TOP_RIGHT
            })
        } else if (result.payload.message=="Access Denied") {
            toast.warn("Fel! Kan inte spara på grund av rättigheter.", {
              position: toast.POSITION.TOP_RIGHT
          })
        }
        //is not updtodate yet: alert("\n\nDATA MODEL: "+JSON.stringify(dataModel))
      }).catch(e=>{console.log("saveAsDraftButtonClicked error: " + e);
          toast.warn("Fel med sparandet: '" + e, {
            position: toast.POSITION.TOP_RIGHT
          })
      })
    }

    //function generateMallButtonClicked() {
    async function generateMallButtonClicked() {
      //get according to store state, set a render from here
      console.log("* button clicked. how many days: " + numDays);
      console.log("* start date: " + startDate);
      console.log("* clusterVerksamheter_och_omrade: " + clusterVerksamheter_och_omrade)
      console.log("* workAreaNames: " + makeArrayOfWorkAreaNamesFromClusterName(clusterVerksamheter_och_omrade));
      console.log("* workAreaIds: " + makeCleanWorkAreaIdsFromClusterName(clusterVerksamheter_och_omrade));
      //const response = await axios.get(`https://bamshad.se/api/generateNew`);
      axios
        .get(configData.API_URL+"generateNew", {
        withCredentials: true
        })
        .then((response) => {
          console.log("I got response from web api. how to ensure async works with the rest of the function probably depends on then then then. response:\n\n" + JSON.stringify(response));
          //dataModel = response.data.dataModel; //note that the dataModel setting is done directly instead of getting from state here, like next line where dispatch setting the data model
          //dispatch(setDataModel(response.data))
          if (numDays>-1) {
            //let preparedDataModel = PrepareDataModelAsAReadyTemplateForAllDatesGiven({
           // alert("numDays before dispatching: " + numDays)

            dispatch(setDataModel(PrepareDataModelAsAReadyTemplateForAllDatesGiven({
                  id: response.data.id,
                  //clusterName: clusterVerksamheter_och_omrade,
                  //clusterVerksamheter_och_omrade: clusterVerksamheter_och_omrade,
                  clusterId: clusterId,
                  clusterTitle: clusterTitle,
                  numberOfDays:numDays,
                  startDate:startDate,
                  workAreaIds: makeCleanWorkAreaIdsFromClusterName(clusterVerksamheter_och_omrade),
                  dataModelFromAPI:response.data.dataModel,
                })
            ))
            //console.log("THE PREPARED DATAMODEL:\n"+ JSON.stringify(preparedDataModel));
            //alert("show template")
            setRenderedTemplate(<ShowTemplate/>)
            
            setShowSaveDraftPublishButtons(true);

              if (numDays==1) {
                toast.success("Mall skapas för '" + numDays + "' dag med start datum: " + makeDateUserFriendly(startDate), {
                  position: toast.POSITION.TOP_RIGHT
                }) 
              } else if (numDays==0) {
                toast.success("Mall skapas för '" + numDays + "' dagar", {
                  position: toast.POSITION.TOP_RIGHT
                }) 
              } else if (numDays>1) {
                toast.success("Mall skapas för '" + numDays + "' dagar med start datum: " + makeDateUserFriendly(startDate), {
                  position: toast.POSITION.TOP_RIGHT
                }) 
              } 

          }
        }).catch((err) => {console.log(err)
              toast.warn("Något gick fel: " + err.message, {
                position: toast.POSITION.TOP_RIGHT
              }) 
              setShowSaveDraftPublishButtons(false);

        })
       if (numDays<0) {
          toast.warn("Negativa tal kan inte användas för dagar", {
            position: toast.POSITION.TOP_RIGHT
          })
        }
    }
  
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

    const showSessionID = (event:any) => {
      console.log("- fetch sessionID...")
      fetch(configData.API_URL+"sessionID", {
        //mode: 'no-cors',
        credentials: "include",
        method: 'POST',
        body: JSON.stringify({test:"test"}),
        headers: {'Content-Type': 'application/json'},
        }).then (response => response.json()).then(data=>console.log(data));
    }

    const logOut = () => {
      axios
      .get(configData.API_URL+"logout", {
        withCredentials: true
        //'Access-Control-Allow-Origin': 'http://localhost:28416',       
      }).then(response=> {
        console.log("- Logged out " + response.data.sessionID)
        setUserIsLoggedIn(false);
        setUserRole("")
        dispatch(setDataModel({preparedTemplateWithAllDays:{}}))
        setShowSaveDraftPublishButtons(false)
        setShowSaveButtonForUser(false)
        setListOfPublishRecords([])
        setListOfDraftRecords([])
        setCalendarRender(<RenderCalendar markedDates={[]} />)
        dispatch(setNumberOfDays(0))
        dispatch(updateClusterId(0))
        dispatch(updateClusterTitle(""))
        dispatch(updateClusterVerksamheterOchOmrade(""))
        
      })
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
              <label>Select from the dropdown menu:</label>
              <br/>
              <Dropdown1 onChange={handleListChange} />

            </div>
            </div>
          }


    </div>
  )
}

export default App;