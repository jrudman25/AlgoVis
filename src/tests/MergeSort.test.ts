import { describe, it, expect } from 'vitest';
import MergeSort from '../algorithms/MergeSort';

describe('MergeSort', () => {
    it('returns an empty steps array for a single-element array', () => {
        const steps = MergeSort([5]);
        expect(steps).toEqual([]);
    });

    it('sorts a simple two-element array', () => {
        const steps = MergeSort([3, 1]);
        const swapSteps = steps.filter(s => s.type === 'swap');
        expect(swapSteps.length).toBeGreaterThan(0);
        const finalArray = swapSteps[swapSteps.length - 1]!.newArray!;
        expect(finalArray).toEqual([1, 3]);
    });

    it('sorts a reversed array', () => {
        const input = [5, 4, 3, 2, 1];
        const steps = MergeSort([...input]);
        const swapSteps = steps.filter(s => s.type === 'swap');
        const finalArray = swapSteps[swapSteps.length - 1]!.newArray!;
        expect(finalArray).toEqual([1, 2, 3, 4, 5]);
    });

    it('handles an already sorted array', () => {
        const steps = MergeSort([1, 2, 3, 4, 5]);
        const swapSteps = steps.filter(s => s.type === 'swap');
        const finalArray = swapSteps[swapSteps.length - 1]!.newArray!;
        expect(finalArray).toEqual([1, 2, 3, 4, 5]);
    });

    it('records compare steps during merging', () => {
        const steps = MergeSort([2, 1]);
        const compareSteps = steps.filter(s => s.type === 'compare');
        expect(compareSteps.length).toBeGreaterThan(0);
    });

    it('handles an array with duplicate values', () => {
        const steps = MergeSort([3, 1, 3, 1]);
        const swapSteps = steps.filter(s => s.type === 'swap');
        const finalArray = swapSteps[swapSteps.length - 1]!.newArray!;
        expect(finalArray).toEqual([1, 1, 3, 3]);
    });

    it('sorts a larger array correctly', () => {
        const input = [10, 7, 3, 9, 1, 5, 8, 2, 6, 4];
        const steps = MergeSort([...input]);
        const swapSteps = steps.filter(s => s.type === 'swap');
        const finalArray = swapSteps[swapSteps.length - 1]!.newArray!;
        expect(finalArray).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
});
