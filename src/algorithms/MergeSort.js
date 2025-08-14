/**
 * MergeSort.js
 * Handles sorting by the merge sort algorithm.
 * @version 2025.08.13
 */
const MergeSort = (inputArray) => {
    const steps = [];
    const auxArray = [...inputArray];

    const mergeSortHelper = (mainArray, start, end) => {
        if (start >= end) return;
        const middle = Math.floor((start + end) / 2);
        mergeSortHelper(mainArray, start, middle);
        mergeSortHelper(mainArray, middle + 1, end);
        merge(mainArray, start, middle, end);
    };

    const merge = (mainArray, start, middle, end) => {
        let leftIndex = start;
        let rightIndex = middle + 1;
        let sortedIndex = start;

        while (leftIndex <= middle && rightIndex <= end) {
            steps.push({ type: 'compare', indices: [leftIndex, rightIndex] });

            if (auxArray[leftIndex] <= auxArray[rightIndex]) {
                mainArray[sortedIndex] = auxArray[leftIndex];
                steps.push({
                    type: 'swap',
                    indices: [sortedIndex],
                    newArray: [...mainArray]
                });
                leftIndex++;
            } else {
                mainArray[sortedIndex] = auxArray[rightIndex];
                steps.push({
                    type: 'swap',
                    indices: [sortedIndex],
                    newArray: [...mainArray]
                });
                rightIndex++;
            }
            sortedIndex++;
        }

        while (leftIndex <= middle) {
            mainArray[sortedIndex] = auxArray[leftIndex];
            steps.push({
                type: 'swap',
                indices: [sortedIndex],
                newArray: [...mainArray]
            });
            leftIndex++;
            sortedIndex++;
        }

        while (rightIndex <= end) {
            mainArray[sortedIndex] = auxArray[rightIndex];
            steps.push({
                type: 'swap',
                indices: [sortedIndex],
                newArray: [...mainArray]
            });
            rightIndex++;
            sortedIndex++;
        }

        // Copy merged section into auxArray for future comparisons
        for (let i = start; i <= end; i++) {
            auxArray[i] = mainArray[i];
        }
    };

    mergeSortHelper(inputArray, 0, inputArray.length - 1);
    return steps;
};

export default MergeSort;
