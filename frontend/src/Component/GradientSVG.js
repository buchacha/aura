import React, { Component }  from 'react';

function GradientSVG() {
    const startColor = '#EC7AE2';
    const endColor = '#A21C63';
    const idCSS = 'custom-gradient';
    const gradientTransform = `rotate(180)`;

    return (
        <svg style={{ height: 0 }}>
            <defs>
                <linearGradient id={idCSS} gradientTransform={gradientTransform}>
                    <stop offset="0%" stopColor={startColor} />
                    <stop offset="100%" stopColor={endColor} />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default GradientSVG;