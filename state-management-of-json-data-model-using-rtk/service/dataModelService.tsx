import * as React from 'react';
import { makeDateInto_DD_MM_YYYY, createNewDateFromStartDate } from '../service/dateService';
import { createAllThePiecesOfTheTemplateForThisDayForThisWorkArea } from './dataModelAllPiecesForOneDayOneWorkAreaService';

export function PrepareDataModelAsAReadyTemplateForAllDatesGiven(props:any) {
    //alert("dataModel, numbderOfDays:"+props.numberOfDays+", startDate:"+props.startDate+", workAreaIds: " + props.workAreaIds)
    console.log("looping " + props.numberOfDays + " times...start " + props.startDate);
    //return (<div>Hi</div>)
    
    let dayObjects: string[] = [];
    let dayDetails:string[] =[];
    let listOfDates:any = [];
    for (let m=0;m<props.numberOfDays;m++) {
      console.log("m = " + m);
      listOfDates.push(makeDateInto_DD_MM_YYYY(createNewDateFromStartDate(props.startDate,m)))
      if (m+1 == props.numberOfDays) {
        //console.log("last item. all dates are ready, prepare the dayObjects")
        for (let i_numberOfDays=0; i_numberOfDays<props.numberOfDays; i_numberOfDays++) {
          console.log("I am at day: " + i_numberOfDays);
          //console.log("i = " + i);
          dayDetails = []
          for (let i_workAreaId=0;i_workAreaId<props.workAreaIds.length;i_workAreaId++) {
            //work on each section (workArea) for this day:
            //***alert("* workAreaIds for which to make respective elemenets: "+props.workAreaIds[i_workAreaId])
            
            createAllThePiecesOfTheTemplateForThisDayForThisWorkArea(
                    {date:listOfDates[i_numberOfDays],
                     workAreaId: props.workAreaIds[i_workAreaId],
                     dataModel: props.dataModelFromAPI
                    }
                )?.map(piece=>{dayDetails.push(piece)})
            
            //***alert("dayDetails right now: " + JSON.stringify(dayDetails))
            if (i_workAreaId+1==props.workAreaIds.length) {
                //reached last workarea of the day. Now push to dayObjects (if async ok with all workAreaIds and respective parts added)
                //alert("dayDetails should consist of 10 elements (default in template, i.e. 2 items for each workarea for 5 workareas). actual=" +dayDetails.length)
                dayDetails.map(day=>{dayObjects.push(day)})
                //dayObjects.push(dayDetails)
            }
          }
          if (i_numberOfDays+1 == props.numberOfDays) {
                console.log("NOW everything is ready")
                //alert("There are " + dayObjects.length + " objects in dayObjects")
                //last day. all day objects are prepared.return the dayObjects.
                //doesn't work: dispatch(updateComponentsToRender(dayObjects))
                return {
                 "id": props.id, 
                 "preparedTemplateWithAllDays": {
                  "modelStampViaGeneratedDate":"NA",
                  "saveStatus":"notSaved",
                  "clusterName": props.clusterName,
                  "numberOfDays":props.numberOfDays,
                  "dates": listOfDates,
                  "workAreaIds": props.workAreaIds,
                  "content": dayObjects
                 }
                }
          }
        }
      }
    }
}
//get the template dataModel

//know the start date, the number of days

//create a whol dataModel where you go through template, one day at a time and update all elem dates
