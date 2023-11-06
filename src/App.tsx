import React, { useEffect } from 'react';
import { CameraButton } from './components/Camera';



import './App.css'


const App: any = ({ socket }: any) => {
    return (
        <div>
            <CameraButton socket={socket}></CameraButton>
        </div>
    );
};

export default App;