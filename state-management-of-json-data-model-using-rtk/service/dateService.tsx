import { format } from "date-fns";
import { start } from "repl";
import moment from 'moment';

export function makeDateUserFriendly_from_DD_MM_YYYY(givenDate:any) {
  const YYYY = givenDate.split("-")[2]
  const MM = givenDate.split("-")[1]
  const DD = givenDate.split("-")[0]
  const myDate = YYYY+"-"+MM+"-"+DD
  const dateToProcess = new Date(myDate);
  return makeDateUserFriendly(dateToProcess);
}

export function makeDateUserFriendly(givenDate: any) {
        const currday = (dayInDig:number) => {
            //console.log("dayInDig: " + dayInDig)
          if (dayInDig === 0) {
            return "Söndag"
          }
          else if (dayInDig === 1) {
            return "Mondag"
          }
          else if (dayInDig === 2) {
            return "Tisdag"
          }
          else if (dayInDig === 3) {
            return "Onsdag"
          }
          else if (dayInDig === 4) {
            return "Torsdag"
          }
          else if (dayInDig === 5) {
            return "Fredag"
          }
          else if (dayInDig === 6) {
            return "Lördag"
          }
        }
        const currentDay = currday(givenDate.getDay()); //Fredag
        const dayOfTheMonth = givenDate.getDate() //day of month, eg 5, 31, etc
        const givenMonth = givenDate.getMonth()+1; //+1 since it is index. May=5
        const formattedFriendlyDate = `${currentDay} ${dayOfTheMonth}/${givenMonth}`;
        return formattedFriendlyDate;
}

export function makeDateInto_DD_MM_YYYY(givenDate:any) {
    //var formattedDate = format(givenDate, "MMMM do, yyyy H:mma");   
    let formattedDate = format(givenDate, "dd-LL-yyyy");   //May 11th,2023=>11-05-2023
    //alert("Formatted date: " + formattedDate);
    return formattedDate;

}

export function createNewDateFromStartDate(startdate:string, days:number) {
  const newdate = new Date(startdate);
  newdate.setDate(newdate.getDate() + days);
  console.log("function created new date: " + newdate + " (#of days away) from startDate.");
  //alert("return a createNewDateFromStartDate date: " + newdate);
  return newdate;
}

export function createARangeOfDates(startDate:string, numDays:number) {
  let arrDates = []
  for (let i=0;i<numDays;i++) {
    //alert (moment(startDate, "DD-MM-YYYY")) //=> Thu Jun 22 2023 00:00:00 GMT+0200
    let myDate = (moment(startDate, "DD-MM-YYYY")) //=> Thu Jun 22 2023 00:00:00 GMT+0200
    //alert("myDate = " + myDate) //myDate = 1687384800000
    //alert ("create new date: " + createNewDateFromStartDate(myDate.format(),i)) //Thu Jun 22 2023 00:00:00 GMT+0200 (Central European Summer Time)
    //alert ("DD MM YYYY: " + makeDateInto_DD_MM_YYYY(createNewDateFromStartDate(startDate,i))) //: Invalid Date
    //alert ("DD MM YYYY: " + format(createNewDateFromStartDate(myDate.format(),i),"dd-LL-yyyy")) //22-06-2023
    let readyDate = format(createNewDateFromStartDate(myDate.format(),i),"dd-LL-yyyy")
    arrDates.push(readyDate)
    if (i+1==numDays) {
      return (arrDates)
    }
  }
}
