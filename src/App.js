/**
 * App.js
 * Handles display and user input.
 * @version 2025.08.13
 */
import React, { useState, useEffect } from 'react';
import Visualizer from './Visualizer';
import BubbleSort from './algorithms/BubbleSort';
import MergeSort from './algorithms/MergeSort';

const generateRandomArray = (length, min, max) => {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

const App = () => {
    const [array, setArray] = useState([]);
    const [oldArray, setOldArray] = useState([]);
    const [algorithm, setAlgorithm] = useState(null);
    const [sorting, setSorting] = useState(false);
    const [highlighted, setHighlighted] = useState([]);

    useEffect(() => {
        generateArray();
    }, []);

    const generateArray = () => {
        const newArray = generateRandomArray(20, 10, 100);
        setArray(newArray);
        setOldArray([...newArray]); // store copy
        setHighlighted([]);
    };

    const resetArray = () => {
        setArray([...oldArray]);
        setHighlighted([]);
    };

    const startSorting = async () => {
        if (!algorithm) return;

        setSorting(true);
        let steps = [];

        if (algorithm === 'BubbleSort') {
            steps = BubbleSort([...array]);
        } else if (algorithm === 'MergeSort') {
            steps = MergeSort([...array]);
        }

        // Animate each step
        for (let step of steps) {
            if (step.type === 'compare') {
                setHighlighted(step.indices);
            } else if (step.type === 'swap') {
                setArray(step.newArray);
                setHighlighted(step.indices);
            }

            await new Promise(res => setTimeout(res, 150)); // delay between steps
        }

        // Clear highlights after sorting
        setHighlighted([]);
        setSorting(false);
    };

    const handleAlgorithmChange = (selectedAlgorithm) => {
        setAlgorithm(selectedAlgorithm);
    };

    return (
        <div>
            <div>
                <h2>{algorithm ? `Sorting Algorithm: ${algorithm}` : 'Select a Sorting Algorithm'}</h2>
                <button disabled={sorting} onClick={() => handleAlgorithmChange('BubbleSort')}>Bubble Sort</button>
                <button disabled={sorting} onClick={() => handleAlgorithmChange('MergeSort')}>Merge Sort</button>
            </div>
            <button onClick={startSorting} disabled={sorting}>
                Run
            </button>
            <button onClick={resetArray} disabled={sorting}>
                Reset
            </button>
            <button onClick={generateArray} disabled={sorting}>
                New Array
            </button>
            <Visualizer array={array} highlighted={highlighted} />
        </div>
    );
};

export default App;
