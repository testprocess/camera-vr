import React from 'react';


const CameraButton = () => {
    return (
        <button style={{ padding: "8rem 5rem", backgroundColor: "#ffffff", position: "absolute", zIndex: "999", cursor: "pointer", borderRadius: "1rem", right: "4rem", top: "50%", transform: "translateY(-50%)", bottom: "20px", border: "none" }}>

            Camera Mode

        </button>
    );
};

export { CameraButton };