import { describe, it, expect } from 'vitest';
import BubbleSort from '../algorithms/BubbleSort';

describe('BubbleSort', () => {
    it('returns an empty steps array for an already sorted array of one element', () => {
        const steps = BubbleSort([5]);
        expect(steps).toEqual([]);
    });

    it('sorts a simple two-element array', () => {
        const steps = BubbleSort([3, 1]);
        const swapSteps = steps.filter(s => s.type === 'swap');
        expect(swapSteps.length).toBeGreaterThan(0);
        const finalArray = swapSteps[swapSteps.length - 1]!.newArray!;
        expect(finalArray).toEqual([1, 3]);
    });

    it('sorts a reversed array', () => {
        const input = [5, 4, 3, 2, 1];
        const steps = BubbleSort([...input]);
        const swapSteps = steps.filter(s => s.type === 'swap');
        const finalArray = swapSteps[swapSteps.length - 1]!.newArray!;
        expect(finalArray).toEqual([1, 2, 3, 4, 5]);
    });

    it('produces no swap steps for an already sorted array', () => {
        const steps = BubbleSort([1, 2, 3, 4, 5]);
        const swapSteps = steps.filter(s => s.type === 'swap');
        expect(swapSteps).toHaveLength(0);
    });

    it('records compare steps for each pair comparison', () => {
        const steps = BubbleSort([2, 1]);
        const compareSteps = steps.filter(s => s.type === 'compare');
        expect(compareSteps.length).toBeGreaterThan(0);
        expect(compareSteps[0]!.indices).toEqual([0, 1]);
    });

    it('handles an array with duplicate values', () => {
        const steps = BubbleSort([3, 1, 3, 1]);
        const swapSteps = steps.filter(s => s.type === 'swap');
        const finalArray = swapSteps[swapSteps.length - 1]!.newArray!;
        expect(finalArray).toEqual([1, 1, 3, 3]);
    });
});
