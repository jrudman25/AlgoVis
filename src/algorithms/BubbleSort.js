/**
 * BubbleSort.js
 * Handles sorting by the bubble sort algorithm.
 * @version 2025.08.13
 */
const BubbleSort = (inputArray) => {
    const n = inputArray.length;
    const steps = [];
    let swapped;

    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            steps.push({ type: 'compare', indices: [i, i + 1] });

            if (inputArray[i] > inputArray[i + 1]) {
                [inputArray[i], inputArray[i + 1]] = [inputArray[i + 1], inputArray[i]];
                swapped = true;
                steps.push({
                    type: 'swap',
                    indices: [i, i + 1],
                    newArray: [...inputArray]
                });
            }
        }
    } while (swapped);

    return steps;
};

export default BubbleSort;
