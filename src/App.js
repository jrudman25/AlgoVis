/**
 * App.js
 * Handles display and user input.
 * @version 2023.12.07
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

    useEffect(() => {
        generateArray();
    }, []); // Run only once on mount to initialize the array

    const generateArray = () => {
        const newArray = generateRandomArray(20, 10, 100); // Adjust array length and range as needed
        setArray(newArray);
        setOldArray(newArray);
    };

    const resetArray = () => {
        setArray(oldArray);
    };

    const startSorting = () => {
        setSorting(true);
        if (algorithm === 'BubbleSort') {
            BubbleSort(array.slice(), setArray, doneSorting);
        } else if (algorithm === 'MergeSort') {
            MergeSort(array.slice(), setArray, doneSorting);
        }
        // Add more sorting algorithms as needed
    };

    const doneSorting = async (sortingSteps) => {
        setSorting(false);

        const updateSteps = async (index) => {
            if (index < sortingSteps.length) {
                const step = sortingSteps[index];

                if (step.type === 'compare') {
                    // Highlight the bars being compared
                    const [bar1, bar2] = step.indices;
                    const newArray = array.slice();
                    newArray[bar1] = newArray[bar1] + 10; // Adjust the highlighting style
                    newArray[bar2] = newArray[bar2] + 10; // Adjust the highlighting style
                    setArray(newArray);
                } else if (step.type === 'swap') {
                    // Animate the swap
                    setArray(step.newArray);
                }

                await new Promise((resolve) => setTimeout(resolve, 500)); // Adjust the delay as needed
                updateSteps(index + 1);
            }
        };

        updateSteps(0);
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
                {/* Add buttons for other sorting algorithms */}
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
            <Visualizer array={array} />
        </div>
    );
};

export default App;
