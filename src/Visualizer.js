/**
 * Visualizer.js
 * Handles the graph visualization.
 * @version 2023.12.07
 */
import React from 'react';
import './Visualizer.css';

const Visualizer = ({ array }) => {
    return (
        <div className="array-container">
            {array.map((value, index) => (
                <div
                    className="array-bar"
                    key={index}
                    style={{ height: `${value}px` }}
                ></div>
            ))}
        </div>
    );
};

export default Visualizer;
