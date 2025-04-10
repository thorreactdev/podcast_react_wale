import {createContext, useContext, useState} from "react";
import {createPodcastInitialFormData} from "@/utils/initialFormData.js";

const PodcastContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const PodcastContextProvider = ({children}) => {
    const [podcastData , setPodcastData] = useState(createPodcastInitialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isImageGenerated, setIsImageGenerated] = useState(false);
    const [isImageSet, setIsImageSet] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isVoiceGenerated, setIsVoiceGenerated] = useState(false);
    const [isVoiceGenerating , setIsVoiceGenerating] = useState(false);
    const [isAIThumbnail , setIsAIThumbnail] = useState(false);




    return (
        <PodcastContext.Provider value={{ podcastData , setPodcastData , isSubmitting , setIsSubmitting , isImageGenerated ,
            setIsImageGenerated, isImageSet, setIsImageSet , isVoiceGenerated, setIsVoiceGenerated , isVoiceGenerating , setIsVoiceGenerating,
            isAIThumbnail , setIsAIThumbnail , isImageLoading, setIsImageLoading}}>
            {children}
        </PodcastContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePodcast = () => useContext(PodcastContext);