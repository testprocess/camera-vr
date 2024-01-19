import React, { useEffect, useState } from 'react';
import io, { Socket as SocketClient } from "socket.io-client";
import { DefaultEventsMap } from 'socket.io/dist/typed-events';


const CameraButton = ({ socket }: { socket: SocketClient<DefaultEventsMap, DefaultEventsMap>}) => {
    const [animationName, setAnimationName] = useState("")
    const openMediaDevices = async (constraints: any) => {
        return await navigator.mediaDevices.getUserMedia(constraints);
    }


    const handleClickButton = async () => {
        setAnimationName("expendWidth")
        const VRButton: any = document.querySelector("#VRButton")

        setTimeout(() => {
            setAnimationName("fadeOut")
            VRButton.style.opacity = '0%'
        }, 1000)

        try {
            const video: any = document.querySelector("#video")
            const stream = await openMediaDevices({
                'video': { 
                    width: 1920, 
                    height: 1080, 
                    facingMode: "environment", 
                    advanced: [
                        {
                        zoom: 0.5
                        }
                    ]
                },
                'audio':false
            });
            video.srcObject = stream
            await makeCall(stream)
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
            if (event.candidate) {
                socket.emit("newIceCandidate", event.candidate)
            }
        });

        peerConnection.addEventListener('connectionstatechange', event => {
            if (peerConnection.connectionState === 'connected') {
                console.log("connected")
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
            const remoteDesc = new RTCSessionDescription(message);
            await peerConnection.setRemoteDescription(remoteDesc);
        })
    }



    return (
        <button onClick={handleClickButton} style={{ backgroundColor: "#4F6F52", color: "#ECE3CE", fontSize: "1.4rem", position: "absolute", zIndex: "999", cursor: "pointer", width: "50%", height: "100%", right: "0", border: "none", animationName: animationName, animationDuration: '1s', animationFillMode: "forwards" }}>

            Camera Mode

        </button>
    );
};

export { CameraButton };