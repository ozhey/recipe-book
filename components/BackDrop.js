import React from 'react';

const BackDrop = ({ close }) => {

    let backDropStyle = {
        position: 'fixed',
        top: '0px',
        left: '0px',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: '100'
    }

    return (
        <div style={backDropStyle} onClick={() => close((prevState) => !prevState)} />
    );
}

export default BackDrop;
