import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    numberOfDays: 7,
    startDate: new Date(),
    kommunId: "kommun1",
    kommunName: "Kommun 1",
    clusterId: 0,
    clusterTitle: "",
    //clusterVerksamheter_och_omrade: "Surte höjd, Björklövsv, Klöverstigen, Natt, Intro/Admin/Resurser",
    clusterVerksamheter_och_omrade: "Not entered yet",
}

export const initialDetailsSlice = createSlice({
    name: 'initialDetails',
    initialState,
    reducers: {
        setNumberOfDays: (state, action) => {
            state.numberOfDays = action.payload
            console.log("- got dispatch req for setNumberOfDays and set to: " + state.numberOfDays)
        },
        setStartDate: (state, action) => {
            state.startDate = action.payload
            console.log("calendar Date (of type Date) in store now: " + state.startDate)

        },
        updateClusterId: (state, action) => {
            state.clusterId = action.payload
            console.log("- update state.clusterId to: " + state.clusterId)
        },
        updateClusterTitle: (state, action) => {
            state.clusterTitle = action.payload
            console.log("- update state.clusterTitle to: " + state.clusterTitle)
        },
        updateClusterVerksamheterOchOmrade: (state, action) => {
            state.clusterVerksamheter_och_omrade = action.payload
            console.log("- updated state.clusterName to: " + state.clusterVerksamheter_och_omrade)
        },
    },
})

export const { setNumberOfDays, setStartDate,
    updateClusterId, updateClusterTitle,
    updateClusterVerksamheterOchOmrade } = initialDetailsSlice.actions

export default initialDetailsSlice.reducer