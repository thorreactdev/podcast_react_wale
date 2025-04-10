import { toast } from "@/hooks/use-toast";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AudioContext = createContext(null);

export const AudioProvider = ({ children })=>{
    const { pathname } = useLocation();
    const [audio , setAudio] = useState(undefined);

    //if the user is creating a new podcast then simply set the auido as undefined
    useEffect(()=>{
        if(pathname === "/create-podcast"){
            setAudio(undefined);
        }
    },[pathname])



    return(
        <AudioContext.Provider value={{ audio , setAudio}}>
            {children}
        </AudioContext.Provider>
    )
}

export const useAudio = () =>{
    const context = useContext(AudioContext);
    if(!context){
        toast({ title : 'use audio must be used within an audio provider'});
    } 
    return context;
}