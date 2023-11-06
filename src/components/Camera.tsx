import React, { useEffect } from 'react';


const CameraButton = () => {
    const openMediaDevices = async (constraints: any) => {
        return await navigator.mediaDevices.getUserMedia(constraints);
    }


    const handleClickButton = async () => {
        try {
            const video: any = document.querySelector("#video")
            const stream = await openMediaDevices({'video':true,'audio':false});
            video.srcObject = stream
            console.log('Got MediaStream:', stream);
        } catch(error) {
            console.error('Error accessing media devices.', error);
        }
    }



    return (
        <button onClick={handleClickButton} style={{ padding: "8rem 5rem", backgroundColor: "#ffffff", position: "absolute", zIndex: "999", cursor: "pointer", borderRadius: "1rem", right: "4rem", top: "50%", transform: "translateY(-50%)", bottom: "20px", border: "none" }}>

            Camera Mode

        </button>
    );
};

export { CameraButton };