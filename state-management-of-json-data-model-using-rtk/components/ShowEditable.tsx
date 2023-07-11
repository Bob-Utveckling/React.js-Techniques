import * as React from 'react';
import ContentEditable from 'react-contenteditable';
import plussign from '../assets/plus1.png';
import minussign from '../assets/minus1.png';
import { useDispatch } from 'react-redux'
import { requestUpdate } from '../redux/dataModelSlice';

//maybe getVersion is not needed for the function. what do we check anyway with it?
export const EditableContent = (props:any) => {
    const dispatch = useDispatch();
    let contentElement: any;
    
    let elementId = props.elementId

    //const elementIdParts = elementId.split(".");
    //const elementPieceNo = elementIdParts[0].split(":")[1];
    //const elementWorkArea = elementIdParts[1].split(":")[1];
    const elementPieceDescription = props.elementPieceDescription

    //const elementDate = elementIdParts[4].split(":")[1];
    switch (elementPieceDescription) {
        case "textElement":
        {
            //alert("here")
            contentElement =  <ContentEditable 
            //could not add array as a value to elementValues in data model, thus
            //added an "elementValue" even to elements that were array but set it to ""
            //html={typeof(dataModel.content[i].elementValue)==='string' ? dataModel.content[i].elementValue : 'test'}
            html={props.elementValue}
            onChange={(e:any)=>{console.log("handle text change");
                    dispatch(requestUpdate(
                        {incomingId:elementId,
                        incomingValue:e.target.value
                        }
                    )) /* dispatch(testFunc("test")*/
            }}
            //onChange={()=>handleChange1()}
            //style={{border:'1px dashed gray'}} 
            className="editableTextElement"
            data-is-it-dynamic-content="yes"
            data-elem-id={elementId} />
            //return contentElement;
            return contentElement;
            break;
        } //end of case text element

        case "initialGrid_with4Cols": {
          let arr_allRowsOfValues = props.elementValues;
          let arr_oneRowCols = [];
          let allRowsElements = [];
          for (let i_countrows=0;i_countrows<arr_allRowsOfValues.length;i_countrows++) {
              const arr_row = arr_allRowsOfValues[i_countrows];
              if (arr_row.length==4) {
                  //ok alert("found a row with 4 elems")
                  
                  for (let i_col=0; i_col<arr_row.length; i_col++) {
                      //ok alert(colValue);                                
                      arr_oneRowCols.push(
                          <td className='tdForEditable'>
                              <ContentEditable 
                                                  //could not add array as a value to elementValues in data model, thus
                                                  //added an "elementValue" even to elements that were array but set it to ""
                                                  //html={typeof(dataModel.content[i].elementValue)==='string' ? dataModel.content[i].elementValue : 'test'}
                                                  html={arr_row[i_col]}
                                                  onChange={(e:any)=>{console.log("handle initialGrid 4cols change");
                                                  dispatch(requestUpdate(
                                                      {incomingId:elementId,
                                                      incomingValue:e.target.value,
                                                      rowNum: i_countrows,
                                                      colNum: i_col
                                                      }
                                                  ))
                                                }}
                                          
                                                  //style={{border:'1px dashed gray'}} 
                                                  className="editableElement"
                                                  data-is-it-dynamic-content="yes"
                                                  data-elem-id={elementId+"_row:"+i_countrows+"."+"_col:"+i_col+"."} />
                          
                          </td>
                          )
                      if (i_col+1 == arr_row.length) {
                          allRowsElements.push(<tr>{arr_oneRowCols}</tr>)
                          arr_oneRowCols=[]
                      }
                  }
                  if (i_countrows+1==arr_allRowsOfValues.length) {
                      //alert("just passed the last item in row. make the row and add to all rows");
                      //let keepElementId = JSON.parse(JSON.stringify(elementId)) //this is the solution to copy without reference so that elementId will not be the always last elementId in the loop
                      let contentElement1=
                              <div id="divWithAccompaniedPlusMinusSign">
                                  <table className='editableTableElement' data-elem-id={elementId}>{allRowsElements}</table>
                                  <img src={plussign} className="plus_minus_signs" alt="Addera rad" onClick={() => console.log("addRowToTable(keepElementId)")} />  
                                  <img src={minussign} className="plus_minus_signs" alt="Ta bort rad" onClick={()=> console.log("removeRowFromTable(keepElementId)")}/>  
                              </div>
                      return contentElement1
                  }
              }
          }
          break;
        } //end of case with 4 cols

        case "initialGrid_with2Cols":
            {
              let arr_allRowsOfValues = props.elementValues;
              let arr_oneRowCols = [];
              let allRowsElements = [];
              for (let i_countrows=0;i_countrows<arr_allRowsOfValues.length;i_countrows++) {
                  const arr_row = arr_allRowsOfValues[i_countrows];
                  if (arr_row.length==2) {
                      //ok alert("found a row with 4 elems")
                      for (let i_col=0; i_col<arr_row.length; i_col++) {
                          //ok alert(colValue);                                
                          arr_oneRowCols.push(
                              <td className='tdForEditable'>
                                  <ContentEditable 
                                                      //could not add array as a value to elementValues in data model, thus
                                                      //added an "elementValue" even to elements that were array but set it to ""
                                                      //html={typeof(dataModel.content[i].elementValue)==='string' ? dataModel.content[i].elementValue : 'test'}
                                                      html={arr_row[i_col]}
                                                      onChange={(e:any)=>{console.log("handle initialGrid 2cols change");
                                                        dispatch(requestUpdate(
                                                            {incomingId:elementId,
                                                            incomingValue:e.target.value,
                                                            rowNum: i_countrows,
                                                            colNum: i_col
                                                            }
                                                        ))
                                                       }}
                                                      //style={{border:'1px dashed gray'}} 
                                                      className="editableElement"
                                                      data-is-it-dynamic-content="yes"
                                                      data-elem-id={elementId} />
                              
                              </td>
                              )
                          if (i_col+1 == arr_row.length) {
                              allRowsElements.push(<tr>{arr_oneRowCols}</tr>)
                              arr_oneRowCols=[]
                          }
                      }
                      if (i_countrows+1==arr_allRowsOfValues.length) {
                          //alert("just passed the last item in row. make the row and add to all rows");
                          //let keepElementId = JSON.parse(JSON.stringify(elementId)) //this is the solution to copy without reference so that elementId will not be the always last elementId in the loop
                          let contentElement1=
                                  <div id="divWithAccompaniedPlusMinusSign">
                                      <table className='editableTableElement'>{allRowsElements}</table>
                                      <img src={plussign} className="plus_minus_signs" alt="Addera rad" onClick={() => console.log("addRowToTable(keepElementId)")} />  
                                      <img src={minussign} className="plus_minus_signs" alt="Ta bort rad" onClick={()=> console.log("removeRowFromTable(keepElementId)")}/>  
                                  </div>
                          return contentElement1
                      }
                  }
              }
              break;
            } //end of case statement with 2 cols

            case "initialGrid_with4ColsFirstRowIsTitleTo2Cols":
                {
                  let arr_allRowsOfValues = props.elementValues;
                  let arr_oneRowCols = [];
                  let allRowsElements = [];
                  for (let i_countrows=0;i_countrows<arr_allRowsOfValues.length;i_countrows++) {
                      const arr_row = arr_allRowsOfValues[i_countrows];
                      if (i_countrows==0) {
                          for (let i_col=0; i_col<arr_row.length; i_col++) {
                              arr_oneRowCols.push(
                                  <td colSpan={2} className={ i_col===0 ? 'tdColorStyle1' : 'tdColorStyle2' }>
                                      <table><tr><td>
                                          <ContentEditable 
                                                          //could not add array as a value to elementValues in data model, thus
                                                          //added an "elementValue" even to elements that were array but set it to ""
                                                          //html={typeof(dataModel.content[i].elementValue)==='string' ? dataModel.content[i].elementValue : 'test'}
                                                          html={arr_row[i_col]}
                                                          onChange={(e:any)=>{console.log("handle initialGrid 4cols 1st row header to two cols change");
                                                                dispatch(requestUpdate(
                                                                    {incomingId:elementId,
                                                                    incomingValue:e.target.value,
                                                                    rowNum: i_countrows,
                                                                    colNum: i_col
                                                                    }
                                                                ))
                                                          }}
                                                          //style={{border:'1px dashed gray'}} 
                                                          className="editableElement"
                                                          data-is-it-dynamic-content="yes"
                                                          data-elem-id={elementId} />
                                      </td></tr></table>                                    
                                  </td>
                              )
                              if (i_col+1 == arr_row.length) {
                                  allRowsElements.push(<tr>{arr_oneRowCols}</tr>)
                                  arr_oneRowCols=[]
                              }
                          }
                      } else {
                          if (arr_row.length==4) {
                              for (let i2_col=0; i2_col<arr_row.length; i2_col++) {
                                  
                                  //some aligning depending on whether the col is first in the rows
                                  let myCustomClassName = '';
                                  i2_col===0 ? myCustomClassName='tdForEditableAlignTextLeft' : myCustomClassName='tdForEditable';
                                  i2_col>1 ? myCustomClassName='tdColorStyle2_blue' : myCustomClassName='tdColorStyle1_lightbrown_alignTextLeft';
                                  arr_oneRowCols.push(
                                      <td className={myCustomClassName}>
                                              <ContentEditable 
                                                              //could not add array as a value to elementValues in data model, thus
                                                              //added an "elementValue" even to elements that were array but set it to ""
                                                              //html={typeof(dataModel.content[i].elementValue)==='string' ? dataModel.content[i].elementValue : 'test'}
                                                              html={arr_row[i2_col]}
                                                              onChange={(e:any)=>{console.log("handle initialGrid 4cols 1st row header to two cols change");
                                                                dispatch(requestUpdate(
                                                                    {incomingId:elementId,
                                                                    incomingValue:e.target.value,
                                                                    rowNum: i_countrows,
                                                                    colNum: i2_col
                                                                    }
                                                                ))
                                                              }}
                                                              //style={{border:'1px dashed gray'}} 
                                                              className="editableElement"
                                                              data-is-it-dynamic-content="yes"
                                                              data-elem-id={elementId} />                            
                                      </td>
                                  )
                                  if (i2_col+1 == arr_row.length) {
                                      allRowsElements.push(<tr>{arr_oneRowCols}</tr>)
                                      arr_oneRowCols=[]
                                  }
                              }
                          }

                      }
                      if (i_countrows+1==arr_allRowsOfValues.length) {
                          //alert("just passed the last item in row. make the row and add to all rows");
                          //old:
                          //var contentElement1=<table className='editableTableElement'>{allRowsElements}</table>
                          //allContentElements.push(contentElement1)

                          //let keepElementId = JSON.parse(JSON.stringify(elementId)) //this is the solution to copy without reference so that elementId will not be the always last elementId in the loop
                          let contentElement1=
                                  <div id="divWithAccompaniedPlusMinusSign">
                                      <table className='editableTableElement'>{allRowsElements}</table>
                                      <img src={plussign} className="plus_minus_signs" alt="Addera rad" onClick={() => console.log("addRowToTable(keepElementId)")} />  
                                      <img src={minussign} className="plus_minus_signs" alt="Ta bort rad" onClick={props.myRemoveFunction}/>  
                                  </div>
                          return contentElement1
                          
                      } //end of case statement initialGrid_with4ColsFirstRowIsTitleTo2Cols
                  }
                  break;
                  
              }            

    }
      return <></>
}