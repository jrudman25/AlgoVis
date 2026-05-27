import { describe, it, expect } from 'vitest';
import SelectionSort from '../algorithms/SelectionSort';

const getFinalArray = (steps: ReturnType<typeof SelectionSort>, fallback: number[]) => {
    const swapSteps = steps.filter(step => step.type === 'swap');
    return swapSteps[swapSteps.length - 1]?.newArray ?? fallback;
};

describe('SelectionSort', () => {
    it('returns an empty steps array for a single-element array', () => {
        const steps = SelectionSort([5]);
        expect(steps).toEqual([]);
    });

    it('sorts a reversed array', () => {
        const input = [5, 4, 3, 2, 1];
        const steps = SelectionSort([...input]);
        expect(getFinalArray(steps, input)).toEqual([1, 2, 3, 4, 5]);
    });

    it('records compare steps while finding each minimum', () => {
        const steps = SelectionSort([2, 1]);
        const compareSteps = steps.filter(step => step.type === 'compare');
        expect(compareSteps.length).toBeGreaterThan(0);
    });

    it('handles duplicate values', () => {
        const input = [3, 1, 3, 1];
        const steps = SelectionSort([...input]);
        expect(getFinalArray(steps, input)).toEqual([1, 1, 3, 3]);
    });
});
