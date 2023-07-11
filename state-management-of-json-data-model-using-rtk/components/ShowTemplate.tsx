import * as React from 'react';
import { makeDateUserFriendly_from_DD_MM_YYYY } from '../service/dateService';
import { EditableContent } from './ShowEditable';
import { useSelector } from 'react-redux'

export function ShowTemplate(props:any) {
    let dataModel = useSelector((state:any)=> state.dataModel.dataModel);
    //alert("create for " + dataModel.numberOfDays + " days")
    
    function removeATable(event:any) {
        alert("remove")
        ResultRender = []
    }

    let ResultRender = [] //<></>;
    let daysForThisTemplate = []
    for(let i_date=0; i_date<dataModel.numberOfDays; i_date++) {
        let workAreasForThisDay=[];
        for(let i_workAreaId=0;i_workAreaId<dataModel.workAreaIds.length;i_workAreaId++) {
            //alert(dataModel.content.length) //7 days, 10 elems for 1 day = 70
            let elementsForThisWorkArea=[]
            for (let i_element=0;i_element<dataModel.content.length;i_element++) {
                //alert("at element: " +  dataModel.content[i_element].elementId)
                let elementId: string = dataModel.content[i_element].elementId;
                
                /*alert ("i_date: " + i_date + ", i_workAreaId: " 
                + i_workAreaId + "element #: " + i_element 
                + " - will check elementId:\n\n" + elementId
                + "\n\n, AGAINST what we need, \n date: " + dataModel.dates[i_date] + " \n & workAreaId: " + dataModel.workAreaIds[i_workAreaId] )
                */
                
                const elementIdParts = elementId.split(".");
                //const elementPieceNo = elementIdParts[0].split(":")[1];
                const elementWorkAreaId = elementIdParts[1].split(":")[1];
                const elementPieceDescription = elementIdParts[2].split(":")[1];
                //WORK WITH THIS MAYBE... let elementVersion = elementIdParts[3].split(":")[1];
                const elementDate = JSON.parse(JSON.stringify(elementIdParts[4].split(":")[1]));
                if (elementDate==dataModel.dates[i_date]  &&
                        elementWorkAreaId==dataModel.workAreaIds[i_workAreaId]) {
                        elementsForThisWorkArea.push(
                            <div>
                            {/*elementId*/}
                            <EditableContent myRemoveFunction={removeATable} elementId={elementId} 
                                elementPieceDescription={elementPieceDescription}
                                elementValue={dataModel.content[i_element].elementValue}
                                elementValues={dataModel.content[i_element].elementValues} />
                            </div>
                        )
                }
                if (i_element+1==dataModel.content.length) {
                    //went thought all content elems and all elems for this workArea are added and ready
                    //add workArea to day
                    workAreasForThisDay.push ( 
                        <div className={dataModel.workAreaIds[i_workAreaId]+'_table'}>
                            {elementsForThisWorkArea}
                        </div>
                        )
                }
            }
            if (i_workAreaId+1==dataModel.workAreaIds.length) {
                //at last workAreaId, so now we have all content elements for this workArea
                //add all workAreas to days array
                daysForThisTemplate.push(
                    <div className="oneDaySchedule">
                    <div className="friendlyDate">{makeDateUserFriendly_from_DD_MM_YYYY(dataModel.dates[i_date])} <hr/><p></p></div>
                    {workAreasForThisDay}
                    </div>)
            }
        }
        if (i_date+1==dataModel.numberOfDays) {
            //last day of template reached so add all days for this template
            ResultRender.push(<div>{daysForThisTemplate}</div>);
            return <>{ResultRender}</>;
        }
        
    }
    return <div>Schemat visas här</div>
}
