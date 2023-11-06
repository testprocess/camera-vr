import React, { useEffect } from 'react';
import io, { Socket as SocketClient } from "socket.io-client";
import { DefaultEventsMap } from 'socket.io/dist/typed-events';


const CameraButton = ({ socket }: { socket: SocketClient<DefaultEventsMap, DefaultEventsMap>}) => {
    const openMediaDevices = async (constraints: any) => {
        return await navigator.mediaDevices.getUserMedia(constraints);
    }


    const handleClickButton = async () => {

        try {
            const video: any = document.querySelector("#video")
            const stream = await openMediaDevices({'video':true,'audio':false});
            video.srcObject = stream
            await makeCall(stream)
            console.log('Got MediaStream:', stream);
        } catch(error) {
            console.error('Error accessing media devices.', error);
        }
    }

    const makeCall = async (stream: any) => {
        const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
        const peerConnection = new RTCPeerConnection(configuration);
  
        stream.getTracks().forEach((track: any) => peerConnection.addTrack(track, stream));
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socket.emit("offer", offer)

        peerConnection.addEventListener('icecandidate', event => {
            console.log("icecandidateicecandidateicecandidate")
            if (event.candidate) {
                socket.emit("newIceCandidate", event.candidate)
            }
        });

        peerConnection.addEventListener('connectionstatechange', event => {
            if (peerConnection.connectionState === 'connected') {
                console.log("CCCCCCCCCC")
            }
        });

        socket.on("iceCandidate", async (message) => {
            try {
                await peerConnection.addIceCandidate(message);
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        })

        socket.on("message", async (message) => {
            console.log(message)
            const remoteDesc = new RTCSessionDescription(message);
            await peerConnection.setRemoteDescription(remoteDesc);
        })
    }



    return (
        <button onClick={handleClickButton} style={{ padding: "8rem 5rem", backgroundColor: "#ffffff", position: "absolute", zIndex: "999", cursor: "pointer", borderRadius: "1rem", right: "4rem", top: "50%", transform: "translateY(-50%)", bottom: "20px", border: "none" }}>

            Camera Mode

        </button>
    );
};

export { CameraButton };