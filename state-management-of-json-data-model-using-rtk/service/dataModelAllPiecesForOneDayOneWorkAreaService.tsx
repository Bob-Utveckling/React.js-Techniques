import * as React from 'react';

export function createAllThePiecesOfTheTemplateForThisDayForThisWorkArea(props:any) {
    //let contentElement: any;
    let elementsForThisWorkArea=[];

    for (let i_eachElemOfContent=0;i_eachElemOfContent<props.dataModel.content.length;i_eachElemOfContent++) {
        //***alert("at content elem: " + i_eachElemOfContent)
        let elementId: string = props.dataModel.content[i_eachElemOfContent].elementId;
        //***alert("- check elementId: " + elementId)
        //console.log(elementId); // "elementName":"date:08052023.publish:2.workArea:bjorklovsv.piece:1.pieceDescription:initialGrid.--gridRows:4.--gridCols:4.--moreDetails:withOneExtraTextelement.rowLocation:2.colLocation:1",
        //alert (elementId.split("."))
        const elementIdParts = elementId.split(".");
        const elementPieceNo = elementIdParts[0].split(":")[1];
        const elementWorkAreaId = elementIdParts[1].split(":")[1];
        const elementPieceDescription = elementIdParts[2].split(":")[1];
        //const elementDate = elementIdParts[4].split(":")[1];
        if (elementWorkAreaId == props.workAreaId) { //what the user has, and as we have in api template match, so create an elem
                //**alert("FOUND ELEM THAT MATCHES THIS WORKAREA")
                //create a piece element id since the only reason this function is called is preparing as a template
                elementId="piece:"+elementPieceNo+"." +
                "workArea:"+elementWorkAreaId+"." +
                "pieceDescription:"+elementPieceDescription+"." +
                "version:"+"NA"+"." +
                "date:"+props.date+".";                
                const contentElement = {
                    "elementId":elementId,
                    "elementValue": props.dataModel.content[i_eachElemOfContent].elementValue,
                    "elementValues": props.dataModel.content[i_eachElemOfContent].elementValues
                }
                //alert ("elementValues in this elem: " + props.dataModel.content[i_eachElemOfContent].elementValues)
                //alert("contentElem:"+JSON.stringify(contentElement))
                let keepElement = JSON.parse(JSON.stringify(contentElement)) //this is the solution to copy without reference so that elementId will not be the always last elementId in the loop
                //elementsForThisWorkArea.push(contentElement);
                elementsForThisWorkArea.push(keepElement);

                //const elementPieceNo = elementIdParts[3].split(":")[1];
                //alert(elementPieceDescription)
                /*switch (elementPieceDescription) {
                    case "textElement":                    
                    {
                        console.log("- have found a textElement with id: " + elementId)
                        //alert("here")
                        const contentElement = {"elementId":elementId,
                            "elementValue": props.dataModel.content[i_eachElemOfContent].elementValue,
                            "elementValues": props.dataModel.content[i_eachElemOfContent].elementValules
                        }
                        allContentElements.push(contentElement);
                        break;
                    }
                }
                */

            }
        if (i_eachElemOfContent+1 == props.dataModel.content.length) {
            //it has checked all elems and for all elems being for this workarea we have puhed to AllContentElements
            //***alert("these should be the 2 elems of the workarea: " + JSON.stringify(elementsForThisWorkArea))
            return elementsForThisWorkArea;
        }
    }

}