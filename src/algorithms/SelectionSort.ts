import type { SortStep } from './types';

const SelectionSort = (inputArray: number[]): SortStep[] => {
    const steps: SortStep[] = [];

    for (let i = 0; i < inputArray.length - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < inputArray.length; j++) {
            steps.push({ type: 'compare', indices: [minIndex, j] });

            if (inputArray[j]! < inputArray[minIndex]!) {
                minIndex = j;
            }
        }

        if (minIndex !== i) {
            [inputArray[i], inputArray[minIndex]] = [inputArray[minIndex]!, inputArray[i]!];
            steps.push({
                type: 'swap',
                indices: [i, minIndex],
                newArray: [...inputArray]
            });
        }
    }

    return steps;
};

export default SelectionSort;
