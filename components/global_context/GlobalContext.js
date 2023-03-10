import React, { createContext, useState } from "react";

const Context = createContext();
const Provider = ( { children } ) => {

    const [ galleryPhoto, setGalleryPhoto ] = useState("");
    const [ loadingModel, setLoadingModel ] = useState(false);
    const [ isPredicting, setIsPredicting ] = useState(false);
    const [ predictedResult, setPredictedResult ] = useState([]);
    const [ foodrecommendation,setFoodRecommendation] = useState([]);
    const [ nutrients, setNutrients ] = useState();

    const globalContext = {
        galleryPhoto,
        setGalleryPhoto,
        loadingModel,
        setLoadingModel,
        isPredicting,
        setIsPredicting,
        predictedResult, 
        setPredictedResult,
        foodrecommendation,
        setFoodRecommendation,
    }

    return <Context.Provider value={globalContext}>
        {children}
    </Context.Provider>
}

export { Context, Provider };