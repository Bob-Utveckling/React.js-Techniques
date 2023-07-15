
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import configData from "../service/config.json"
import axios from 'axios';
export default function Dropdown1(props:any) {
    const [selectedOption, setSelectedOption] = useState(null);
    
    const updateClusterId = (e:any) => {
        //console.log("setClusterId to: " + e.target.value)
        //console.log("setClusterId to: " + JSON.stringify(e))
    }
    let listOfClusters1 = [
        {value:1, label:"cluster 1"}
    ]
    let listOfClusters: any = []
    //useEffect(()=> { //not needed -- bug. The list gets double the items    
    
    //This works, loading the list from an API response:
    /*axios.get(configData.API_URL+"clusters", {
        withCredentials: true
    }).then(response=> {
        console.log(response.data)
        response.data.map((item:any)=> {
            listOfClusters.push({value:item.id, label:item.title, verksamheter_och_omrade:item.verksamheter_och_omrade})
        })
    })*/
    listOfClusters.push({value:"1", label:"Toaster", verksamheter_och_omrade:"specialized name 1"})
    listOfClusters.push({value:"2", label:"Calendar", verksamheter_och_omrade:"specialized name 2"})
    listOfClusters.push({value:"3", label:"Date Picker", verksamheter_och_omrade:"specialized name 3"})
    listOfClusters.push({value:"4", label:"Custom Date Functions", verksamheter_och_omrade:"specialized name 4"})
    listOfClusters.push({value:"5", label:"Content Editables", verksamheter_och_omrade:"specialized name 5"})
    listOfClusters.push({value:"6", label:"Container with Row & Col", verksamheter_och_omrade:"specialized name 6"})


    //}, [])
        
        return(
                <Select
                defaultValue={selectedOption}
                onChange={props.onChange}
                options={listOfClusters}

                styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      fontSize: '18px',
                      width: '250px',
                      borderColor: state.isFocused ? 'grey' : 'green',
                    }),
                    option: (styles, {data, isDisabled, isFocused, isSelected}) => {                        
                        return {
                            ...styles,
                            fontSize:'18px'
                        }
                    }
                  }}

                />
        )

}