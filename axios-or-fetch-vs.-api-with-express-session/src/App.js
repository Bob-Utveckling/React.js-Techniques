import logo from './logo.svg';
import './App.css';
import { useCookies } from 'react-cookie'; //cookie setting can be done by this package
import axios from 'axios';

function App() {
  const [cookies, setCookie] = useCookies(['name']) //how to set a cookie: "name"
  
  const loginExample1 = async(userEmail,userPassword) => {
    console.log("got: " + userEmail + ", " + userPassword)
    const body = {email: userEmail, password: userPassword, clusterId: 1};
    console.log("send body: " + JSON.stringify(body))
    fetch('http://localhost:28416/api/login', {
    //mode: 'no-cors',
    credentials: "include",
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
    }).then (response => response.json()).then(data=>console.log(data));
    //const content = await rawResponse.json();
    //console.log(JSON.stringify(content));
    //console.log("content");
  }

  function getResource1() {
    fetch("http://localhost:28416/api/record/172", {
      credentials: "include"
    })
      .then(response => response.json())
      .then(data => console.log(data))
  }

  const loginExample = async(userEmail,userPassword) => {
    console.log("got: " + userEmail + ", " + userPassword)
    //axios.defaults.withCredentials = true; //an alternative
    //axios.defaults.baseURL="http://localhost:28416" //another feature in axios
    try {
      const res = await axios
        .post("http://localhost:28416/api/login",
        {email: userEmail, password: userPassword, clusterId: 1},
        { 
          withCredentials: true,
          'Access-Control-Allow-Origin': 'http://localhost:28416',
          /*
          can try these also:
          {headers: {
          withCredentials: true,
          credentials: 'include',
          'Access-Control-Allow-Origin': 'http://localhost:28416',
          //or this: 'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
          }
          */
        }
        );
      console.log("got from server: " + JSON.stringify(res.data))
      if (res.data.message == "User OK") {
        //welcome the user
      }
    } catch (e) {
      console.log(e)
    }
  }

  function getResource() {
    axios
    .get("http://localhost:28416/api/record/172", {
        withCredentials: true,
      })
    .then((response) => {
      console.log("return for access to http://localhost:28416/api/record/172:\n "
       + JSON.stringify(response.data))      
    }).catch(err=>{console.log("err: " + err)})
  }

  /*
  function setCookieSessionId(getSessionId) {
    //setCookie('sessionId', getSessionId)
    //setCookie('sessionID', getSessionId)
    console.log("- sessionId recieved is: " + getSessionId)
  } */

  function onChange(newName) {
    setCookie('name', newName);
    alert("set name to " + newName + ", can even set a cookie, or start a fetch from API")
  }

  return (

    <div className="App">
      <header className="App-header">
        <p>In this app, you can contact the API that listens on a given port<br></br>        
        for a log-in and then an access to a resource that is password protected.<br></br>
        You access the app either through axios or fetch. Credentials are needed to <br></br>
        be sent since you tell the API what session id is in the header cookie that<br></br>
        identifies this sesion.<br></br>
        Disable/Enable the "loginExample" function and the "getResource" function <br></br>
        by removing/adding a 1 at the end of the function to switch. </p>
        <button onClick={()=>onChange("Bamshad")}>Click me to set name to Bamshad</button>
        {cookies.name && <h1>Hello {cookies.name}</h1>}
        
        <button onClick={()=>loginExample("admin_demo@ale.se","admin_demo")}>Log in with Admin email & password by contacting API</button>
        
        <p></p>
        <button onClick={()=> getResource()}>I want to access an admin resource (1) (only if API says you are logged in)</button>
        <img src={logo} className="App-logo" alt="logo" />

      </header>
    </div>
  );
}

export default App;
