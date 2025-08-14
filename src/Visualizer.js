/**
 * Visualizer.js
 * Handles the graph visualization.
 * @version 2025.08.13
 */
import React from 'react';
import './Visualizer.css';

const Visualizer = ({ array, highlighted }) => {
    return (
        <div className="array-container">
            {array.map((value, index) => {
                const isHighlighted = highlighted.includes(index);
                return (
                    <div
                        className="array-bar"
                        key={index}
                        style={{
                            height: `${value}px`,
                            backgroundColor: isHighlighted ? '#ff4d4d' : '#6e83a3'
                        }}
                    ></div>
                );
            })}
        </div>
    );
};

export default Visualizer;
