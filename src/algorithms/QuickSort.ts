import type { SortStep } from './types';

const QuickSort = (inputArray: number[]): SortStep[] => {
    const steps: SortStep[] = [];

    const swap = (leftIndex: number, rightIndex: number): void => {
        if (leftIndex === rightIndex) {
            return;
        }

        [inputArray[leftIndex], inputArray[rightIndex]] = [inputArray[rightIndex]!, inputArray[leftIndex]!];
        steps.push({
            type: 'swap',
            indices: [leftIndex, rightIndex],
            newArray: [...inputArray]
        });
    };

    const partition = (low: number, high: number): number => {
        const pivotValue = inputArray[high]!;
        let pivotIndex = low;

        for (let i = low; i < high; i++) {
            steps.push({ type: 'compare', indices: [i, high] });

            if (inputArray[i]! <= pivotValue) {
                swap(i, pivotIndex);
                pivotIndex++;
            }
        }

        swap(pivotIndex, high);
        return pivotIndex;
    };

    const quickSortHelper = (low: number, high: number): void => {
        if (low >= high) {
            return;
        }

        const pivotIndex = partition(low, high);
        quickSortHelper(low, pivotIndex - 1);
        quickSortHelper(pivotIndex + 1, high);
    };

    quickSortHelper(0, inputArray.length - 1);
    return steps;
};

export default QuickSort;
