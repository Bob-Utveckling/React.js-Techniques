import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import configData from "../service/config.json"

axios.defaults.withCredentials = true;
//export const saveDataModelAsDraft1 = createAsyncThunk ('content/fetchContent',
export const saveDataModelAsDraftOrPublish = createAsyncThunk ('content/saveDataModelAsDraftOrPublish',
    async (sent:any) => {
    //async () => {
        console.log("- saveDataModelAsDraft request received. POSTing...")
        console.log("- posting to: " + configData.API_URL+"saveAsDraftOrPublish")
        const res = await axios.post(
            configData.API_URL+"saveAsDraftOrPublish/"+sent.sendThisStatus,
            {id:sent.id, clusterId:sent.clusterId, dataModel: JSON.stringify(sent.dataModel)},
            {headers: {
                'Content-Type':'application/json',
            }}
        )
        const data = await res.data;
        return data;
    }
)


const initialState = {
    publishStatus: "justGenerated",
    "id":0,
    "clusterId": 0,
    dataModel: {
        "modelStampViaGeneratedDate":"",
        "saveStatus":"notSaved",
        "numberOfDays": -1,
        "dates":[""],
        "workAreaIds":[""],
        "content":
            [
                {
                    "elementId":"piece:1.workArea:surtehojd.pieceDescription:initialGrid_with4Cols.version:NA.date:NA.",
                    "elementValue":"",
                    "elementValues":[ 
                        ["Surte höjd<br>Dag","Personal","Kväll","Personal"],
                        ["06:45-09:00","","",""],
                        ["08:30-23:00","","",""],
                        ["09:00-19:00","","",""],
                        ["14:00-22:00","","",""],
                    ]
                }
            ]
    }

}

export const dataModelSlice = createSlice({
    name: 'dataModelName',
    initialState,
    reducers: {
        loadTheRecordIntoScreen: (state, action) => {
            state.id = action.payload.id;
            state.publishStatus = action.payload.publishStatus;
            state.dataModel = JSON.parse(action.payload.schedule);
        },

        requestUpdate: (state, action) => {
            let incomingId = action.payload.incomingId;
            let incomingValue = action.payload.incomingValue;
            console.log("- requestUpdate received: \n >incomingId:" + action.payload.incomingId + "\n\n>incomingValue: " + action.payload.incomingValue)

            const elementIdParts = incomingId.split(".");
            const elementPieceDescription = elementIdParts[2].split(":")[1];

            for (let i_findTheElem=0; i_findTheElem<state.dataModel.content.length; i_findTheElem++) {
                if (incomingId == state.dataModel.content[i_findTheElem].elementId) {
                    switch (elementPieceDescription) {
                        case ("textElement"):
                            {
                                state.dataModel.content[i_findTheElem].elementValue = incomingValue
                                break;
                            }
                        case ("initialGrid_with4Cols"):
                        case ("initialGrid_with2Cols"):
                        case ("initialGrid_with4ColsFirstRowIsTitleTo2Cols"):
                            {
                                const rowNum = action.payload.rowNum;
                                const colNum = action.payload.colNum;
                                state.dataModel.content[i_findTheElem].elementValues[rowNum][colNum] = incomingValue
                                break;
                            }
                    } //end of switch statement
                } //end of if checking each elem against incoming id
            } //end of for loop
        },

        /*testFunc: (state, action) => {
                alert("testFunc access working in dataModelSlice!")
                //state.dataModel.content[0].elementValues[1][0] = "10:00"
            },*/
        setDataModel: (state,action) => {
            console.log("- setDataModel requested")
            console.log("- some details from the dataModel dispatch recieved:\n" +
            "id=" + action.payload.id + ", clusterName=" + action.payload.preparedTemplateWithAllDays.clusterName + ", numberOfDays= " + action.payload.preparedTemplateWithAllDays.numberOfDays +
            ", dates=" + action.payload.preparedTemplateWithAllDays.dates + ", workAreaIds=" + action.payload.preparedTemplateWithAllDays.workAreaIds + "... and finally, the 'content':\n\n"+JSON.stringify(action.payload.preparedTemplateWithAllDays.content)+"\n")
            //alert ("content used for setting the state: " + JSON.stringify(action.payload.content))
            state.id = action.payload.id;
            state.dataModel = action.payload.preparedTemplateWithAllDays;
            console.log("- done setting the state dataModel after receiving a dispatch request")
        },

        addRowAt: (state, action) => {
            {/*
            const location = action.payload.location;
            //extractTypeOfLocationFromLocation:
            var typeOfLocation="4colTable"
            
            typeOfLocation=="4colTable" ? var value = ["","","",""] :
            typeOfLocation=="2colTable" ? const value = ["",""]:
            typeOfLocation=="textAreaAtGora" ? const value ="Att Göra: " : {}
            
            //push to right location, the right value, something like:
            //state.dataModel.content[0].elementValues.push(["new col1","new col2","new col3","new col4"])
            */}
            console.log("add a row of values to a table at given location")
        },

        updateColAt: (state, action) => {
            //should have an element location,
            //extract a row and col location,
            //and a value

            //they could be separate like below, or together
            let elementId = action.payload.elementId;
            let whichCol = action.payload.whichCol;
            let whichRow = action.payload.whichRow;
            console.log("update a row of values given: \n" +
                "elementId= " + elementId + ", \n" +
                "whichRow= " + whichRow + ", \n" +
                "whichCol= " + whichCol)
        },

        deleteRowAt: (state, action) => {
            //delete the last row given a table (an element location)
            console.log("deleting row given: " + action.payload)
        },
    }, //end of reducers
    extraReducers: (builder) => {
        builder.addCase(saveDataModelAsDraftOrPublish.pending, (state) => {
            console.log("saveDataModelAsDraftOrPublish pending...")
        })
        builder.addCase(saveDataModelAsDraftOrPublish.fulfilled, (state, action) => {
            console.log("fullfiled saveDataModelAsDraftOrPublish. object received from API: " + JSON.stringify(action.payload))
            console.log("what is action.payload:" + JSON.stringify(action.payload)) //{"id":80,"publishStatus":"draft","saveStatus":"saved","generatedDate":"2023-06-01T17:18:33.169Z"}
            //now update the state according to details that we got from API
            //THIS IS SOMETHING THAT IS NOT DONE RIGHT YET
            state.id = action.payload.id;
            state.publishStatus = action.payload.publishStatus;
            state.dataModel.saveStatus = action.payload.saveStatus;
            state.dataModel.modelStampViaGeneratedDate = action.payload.modelStampViaGeneratedDate
            console.log("state.dataModel is: " + JSON.stringify(state.dataModel))

        })
        builder.addCase(saveDataModelAsDraftOrPublish.rejected, (state, action) => {
            console.log("rejection in saveDateModelAsDraftOrPublish")
        })
    }
}) //end of dataModelSlice create slice

export const { setDataModel, addRowAt,
            updateColAt,
        deleteRowAt,
    requestUpdate,
    loadTheRecordIntoScreen } = dataModelSlice.actions

export default dataModelSlice.reducer;