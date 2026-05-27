import type { SortStep } from './types';

const InsertionSort = (inputArray: number[]): SortStep[] => {
    const steps: SortStep[] = [];

    for (let i = 1; i < inputArray.length; i++) {
        const currentValue = inputArray[i]!;
        let j = i - 1;

        while (j >= 0) {
            steps.push({ type: 'compare', indices: [j, j + 1] });

            if (inputArray[j]! <= currentValue) {
                break;
            }

            inputArray[j + 1] = inputArray[j]!;
            steps.push({
                type: 'swap',
                indices: [j, j + 1],
                newArray: [...inputArray]
            });
            j--;
        }

        inputArray[j + 1] = currentValue;
        steps.push({
            type: 'swap',
            indices: [j + 1],
            newArray: [...inputArray]
        });
    }

    return steps;
};

export default InsertionSort;
