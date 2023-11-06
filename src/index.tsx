import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import App from './App';
import { Scene } from './three/Scene'

import io from "socket.io-client";
const socket = io("https://localhost:9080");

const rootElement = document.getElementById("app");
const root = ReactDOMClient.createRoot(rootElement);
root.render(
    <App socket={socket} />       
);

new Scene({ socket: socket })