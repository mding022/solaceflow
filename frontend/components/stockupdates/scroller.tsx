import React from 'react';
import Updates from '../updates';

const ScrollingText = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'black',
            padding: '10px 0',
            zIndex: 9999
        }}>
            <div style={{
                display: 'inline-flex',
                whiteSpace: 'nowrap',
                animation: 'scrollLeft 30s linear infinite',
                fontSize: '18px',
                color: 'white',
            }}>
                <Updates />
            </div>
        </div>
    );
};

export default ScrollingText;
