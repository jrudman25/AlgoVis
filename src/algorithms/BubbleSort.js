/**
 * BubbleSort.js
 * Handles sorting by the bubble sort algorithm.
 * @version 2023.12.07
 */
const BubbleSort = async (inputArray, setArray, doneSorting) => {
    const n = inputArray.length;
    const sortingSteps = [];
    let swapped;

    do {
        swapped = false;

        for (let i = 0; i < n - 1; i++) {
            sortingSteps.push({ type: 'compare', indices: [i, i + 1] });

            if (inputArray[i] > inputArray[i + 1]) {
                // Swap
                const temp = inputArray[i];
                inputArray[i] = inputArray[i + 1];
                inputArray[i + 1] = temp;
                swapped = true;

                sortingSteps.push({ type: 'swap', indices: [i, i + 1], newArray: inputArray.slice() });
            }
        }
    } while (swapped);

    doneSorting(sortingSteps);
};

export default BubbleSort;
