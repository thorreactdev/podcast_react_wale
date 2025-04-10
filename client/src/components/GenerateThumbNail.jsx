import {Textarea} from "@/components/ui/textarea.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Button} from "@/components/ui/button.jsx";
import {cn} from "@/lib/utils.js";
import {useEffect, useRef, useState} from "react";
import {Loader, MessageCircleQuestion} from "lucide-react";
import {useAuth} from "@/context/AuthContext.jsx";
import {Input} from "@/components/ui/input.jsx";
import {usePodcast} from "@/context/PodCastContext.jsx";
import {toast} from "@/hooks/use-toast.js";
import { Skeleton } from "@/components/ui/skeleton"


const MAX_PROMPT_IMAGE = 800;

// eslint-disable-next-line react/prop-types
function GenerateThumbNail({imageURL, setImageURL, imagePrompt, setImagePrompt, setImageStorageID}) {
    const {user} = useAuth();

    const [hoverQuestionMark, setHoverQuestionMark] = useState(false);
    const imageRef = useRef(null);

    const {isImageGenerated, setIsImageGenerated,isImageSet, setIsImageSet, isAIThumbnail , setIsAIThumbnail , isImageLoading, setIsImageLoading} = usePodcast();
    // const [isImageSet, setIsImageSet] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [isExceded, setIsExceded] = useState(false);
    const [extraChar, setExtraChar] = useState(0);

    const allowedType = ["image/png", "image/jpeg", "image/jpg"];

    useEffect(()=> {
        if(imagePrompt){
            // eslint-disable-next-line react/prop-types
            setCharCount(imagePrompt?.length);
            // eslint-disable-next-line react/prop-types
            setExtraChar(imagePrompt?.length > MAX_PROMPT_IMAGE ? imagePrompt?.length - MAX_PROMPT_IMAGE : 0);
            // eslint-disable-next-line react/prop-types
            setIsExceded(imagePrompt?.length > MAX_PROMPT_IMAGE);
        }
    },[imagePrompt]);

    async function handleImageGeneration(e) {
        e.preventDefault();
        if (isImageSet) return toast({title : "You have already uploaded/generated an image!"});
        try {
            setIsImageLoading(true);
            const res = await fetch("/api/generate-image", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({imagePrompt: imagePrompt})
            });
            const data = await res.json();
            if (data?.success) {
                setImageURL(data?.imageFileData?.imageUrl);
                setImageStorageID(data?.imageFileData?.imageStorageId);
                //toast message
                toast({
                    title : data?.message
                })
                setIsImageGenerated(true);
                setIsImageSet(true);
            } else {
                setIsImageLoading(false);
                toast({
                    title : data?.message,
                    variant : "destructive"
                })
            }
        } catch (e) {
            console.log(e);
            setIsImageLoading(false);
        } finally {
            setIsImageLoading(false);
        }
    }

    async function handleImageChange(e) {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        if (isImageSet) return toast({title : "You have already uploaded/generated an image!"});
        if (!allowedType.includes(selectedFile?.type)) {
            return alert("file type not supported!");
        }
        if (selectedFile?.size > 3 * 1024 * 1024) {
            return toast({title : "file size is greater than 3MB!"});
        }
        if (selectedFile) {
            setIsImageLoading(true);
            const formData = new FormData();
            formData.append("file", selectedFile);

            const res = await fetch("/api/upload-custom-image", {
                method: "POST",
                credentials : "include",
                body: formData
            });
            const data = await res.json();
            if (data?.success) {
                setImageURL(data?.customFileData?.imageUrl);
                setImageStorageID(data?.customFileData?.imageStorageId);
                setIsImageLoading(false);
                toast({
                    title : data?.message
                })
                setIsImageSet(true)
            } else {
                setIsImageLoading(false);
                toast({
                    title : data?.message,
                    variant : "destructive"
                })

            }
        }
    }

    function handleChangePromptText(e) {
        const text = e.target.value;
        setImagePrompt(text);
        setCharCount(text.length);

        if (text.length > MAX_PROMPT_IMAGE) {
            setIsExceded(true);
            setExtraChar(text.length - MAX_PROMPT_IMAGE);
        } else {
            setIsExceded(false);
            setExtraChar(0);
        }

    }

    return (
        <>
            <p className="text-white-1 font-semibold text-[13px]">
                NOTE : You can use use any one of the option to upload image either AI prompt to generate the image , or
                custom upload image. once uploaded you cannot switch to other tab, and also cannot edit
            </p>
            <div className="generate_thumbnail">

                <Button
                    type="button"
                    disabled={isImageSet}
                    variant="plain"
                    onClick={() => setIsAIThumbnail(true)}
                    className={cn("text-white-1  text-[14px] font-bold", {
                        "bg-black-6": isAIThumbnail
                    })}
                >
                    Use AI to generate thumbnail
                </Button>
                <Button
                    type="button"
                    disabled={isImageSet}
                    variant="plain"
                    onClick={() => setIsAIThumbnail(false)}
                    className={cn("text-white-1 text-[14px] font-bold", {
                        "bg-black-6": !isAIThumbnail
                    })}
                >
                    Upload custom image
                </Button>
            </div>
            {
                isAIThumbnail ? (
                    <div>
                        <div className="flex flex-col gap-2.5">
                            <div className="relative">
                                <div className="flex justify-between md:items-center flex-col gap-2 md:flex-row">
                                    <div className="mt-4 flex items-center gap-3 cursor-pointer justify-between">
                                        <Label className="text-[15px] text-white-1 font-bold">
                                            AI prompt To Generate Image
                                        </Label>
                                        <MessageCircleQuestion size={20} className="text-gray-500 hover:text-white-1"
                                                               onMouseEnter={() => setHoverQuestionMark(true)}
                                                               onMouseLeave={() => setHoverQuestionMark(false)}/>
                                    </div>
                                    <div
                                        className={`text-[13px] font-semibold  ${isExceded ? `text-red-500` : `text-gray-400`}`}>
                                        {isExceded ? `⚠️ Max character limit exceeded by ${extraChar} characters`
                                            : `character remaining : ${MAX_PROMPT_IMAGE - charCount}`}
                                    </div>

                                </div>
                                {hoverQuestionMark && (
                                    <div
                                        className="absolute top-[35px] md:top-5 left-14 md:left-60 mt-2 bg-black-1 w-full max-w-[400px] text-justify border border-black-6 text-white-1 font-semibold text-[12px] p-4 rounded-xl z-20">
                                        Hi, {user?.username}! You can enter only 800 characters to generate an image, so
                                        make sure your prompt is clear and detailed. Once the image is generated, you
                                        won’t be able to edit it or submit another prompt for the same request. Credit
                                        kam hai bhai😊
                                    </div>
                                )}
                            </div>

                            <Textarea
                                rows={5}
                                placeholder="Provide Prompt to Generate Image"
                                className="input-class resize-none focus-visible:ring-black-5 py-5 text-white-1"
                                value={imagePrompt}
                                name="imagePrompt"
                                onChange={handleChangePromptText}
                                disabled={isImageLoading || isImageGenerated}
                            />
                        </div>
                        <div className="mt-5 w-full max-w-[250px]">
                            <Button
                                type="submit"
                                onClick={handleImageGeneration}
                                disabled={isImageLoading || isImageGenerated || isImageSet}
                                className="w-full bg-black-1 font-bold text-white-1 border border-black-5 hover:bg-black-4 transition-all duration-500 py-6">
                                {isImageLoading ? (
                                    <>
                                        <Loader size={20} className="animate-spin ml-2"/>
                                        Generating image
                                    </>
                                ) : "Generate Image"
                                }
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4">
                        <div className="relative">
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-white-1 font-bold">
                                    Custom image upload
                                </p>
                                <MessageCircleQuestion size={20} className="text-gray-500 hover:text-white-1"
                                                       onMouseEnter={() => setHoverQuestionMark(true)}
                                                       onMouseLeave={() => setHoverQuestionMark(false)}/>
                            </div>
                            {hoverQuestionMark && (
                                <div
                                    className="absolute top-5 left-14 md:left-40 mt-2 bg-black-1 w-full max-w-[400px] text-justify border border-black-6 text-white-1 font-semibold text-[12px] p-4 rounded-xl">
                                    Hi, {user?.username}! Please upload only image file. No other file types are
                                    supported, file size should be max of 3MB
                                </div>
                            )}

                        </div>
                        <div className="image_div" onClick={() => imageRef?.current?.click()}>
                            <Input
                                className="hidden"
                                name="imageURL"
                                type="file"
                                accept="image/*"
                                ref={imageRef}
                                onChange={handleImageChange}
                            />
                            {
                                !isImageLoading ? (
                                    <img src="/icons/upload-image.svg" alt="upload" width={40} height={40}/>
                                ) : (
                                    <div className="text-16 flex-center font-medium text-white-1">
                                        Uploading
                                        <Loader size={20} className="animate-spin ml-2"/>
                                    </div>
                                )
                            }
                            <div className="flex flex-col items-center gap-1">
                                <h2 className="text-orange-1 font-bold text-12">
                                    Click to upload
                                </h2>
                                <p className="text-12 font-normal text-gray-1">PNG, JPG, JPEG(max.
                                    1080x1080px)</p>
                            </div>
                        </div>

                    </div>
                )}
            {
                isImageLoading ? (
                        <div className="flex-center mt-3">
                            <Skeleton  className="bg-black-1 w-[200px] h-[200px]"/>
                        </div>

                ) : imageURL && (
                    <div className="flex-center w-full">
                        <img src={imageURL} alt="thumbnail" width={200} height={200} className="mt-5"/>
                    </div>
                )
            }
        </>
    )
}

export default GenerateThumbNail;