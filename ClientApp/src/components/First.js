import React from 'react';

const First = () => {
    const divStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };

    return (
        <div style={divStyle}>
            <h3>Welcome to the Leave Application Portal.</h3>
        </div>
    );
};

export default First;

