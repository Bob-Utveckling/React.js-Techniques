//store.tsx

import { configureStore } from "@reduxjs/toolkit";
//Importing the reducer form countSlice
//import counterReducer from "./countslice"
import initialDetailsReducer from "./initialDetailsSlice"
//import componentsToRenderReducer from "./componentRenderSlice"
import dataModelReducer from "./dataModelSlice"



export const store = configureStore({
//const store = configureStore({
    reducer: {
        initialDetails: initialDetailsReducer,
        dataModel: dataModelReducer
    },
    //setting the serializableCheck flag to false so that Date variable is put in without serialization. Otherwise serialize date with eg: date.toISOString();
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false
    })
})
//export type AppDispatch = typeof store.dispatch;
//wrong: export type AppDispatch = ReturnType<typeof store>["dispatch"]
//export default store;