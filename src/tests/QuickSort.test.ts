import { describe, it, expect } from 'vitest';
import QuickSort from '../algorithms/QuickSort';

const getFinalArray = (steps: ReturnType<typeof QuickSort>, fallback: number[]) => {
    const swapSteps = steps.filter(step => step.type === 'swap');
    return swapSteps[swapSteps.length - 1]?.newArray ?? fallback;
};

describe('QuickSort', () => {
    it('returns an empty steps array for a single-element array', () => {
        const steps = QuickSort([5]);
        expect(steps).toEqual([]);
    });

    it('sorts a reversed array', () => {
        const input = [5, 4, 3, 2, 1];
        const steps = QuickSort([...input]);
        expect(getFinalArray(steps, input)).toEqual([1, 2, 3, 4, 5]);
    });

    it('records compare steps against pivots', () => {
        const steps = QuickSort([2, 1]);
        const compareSteps = steps.filter(step => step.type === 'compare');
        expect(compareSteps.length).toBeGreaterThan(0);
    });

    it('handles duplicate values', () => {
        const input = [3, 1, 3, 1];
        const steps = QuickSort([...input]);
        expect(getFinalArray(steps, input)).toEqual([1, 1, 3, 3]);
    });
});
